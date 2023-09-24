import { Follower, User } from "@prisma/client";
import { InitialProps } from "./interface";

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

// action
export interface SaveUserActionProps {
	id: string;
	imageUrl: string;
	name: string;
	username: string;
	email: string;
	bio: string;
}

export interface GetUsersActionProps {
	take?: number;
	skip?: number;
	userId: string;
	searchQuery?: string;
}

export interface ToggleFollowUserActionProps {
	id?: string;
	userId?: string;
	currentUserId?: string;
	path: string;
}