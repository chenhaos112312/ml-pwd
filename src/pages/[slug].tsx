// @ts-nocheck
import Detail from "src/routes/Detail"
import { filterPosts } from "src/libs/utils/notion"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "src/routes/Error"
import { getRecordMap, getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { dehydrate } from "@tanstack/react-query"
import usePostQuery from "src/hooks/usePostQuery"
import { FilterPostsOptions } from "src/libs/utils/notion/filterPosts"
import { useState,useEffect } from 'react'
import md5 from 'js-md5'
import router from "next/router"
import useNotification from 'src/components/Notification'
// import { getPageTableOfContents } from 'lib/notion/getPageTableOfContents'
import { getPasswordQuery } from 'src/components/password'


const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

export const getStaticPaths = async () => {
  const posts = await getPosts()
  const filteredPost = filterPosts(posts, filter)

  return {
    paths: filteredPost.map((row) => `/${row.slug}`),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug

  const posts = await getPosts()
  const feedPosts = filterPosts(posts)
  await queryClient.prefetchQuery(queryKey.posts(), () => feedPosts)

  const detailPosts = filterPosts(posts, filter)
  const postDetail = detailPosts.find((t: any) => t.slug === slug)
  const recordMap = await getRecordMap(postDetail?.id!)

  await queryClient.prefetchQuery(queryKey.post(`${slug}`), () => ({
    ...postDetail,
    recordMap,
  }))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    // revalidate: CONFIG.revalidateTime,
  }
}

const DetailPage: NextPageWithLayout = () => {
  const post = usePostQuery()
  const [lock, setLock] = useState(post?.password && post?.password !== '')
  const { showNotification, Notification } = useNotification()
  console.log(lock,"-------是否加锁-----------")

   /**
   * 验证文章密码
   * @param {*} passInput
   */
   const validPassword = (passInput: any) => {
    if (!post) {
      return false
    }
    const encrypt = md5(post?.slug + passInput)
    console.log(encrypt,"----------encrypt----------")
    if (passInput && encrypt === md5(post?.slug + passInput)) {
      setLock(false)
      // 输入密码存入localStorage，下次自动提交
      localStorage.setItem('password_' + router.asPath, passInput)
      showNotification(CONFIG.locale.COMMON.ARTICLE_UNLOCK_TIPS) // 设置解锁成功提示显示
      return true
    }
    return false
  }
  // console.log(validPassword('123456'),"-------是否解锁-----------")
  // 文章加载
  useEffect(() => {
    // 文章加密
    if (post?.password && post?.password !== '') {
      setLock(true)
    } else {
      setLock(false)
    }

    // 读取上次记录 自动提交密码
    const passInputs = getPasswordQuery(router.asPath)
    if (passInputs.length > 0) {
      for (const passInput of passInputs) {
        if (validPassword(passInput)) {
          break // 密码验证成功，停止尝试
        }
      }
    }
  }, [post])

   // 文章加载
  //  useEffect(() => {
  //   if (lock) {
  //     return
  //   }
  //   // 文章解锁后生成目录与内容
  //   if (post?.recordMap?.block) {
  //     console.log(post?.recordMap,"-----------post.recordMap------useEffect------")
  //     post.content = Object.keys(post.recordMap.block).filter(
  //       key => post.recordMap.block[key]?.value?.parent_id === post.id
  //     )
  //     post.toc = getPageTableOfContents(post, post.recordMap)
  //   }
  // }, [router, lock])


  if (!post) return <CustomError />

  const image =
    post.thumbnail ??
    CONFIG.ogImageGenerateURL ??
    `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(post.title)}.png`

  const date = post.date?.start_date || post.createdTime || ""

  const meta = {
    title: post.title,
    date: new Date(date).toISOString(),
    image: image,
    description: post.summary || "",
    type: post.type[0],
    url: `${CONFIG.link}/${post.slug}`,
  }
  const props = { lock, validPassword }


  return (
    <>
      <MetaConfig {...meta} />
      {/* 解锁密码提示框 */}
      {post?.password && post?.password !== '' && !lock && <Notification />}
      <Detail  {...props} />
    </>
  )
}

DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
