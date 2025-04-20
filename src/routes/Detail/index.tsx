// @ts-nocheck
import useMermaidEffect from "./hooks/useMermaidEffect"
import PostDetail from "./PostDetail"
import PageDetail from "./PageDetail"
import styled from "@emotion/styled"
import usePostQuery from "src/hooks/usePostQuery"
import { ArticleLock } from 'src/components/ArticleLock'

type Props = {}

const Detail: React.FC<Props> = (props) => {
  console.log(props,"-----------detail props-------------")
  const { lock, validPassword } = props
  console.log(lock,"----------lock-------")
  const data = usePostQuery()
  useMermaidEffect()

  if (!data) return null
  return (
    <StyledWrapper data-type={data.type}>
      {lock && <ArticleLock validPassword={validPassword} />}
    
      {!lock && data.type[0] === "Page" &&(
         <PageDetail />
      )}
      {!lock && data.type[0] !== "Page" &&(
        <PostDetail />
      )}
    </StyledWrapper>
  )
}

export default Detail

const StyledWrapper = styled.div`
  padding: 2rem 0;

  &[data-type="Paper"] {
    padding: 40px 0;
  }
`
