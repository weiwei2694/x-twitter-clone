import { Bookmark, Like, Thread } from "@prisma/client";
import { UserWithFollowers } from "./user.interface";
import { InitialProps } from "./interface";

interface RepliesId {
	id: string;
}

interface Replies extends Thread {
	likes: Like[];
	user: UserWithFollowers;
	replies: RepliesId[];
	bookmarks: Bookmark[];
}

export interface MultipleTweetWithConnection extends Thread {
	replies: RepliesId[];
	user: UserWithFollowers;
	bookmarks: Bookmark[];
	likes: Like[];
}

export interface SingleTweetWithConnection extends MultipleTweetWithConnection {
	replies: Replies[];
	user: UserWithFollowers;
	bookmarks: Bookmark[];
	likes: Like[];
}

export interface DataTweet {
	id: string;
	text: string;
	imageUrl: string | null;
	createdAt: Date;
	parentId: string;
	user: {
		id: string;
		name: string;
		username: string;
		imageUrl: string;
	};
}

export interface DeleteTweetProps extends InitialProps {
	id: string;
}

export interface ToggleBookmarkTweetProps extends InitialProps {
	bookmark: Bookmark | undefined;
	userId: string;
	threadId: string;
}

export interface ToggleLikeTweetProps extends InitialProps {
	liked: Like | undefined;
	userId: string;
	currentUserId: string;
	threadId: string;
	path: string;
}

export interface CopyLinkTweetProps {
	toast: any;
	username: string;
	tweetId: string;
}

// action
export interface GetTweetsActionProps {
	take?: number;
	userId: string;
	isFollowing: boolean;
}

export interface CreateTweetActionProps {
	userId: string;
	imageUrl?: string | undefined;
	text: string;
	parentId?: string;
	path: string;
}

export interface GetTweetsBySearchActionProps {
	size?: number;
	searchQuery: string;
}

export interface ToggleLikeActionProps {
	likeId?: string;
	userId?: string;
	threadId?: string;
	path: string;
}

export interface ToggleBookmarkActionProps {
	bookmarkId?: string;
	userId?: string;
	threadId?: string;
	path: string;
}
