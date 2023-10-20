"use client";

import Tweets from "../cards/tweets/Tweets";
import { GetTweetsActionType } from "@/types/tweet.type";
import PaginationButtons from "../sharing/PaginationButtons";

interface Props {
	userId: string;
	tweets: GetTweetsActionType;
	queryQ: string;
	page: number;
}

const Latest = ({ userId, tweets, queryQ, page }: Props) => {
	const ascendingTweets = tweets?.data.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime() as number;
			const dateB = new Date(b.createdAt).getTime() as number;
			return dateB - dateA;
		}),
		path = `/search?q=${queryQ}&f=latest`;

	return tweets?.data.length && ascendingTweets?.length ? (
		<>
			{ascendingTweets.map((tweet) => (
				<Tweets key={tweet.id} tweet={tweet} userId={userId} />
			))}

			<PaginationButtons
				currentPage={page}
				currentPath={path}
				hasNext={tweets.hasNext}
			/>
		</>
	) : null;
};

export default Latest;
