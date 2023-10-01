import { getUserAction } from '@/actions/user.action';
import CreateTweetForm from '@/components/forms/createtweetform/CreateTweetForm';
import Topbar from '@/components/home/Topbar';
import ButtonCreatePostMobile from '@/components/sharing/ButtonCreatePostMobile';
import Loading from '@/components/sharing/Loading';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react'

interface Props {
  children: ReactNode
}

const layout = async ({ children }: Props) => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect('/');

  return (
    <>
      <ButtonCreatePostMobile />
      <Topbar user={user} />
      <section className="border-b border-gray-300 max-sm:hidden">
        <CreateTweetForm
          userId={user.id}
          imageUrl={user.imageUrl}
          htmlForId="home"
        />
      </section>
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </>
  )
}

export default layout