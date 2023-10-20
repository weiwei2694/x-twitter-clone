import { getTweetsAction } from "@/actions/tweet.action";
import { getUserAction } from "@/actions/user.action";
import Tweets from "@/components/cards/tweets/Tweets";
import NotFound from "@/components/sharing/NotFound";
import PaginationButtons from "@/components/sharing/PaginationButtons";
import { isValidPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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

	const tweets = await getTweetsAction({
		userId: user.id,
		isBookmarks: true,
		page,
	});

	const isBookmarksEmpty = !tweets?.data.length;

	return (
		<>
			{!isBookmarksEmpty ? (
				<>
					{tweets?.data.map((tweet) => (
						<Tweets key={tweet.id} tweet={tweet} userId={user.id} />
					))}

					<PaginationButtons
						currentPage={page}
						currentPath={"/bookmarks"}
						hasNext={tweets.hasNext}
					/>
				</>
			) : (
				<NotFound
					title="Save posts for later"
					description="Bookmark posts to easily find them again in the future."
				/>
			)}
		</>
	);
};

export default Page;
