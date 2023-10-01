import Loading from "@/components/sharing/Loading"
import { ReactNode, Suspense } from "react"

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </>
  )
}

export default Layout