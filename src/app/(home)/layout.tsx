import { ReactNode } from "react"
import { getUserAction, getUsersAction } from '@/actions/user.action'
import Bottombar from '@/components/sharing/Bottombar'
import LeftSidebar from '@/components/sharing/LeftSidebar'
import RightSidebar from '@/components/sharing/RightSidebar'
import Modal from '@/components/modals/Modal'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface Props {
    children: ReactNode,
}

const layout = async ({ children}: Props) => {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const user = await getUserAction(clerkUser.id);
    if (!user || "message" in user) redirect("/");

    const isCompleted = user.isCompleted;
    if (!isCompleted) redirect("/onboarding");

    let users = await getUsersAction({ userId: user.id });
    if (!users || "message" in users) users = [];

    return (
        <main className="max-h-screen overflow-hidden">
            <Modal imageUrl={user.imageUrl} userId={user.id} />
            <section className="h-full max-w-7xl mx-auto flex">
                <LeftSidebar username={user.username} name={user.name} imageUrl={user.imageUrl} />
                <section className="hide-scrollbar w-full max-h-screen overflow-y-auto max-sm:pb-32 sm:pb-0">
                    {children}
                </section>
                <RightSidebar users={users} user={user} />
            </section>
            <Bottombar username={user.username} />
        </main>
    )
}

export default layout