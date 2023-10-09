import { ReactNode } from "react"
import { getUserAction, getUsersAction } from '@/actions/user.action'
import Bottombar from '@/components/sharing/Bottombar'
import LeftSidebar from '@/components/sharing/leftsidebar/LeftSidebar'
import RightSidebar from '@/components/sharing/rightsidebar/RightSidebar'
import Modal from '@/components/modals/Modal'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getNotifications } from "@/actions/notification.action"

interface Props {
    children: ReactNode,
}

const layout = async ({ children}: Props) => {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const user = await getUserAction(clerkUser.id);
    if (!user) redirect("/");

    const isCompleted = user.isCompleted;
    if (!isCompleted) redirect("/onboarding");

    let users = await getUsersAction({ userId: user.id });
    if (!users?.length) users = [];

    let notifications = await getNotifications(user.id);
    notifications = notifications?.filter(notification => notification.isRead === false);

    return (
        <main className="max-h-screen overflow-hidden">
            <Modal imageUrl={user.imageUrl} userId={user.id} />
            <section className="h-full max-w-7xl mx-auto flex justify-center">
                <LeftSidebar
                    totalNotifications={notifications?.length ?? 0}
                    username={user.username}
                    name={user.name}
                    imageUrl={user.imageUrl}
                />
                <section className="hide-scrollbar max-sm:border-none border-l border-r border-gray-300 max-h-screen overflow-y-auto max-sm:pb-32 sm:pb-0 w-full max-sm:max-w-full max-w-[600px]">
                    {children}
                </section>
                <RightSidebar
                    users={users}
                    user={user}
                />
            </section>
            <Bottombar username={user.username} />
        </main>
    )
}

export default layout