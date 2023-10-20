import { UserWithFollowers } from "@/interfaces/user.interface";
import { Follower, User } from "@prisma/client";

export type GetUsersActionType =
	| {
			data: User[];
			hasNext: boolean;
	  }
	| undefined;

export type SaveUserActionType = User | undefined;

export type GetUserActionType = UserWithFollowers | null | undefined;

export type UpdateUserActionType = User | undefined;

export type GetUserByUsernameActionType = GetUserActionType;

export type ToggleFollowUserActionType = Follower | undefined;
