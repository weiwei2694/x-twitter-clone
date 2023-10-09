import Topbar from '@/components/notifications/Topbar'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const layout = ({ children }: Props) => {
  return (
    <>
      <Topbar />
      {children}
    </>
  )
}

export default layout