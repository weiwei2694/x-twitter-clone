import { DetailTweet } from "@/interfaces/tweet.interface";

// getTweetsAction
export type GetTweetsActionType = {
  data: DetailTweet[];
  hasNext: boolean;
}

export type WhereFilter = {
	parentId: string | null;
	user: {
		followers: { some: { followingId: string } | undefined };
	};
	bookmarks: { some: { userId: string } } | undefined;
	likes: { some: { userId: string } } | undefined;
	userId: string | undefined;
};
