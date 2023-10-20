import { Follower, User } from "@prisma/client";
import { InitialProps } from ".";

export interface UserWithFollowers extends User {
	followers: Follower[];
	followings: Follower[];
}

export interface toggleFollowUserProps extends InitialProps {
	username: string;
	followed: Follower | undefined;
	userId: string;
	currentUserId: string;
}

export interface CopyLinkUserProps {
	toast: any;
	username: string;
}

// action
export interface SaveUserActionProps {
	id: string;
	imageUrl?: string;
	name: string;
	username?: string;
	email?: string;
	bio: string;
	isCompleted: boolean;
}

export interface GetUsersActionProps {
	size?: number;
	page?: number;
	userId: string;
	searchQuery?: string;
	isOnSearch?: boolean;
	isOnExplore?: boolean;
}

export interface UpdateUserActionProps {
	id: string;
	imageUrl: string;
	bannerUrl?: string | undefined;
	name: string;
	bio: string;
	location: string;
	website: string;
	path: string;
}

export interface ToggleFollowUserActionProps {
	userId: string;
	currentUserId: string;
	path: string;
}
