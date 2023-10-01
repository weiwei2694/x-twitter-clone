import { getBookmarksAction } from '@/actions/tweet.action';
import { getUserAction } from '@/actions/user.action';
import Topbar from '@/components/bookmarks/Topbar';
import ButtonCreatePostMobile from '@/components/sharing/ButtonCreatePostMobile';
import Loading from '@/components/sharing/Loading';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react'

interface Props {
  children: ReactNode
}

const Layout = async ({ children }: Props) => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user || "message" in user) redirect("/")

  let bookmarks = await getBookmarksAction(user.id)
  if (!bookmarks || "message" in bookmarks) bookmarks = []

  const isBookmarksEmpty = !bookmarks.length;

  return (
    <>
      <ButtonCreatePostMobile />
      <Topbar
        username={user.username}
        userId={user.id}
        isBookmarksEmpty={isBookmarksEmpty}
      />
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </>
  )
}

export default Layout