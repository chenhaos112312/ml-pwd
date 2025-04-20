import React, { ReactNode } from "react"
import { Noto_Color_Emoji } from "next/font/google"
// import { Noto_Music } from "next/font/google"



const notoColorEmoji = Noto_Color_Emoji({
  weight: ["400"],
  subsets: ["emoji"],
})

// const notoMusic = Noto_Music({
//   weight: ["400"],
//   subsets: ["music"],
// })

type Props = {
  className?: string
  children?: ReactNode
}

export const Emoji = ({ className, children }: Props) => {
  return (
    <span className={className} css={[notoColorEmoji.style]}>
      {children}
    </span>
  )
}

// export const Music = ({ className, children }: Props) => {  //chenhao 2024-2-4添加测试
//   return (
//     <span className={className} css={[notoMusic.style]}>
//       {children}
//     </span>
//   )
// }
