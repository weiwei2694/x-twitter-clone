import { Bookmark, Follower, Like, Thread } from "@prisma/client";
import { UserWithFollowers } from "./user.interface";
import { InitialProps } from "./interface";

interface RepliesId {
	id: string;
}

interface User {
	id: string;
	imageUrl: string;
	username: string;
	name: string;
	followings: Follower[];
	followers: Follower[];
}

interface Replies extends Thread {
	likes: Like[];
	user: UserWithFollowers;
	replies: RepliesId[];
	bookmarks: Bookmark[];
}

export interface DetailTweet extends Thread {
	user: User;
	likes: Like[];
	bookmarks: Bookmark[];
	_count: {
		replies: number;
	}
}

export interface DataTweet {
	id: string;
	text: string;
	imageUrl: string | null;
	createdAt: Date;
	parentId: string;
	isParentIdExist: boolean;
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
	size?: number;
	page?: number;
	userId: string;
	isFollowing: boolean;
	parentId?: string;
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
	userId: string;
	threadId: string;
	path: string;
}

export interface ToggleBookmarkActionProps {
	userId: string;
	threadId: string;
	path: string;
}
