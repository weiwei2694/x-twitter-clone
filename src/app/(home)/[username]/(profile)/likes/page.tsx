import { getTweetsAction } from "@/actions/tweet.action";
import { getUserAction, getUserByUsernameAction } from "@/actions/user.action";
import NotFound from "@/components/sharing/NotFound";
import Tweets from "@/components/cards/tweets/Tweets";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { isValidPage } from "@/lib/utils";
import PaginationButtons from "@/components/sharing/PaginationButtons";

interface Props {
	params: {
		username: string;
	};
	searchParams: {
		page: string;
	};
}

export const generateMetadata = async ({ params }: Props) => {
	const { username } = params;
	const user = await getUserByUsernameAction(username);

	if (!user) {
		return {
			title: "Profile",
		};
	}

	return {
		title: `Posts with liked by ${user.name} (${user.username})`,
		openGraph: {
			title: `Posts with liked by ${user.name} (${user.username})`,
		},
	};
};

const Page = async ({ params, searchParams }: Props) => {
	const { username } = params;
	const { page: qPage } = searchParams;
	const page = isValidPage(qPage);

	// currentUser()
	const clerkUser = await clerkCurrentUser();
	if (!clerkUser) return null;

	const currentUser = await getUserAction(clerkUser.id);
	if (!currentUser) redirect("/");

	const user = await getUserByUsernameAction(username);
	if (!user) return <NotFound />;

	let tweets = await getTweetsAction({
		userId: user.id,
		isProfile: true,
		isLikes: true,
		page,
	});

	/**
	 * Generates a comment for the given function body.
	 *
	 * @return {JSX.Element} The JSX element of the NotFound component.
	 */
	const savePostsForLater = (): JSX.Element => {
		const isSameUserId = currentUser.id === user.id;
		const title = isSameUserId
			? "You don’t have any likes yet"
			: `@${user.username} hasn’t`;
		const description = isSameUserId
			? "Tap the heart on any post to show it some love. When you do, it’ll show up here.."
			: "When they do, those posts will show up here.";

		return <NotFound title={title} description={description} />;
	};

	return !tweets?.data.length ? (
		savePostsForLater()
	) : (
		<>
			{tweets?.data.map((tweet) => (
				<Tweets key={tweet.id} tweet={tweet} userId={user.id} />
			))}

			<PaginationButtons
				currentPage={page}
				currentPath={`/${user.username}/likes`}
				hasNext={tweets.hasNext}
			/>
		</>
	);
};

export default Page;
