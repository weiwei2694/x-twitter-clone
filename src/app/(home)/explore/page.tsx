import { getUserAction, getUsersAction } from '@/actions/user.action'
import Topbar from '@/components/explore/Topbar'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import ShowUsersData from '@/components/explore/ShowUsersData'
import ButtonCreatePostMobile from '@/components/sharing/ButtonCreatePostMobile'

const Page = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect('/');

  let users = await getUsersAction({
    userId: user.id,
    size: 20,
  });
  if (!users?.length) users = [];

  return (
    <>
      <ButtonCreatePostMobile />
      <Topbar user={user} />
      <ShowUsersData
        initialDataUsers={users!}
        user={user}
      />
    </>
  )
}

export default Page