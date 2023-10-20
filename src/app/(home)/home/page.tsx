import { getTweetsAction } from "@/actions/tweet.action";
import { currentUser } from "@clerk/nextjs";
import { getUserAction } from "@/actions/user.action";
import { redirect } from "next/navigation";
import NotFound from "@/components/sharing/NotFound";
import Tweets from "@/components/cards/tweets/Tweets";
import { isValidPage } from "@/lib/utils";
import PaginationButtons from "@/components/sharing/PaginationButtons";

interface Props {
	searchParams: {
		page: string;
	};
}

const Page = async ({ searchParams }: Props) => {
	const { page: qPage } = searchParams;
	const page = isValidPage(qPage);

	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await getUserAction(clerkUser.id);
	if (!user) redirect("/");

	const isFollowing = false;
	const tweets = await getTweetsAction({ userId: user.id, isFollowing, page });

	return (
		<>
			{tweets?.data.length ? (
				<>
					{tweets?.data.map((tweet) => (
						<Tweets key={tweet.id} tweet={tweet} userId={user.id} />
					))}

					<PaginationButtons
						currentPage={page}
						currentPath={"/home"}
						hasNext={tweets.hasNext}
					/>
				</>
			) : (
				<NotFound description="No posts can be displayed" />
			)}
		</>
	);
};

export default Page;
