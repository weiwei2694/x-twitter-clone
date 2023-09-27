import { ReactNode } from 'react'
import { currentUser as clerkCurrentUser } from "@clerk/nextjs";
import { getUserAction, getUserByUsernameAction } from "@/actions/user.action";
import { redirect } from 'next/navigation';
import NotFound from '@/components/404';
import UserProfile from '@/components/profile/UserProfile';
import Topbar from '@/components/profile/Topbar';
import Tabs from '@/components/profile/Tabs';

interface Props {
  children: ReactNode;
  params: {
    username: string;
  },
}

const Layout = async ({ children, params }: Props) => {
  const username = params.username;

  // currentUser()
  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const currentUser = await getUserAction(clerkUser.id);
  if (!currentUser || "message" in currentUser) redirect('/');

  const user = await getUserByUsernameAction(username);
  if (!user || "message" in user) return <NotFound />;

  return (
    <>
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