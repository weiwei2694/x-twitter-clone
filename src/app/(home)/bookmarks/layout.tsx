import { getTotalBookmarksAction } from "@/actions/tweet.action";
import { getUserAction } from "@/actions/user.action";
import Topbar from "@/components/bookmarks/Topbar";
import ButtonCreatePostMobile from "@/components/sharing/ButtonCreatePostMobile";
import Loading from "@/components/sharing/Loading";
import { currentUser } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
	title: "Bookmarks",
	openGraph: {
		title: "Bookmarks",
		siteName: "X (formerly Twitter)",
	},
};

interface Props {
	children: ReactNode;
}

const Layout = async ({ children }: Props) => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await getUserAction(clerkUser.id);
	if (!user) redirect("/");

	const bookmarks = await getTotalBookmarksAction(user.id);

	return (
		<>
			<ButtonCreatePostMobile />
			<Topbar
				username={user.username}
				userId={user.id}
				isBookmarksEmpty={!Boolean(bookmarks)}
			/>
			<Suspense fallback={<Loading />}>{children}</Suspense>
		</>
	);
};

export default Layout;
