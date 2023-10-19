import { User } from "@prisma/client";

export type GetUsersActionType = {
	data: User[];
	hasNext: boolean;
} | undefined;

export type SaveUserActionType = User | undefined;
