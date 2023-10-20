"use client";
import Logout from "./Logout";
import Lists from "./Lists";

interface LeftSidebarProps {
	username: string;
	name: string;
	imageUrl: string;
	totalUnreadNotifications: number;
}

const LeftSidebar = ({
	username,
	name,
	imageUrl,
	totalUnreadNotifications,
}: LeftSidebarProps) => {
	return (
		<aside className="w-fit max-w-[280px] h-screen p-3 max-sm:hidden sm:flex max-h-screen sticky top-0">
			<section className="overflow-y-auto space-y-20 flex flex-col justify-between">
				<Lists
					totalUnreadNotifications={totalUnreadNotifications}
					username={username}
				/>
				<Logout imageUrl={imageUrl} name={name} username={username} />
			</section>
		</aside>
	);
};

export default LeftSidebar;
