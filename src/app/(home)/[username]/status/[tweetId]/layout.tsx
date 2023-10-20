import { getTweetAction } from "@/actions/tweet.action";
import NotFound from "@/components/sharing/404";
import ButtonCreatePostMobile from "@/components/sharing/ButtonCreatePostMobile";
import Loading from "@/components/sharing/Loading";
import DetailTweet from "@/components/tweetId/DetailTweet";
import Topbar from "@/components/tweetId/Topbar";
import { ReactNode, Suspense } from "react";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs";
import { getUserAction, getUserByUsernameAction } from "@/actions/user.action";
import { redirect } from "next/navigation";
import { DataTweet } from "@/interfaces/tweet.interface";

interface Props {
	children: ReactNode;
	params: {
		username: string;
		tweetId: string;
	};
}

export const generateMetadata = async ({ params }: Props) => {
	const { tweetId, username } = params;

	const [dataTweet, clerkUser, user] = await Promise.all([
		getTweetAction(tweetId),
		clerkCurrentUser(),
		getUserByUsernameAction(username),
	]);
	if (!dataTweet || !clerkUser || !user) return;

	return {
		title: `${dataTweet.user.name} on X: "${dataTweet.text}"`,
		description: dataTweet.text,
		openGraph: {
			title: `${dataTweet.user.name} on X`,
			description: dataTweet.text,
			url: `/${dataTweet.user.username}/status/${tweetId}`,
			images: [dataTweet.imageUrl],
			type: "article",
		},
	};
};

const Layout = async ({ children, params }: Props) => {
	const { tweetId, username } = params;

	const [dataTweet, clerkUser, user] = await Promise.all([
		getTweetAction(tweetId),
		clerkCurrentUser(),
		getUserByUsernameAction(username),
	]);

	if (!dataTweet || !clerkUser || !user) return <NotFound />;

	const currentUser = await getUserAction(clerkUser.id);
	if (!currentUser) redirect("/");

	const dataReplyTweet: DataTweet = {
		id: dataTweet.id,
		text: dataTweet.text,
		imageUrl: dataTweet.imageUrl,
		createdAt: dataTweet.createdAt,
		parentId: dataTweet.id,
		isParentIdExist: Boolean(dataTweet.parentId),
		user: {
			id: dataTweet.user.id,
			name: dataTweet.user.name,
			username: dataTweet.user.username,
			imageUrl: dataTweet.user.imageUrl,
		},
	};

	return (
		<>
			<ButtonCreatePostMobile isMobile dataTweet={dataReplyTweet} />
			<Topbar />
			<DetailTweet tweet={dataTweet} userId={currentUser.id} />
			<Suspense fallback={<Loading />}>{children}</Suspense>
		</>
	);
};

export default Layout;
