"use server";

import {
	GetUsersActionProps,
	SaveUserActionProps,
	ToggleFollowUserActionProps,
	UpdateUserActionProps,
} from "@/interfaces/user.interface";
import prisma from "@/lib/prismadb";
import { GetUsersActionType } from "@/types/user.type";
import { revalidatePath } from "next/cache";

export async function saveUserAction({
	id,
	imageUrl,
	name,
	username,
	email,
	bio,
	isCompleted,
}: SaveUserActionProps) {
	try {
		if (!id) throw new Error("id required");
		if (!imageUrl) throw new Error("imageUrl required");
		if (!name) throw new Error("name required");
		if (!username) throw new Error("username required");
		if (!email) throw new Error("email required");
		if (!isCompleted) throw new Error("isCompleted required");

		// is user data already exists
		const existingUser = await prisma.user.findUnique({
			where: { id },
		});

		// if user existing, update data user
		if (existingUser) {
			const updateUser = await prisma.user.update({
				where: { id },
				data: {
					name,
					imageUrl,
					bio,
					isCompleted,
				},
			});

			return updateUser;
		}

		// if user not existing, create new one
		const newUser = await prisma.user.create({
			data: {
				id,
				imageUrl,
				name,
				username,
				email,
				bio,
				isCompleted,
			},
		});

		return newUser;
	} catch (error) {
		console.log("[ERROR_SAVE_USER_ACTION]", error);
	}
}

export async function getUsersAction({
	size = 5,
	page = 0,
	userId,
	searchQuery = "",
	isOnSearch,
}: GetUsersActionProps): Promise<GetUsersActionType | undefined> {
	try {
		if (!userId) throw new Error("userId required");
		if (isOnSearch && !searchQuery) return;

		let whereFilter = {
			NOT: {
				followers: {
					some: { followingId: userId },
				},
			},
			id: { not: userId },
		} as any;

		if (isOnSearch) {
			whereFilter = {
				id: { not: userId },
				OR: [
					{
						username: { contains: searchQuery },
					},
					{
						name: { contains: searchQuery },
					},
				],
			};
		}

		const skip = size * page;
		const data = await prisma.user.findMany({
			where: whereFilter,
			skip,
			take: size,
		});

		const remainingData = await prisma.user.count({
			where: whereFilter,
		});
		const hasNext = Boolean(remainingData - skip - data.length);

		return {
			data,
			hasNext,
		};
	} catch (error) {
		console.log("[ERROR_GET_USERS_ACTION]", error);
	}
}

export async function getUserAction(id: string) {
	try {
		if (!id) throw new Error("id required");

		const result = await prisma.user.findUnique({
			where: { id },
			include: {
				followers: true,
				followings: true,
			},
		});

		return result;
	} catch (error) {
		console.log("[ERROR_USER_ACTION]", error);
	}
}

export async function updateUserAction({
	id,
	imageUrl,
	bannerUrl,
	name,
	bio,
	location,
	website,
	path,
}: UpdateUserActionProps) {
	try {
		if (!id) throw new Error("id required");
		if (!imageUrl) throw new Error("bannerUrl required");
		if (!name) throw new Error("name required");

		const updateUser = await prisma.user.update({
			where: { id },
			data: {
				imageUrl,
				name,
				bannerUrl,
				bio,
				location,
				website,
			},
		});

		return updateUser;
	} catch (error) {
		console.log("[ERROR_UPDATE_USER_ACTION]", error);
	} finally {
		revalidatePath(path || "");
	}
}

export async function getUserByUsernameAction(username: string) {
	try {
		if (!username) throw new Error("username required");

		const user = await prisma.user.findUnique({
			where: { username },
			include: {
				followers: true,
				followings: true,
			},
		});

		return user;
	} catch (error) {
		console.info("[ERROR_GET_USER_BY_USERNAME_ACTION]", error);
	}
}

export const toggleFollowUserAction = async ({
	userId,
	currentUserId,
	path,
}: ToggleFollowUserActionProps) => {
	try {
		const existingUser = await prisma.follower.findFirst({
			where: {
				followerId: userId,
				followingId: currentUserId,
			},
		});

		if (existingUser) {
			return await prisma.follower.delete({
				where: { id: existingUser.id },
			});
		}

		return await prisma.follower.create({
			data: {
				followerId: userId,
				followingId: currentUserId,
			},
		});
	} catch (error) {
		console.log("[ERROR_TOGGLE_FOLLOW_USER_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};
