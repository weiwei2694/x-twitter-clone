import { ReactNode } from "react";
import { getUserAction, getUsersAction } from "@/actions/user.action";
import Bottombar from "@/components/sharing/Bottombar";
import LeftSidebar from "@/components/sharing/leftsidebar/LeftSidebar";
import RightSidebar from "@/components/sharing/rightsidebar/RightSidebar";
import Modal from "@/components/modals/Modal";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getTotalNotificationsAction } from "@/actions/notification.action";

interface Props {
	children: ReactNode;
}

const layout = async ({ children }: Props) => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await getUserAction(clerkUser.id);
	if (!user) redirect("/");

	const isCompleted = user.isCompleted;
	if (!isCompleted) redirect("/onboarding");

	const [users, totalUnreadNotifications] = await Promise.all([
		getUsersAction({ userId: user.id }),
		getTotalNotificationsAction(user.id),
	]);

	return (
		<main className="min-h-screen">
			<Modal imageUrl={user.imageUrl} userId={user.id} />
			<section className="h-full max-w-7xl mx-auto flex justify-center">
				<LeftSidebar
					totalUnreadNotifications={totalUnreadNotifications ?? 0}
					username={user.username}
					name={user.name}
					imageUrl={user.imageUrl}
				/>
				<section className="max-sm:border-none border-x border-x-gray-300 max-sm:pb-32 sm:pb-0 w-full max-sm:max-w-full max-w-[600px]">
					{children}
				</section>
				<RightSidebar users={users?.data!} user={user} />
			</section>
			<Bottombar username={user.username} />
		</main>
	);
};

export default layout;
