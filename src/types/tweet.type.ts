import { DetailTweet } from "@/interfaces/tweet.interface";
import { Bookmark, Like, Thread } from "@prisma/client";
import { BatchPayload } from ".";

export type WhereFilter = {
	parentId: string | null;
	user: {
		followers: { some: { followingId: string } | undefined };
	};
	bookmarks: { some: { userId: string } } | undefined;
	likes: { some: { userId: string } } | undefined;
	userId: string | undefined;
};

export type GetTweetsActionType =
	| {
			data: DetailTweet[];
			hasNext: boolean;
	  }
	| undefined;
export type CreateTweetActionType = Thread | undefined;
export type GetTweetActionType = DetailTweet | undefined | null;
export type GetTotalTweetsActionType = number | undefined;
export type DeleteTweetActionType = Thread | undefined;
export type ToggleLikeActionType = Like | undefined;
export type ToggleBookmarkActionType = Bookmark | undefined;
export type GetTotalBookmarksActionType = number | undefined;
export type DeleteBookmarksAction = BatchPayload | undefined;
