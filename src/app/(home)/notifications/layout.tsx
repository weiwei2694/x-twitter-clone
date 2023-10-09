import { getNotifications } from '@/actions/notification.action'
import { getUserAction } from '@/actions/user.action'
import Topbar from '@/components/notifications/Topbar'
import Loading from '@/components/sharing/Loading'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { ReactNode, Suspense } from 'react'

interface Props {
  children: ReactNode
}

const layout = async ({ children }: Props) => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect('/');

  let notifications = await getNotifications(user.id);
  if (!notifications) notifications = []

  const isNotificationEmpty = !Boolean(notifications.length);

  return (
    <>
      <Topbar userId={user.id} isNotificationEmpty={isNotificationEmpty} />
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </>
  )
}

export default layout