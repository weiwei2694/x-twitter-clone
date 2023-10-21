import { getTweetsAction } from "@/actions/tweet.action";
import { getUserAction, getUserByUsernameAction } from "@/actions/user.action";
import Tweets from "@/components/cards/tweets/Tweets";
import PaginationButtons from "@/components/sharing/PaginationButtons";
import { isValidPage } from "@/lib/utils";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
	params: {
		tweetId: string;
		username: string;
	};
	searchParams: {
		page: string;
	};
}

const Page = async ({ params, searchParams }: Props) => {
	const { tweetId, username } = params;
	const { page: qPage } = searchParams;
	const page = isValidPage(qPage);

	const [clerkUser, user] = await Promise.all([
		clerkCurrentUser(),
		getUserByUsernameAction(username),
	]);
	if (!clerkUser) return null;

	const currentUser = await getUserAction(clerkUser.id);
	if (!currentUser) redirect("/");

	const tweets = await getTweetsAction({
		userId: currentUser.id,
		parentId: tweetId,
		isFollowing: false,
		page,
	});

	return (
		<>
			{tweets?.data.length ? (
				<>
					{tweets?.data.map((tweet) => (
						<Tweets key={tweet.id} tweet={tweet} userId={currentUser.id} />
					))}

					<PaginationButtons
						currentPage={page}
						currentPath={`/${user?.username}/status/${tweetId}`}
						hasNext={tweets.hasNext}
					/>
				</>
			) : null}
		</>
	);
};

export default Page;
