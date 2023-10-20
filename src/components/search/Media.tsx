"use client";

import { GetTweetsActionType } from "@/types/tweet.type";
import Tweets from "../cards/tweets/Tweets";
import PaginationButtons from "../sharing/PaginationButtons";

interface Props {
	tweets: GetTweetsActionType;
	userId: string;
	page: number;
	queryQ: string;
}

const Media = ({ tweets, userId, page, queryQ }: Props) => {
	const path = `/search?q=${queryQ}&f=media`;

	return tweets?.data.length ? (
		<>
			{tweets.data.map((tweet) => (
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

export default Media;
