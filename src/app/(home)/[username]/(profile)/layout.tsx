import { ReactNode } from 'react'
import { currentUser as clerkCurrentUser } from "@clerk/nextjs";
import { getUserAction, getUserByUsernameAction } from "@/actions/user.action";
import { redirect } from 'next/navigation';
import NotFound from '@/components/sharing/404';
import UserProfile from '@/components/profile/UserProfile';
import Topbar from '@/components/profile/Topbar';
import Tabs from '@/components/profile/Tabs';
import ButtonCreatePostMobile from '@/components/sharing/ButtonCreatePostMobile';

interface Props {
  children: ReactNode;
  params: {
    username: string;
  },
}

export const generateMetadata = async ({ params }: Props) => {
  const { username } = params;
  const user = await getUserByUsernameAction(username);

  if (!user) {
    return {
      title: "Profile"
    }
  }

  return {
    description: user.bio,
    openGraph: {
      description: user.bio,
      type: 'profile',
      images: [user.imageUrl],
      siteName: "X (formerly Twitter)",
      url: `${process.env.NEXT_PUBLIC_NEXT_URL}/${user.username}`
    }
  }
}

const Layout = async ({ children, params }: Props) => {
  const username = params.username;

  // currentUser()
  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const currentUser = await getUserAction(clerkUser.id);
  if (!currentUser) redirect('/');

  const user = await getUserByUsernameAction(username);
  if (!user) return <NotFound />;

  return (
    <>
      <ButtonCreatePostMobile />
      <Topbar
        name={user.name}
        username={user.username}
        userId={user.id}
      />
      <UserProfile
        isMyProfile={currentUser.id === user.id}
        user={user}
        currentUser={{ id: currentUser.id, username: currentUser.username }}
      />
      <Tabs username={user.username} />
      {children}
    </>
  )
}

export default Layout