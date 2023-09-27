"use server";

import {
	GetUsersActionProps,
	SaveUserActionProps,
	ToggleFollowUserActionProps,
	UpdateUserActionProps,
} from "@/interfaces/user.interface";
import prisma from "@/lib/prismadb";
import { getErrorMessage } from "@/lib/utils";
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
		return {
			message: getErrorMessage(error),
		};
	}
}

export async function getUsersAction({
	take = 10,
	skip = 0,
	userId,
	searchQuery = "",
	isOnSearch,
}: GetUsersActionProps) {
	try {
		if (!userId) throw new Error("userId required");

		if (isOnSearch) {
			const users = await prisma.user.findMany({
				where: {
					id: {
						not: userId,
					},
					username: {
						contains: searchQuery,
					},
				},
				take,
				skip,
			});

			return users;
		}

		const users = await prisma.user.findMany({
			where: {
				id: {
					not: userId,
				},
				username: {
					contains: searchQuery,
				},
				followers: {
					none: {
						NOT: {
							followerId: userId,
						},
					},
				},
			},
			take,
			skip,
		});

		return users;
	} catch (error) {
		console.log("[ERROR_GET_USERS_ACTION]", error);
		return {
			message: getErrorMessage(error),
		};
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
		return {
			message: getErrorMessage(error),
		};
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
	path
}: UpdateUserActionProps){
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
				website
			}
		})

		return updateUser;
	} catch (error) {
		console.log("[ERROR_UPDATE_USER_ACTION]", error)
		return {
			message: getErrorMessage(error)
		}
	} finally {
		revalidatePath(path || "")
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
		return {
			message: getErrorMessage(error),
		};
	}
}

export const toggleFollowUserAction = async ({
	id,
	userId,
	currentUserId,
	path,
}: ToggleFollowUserActionProps) => {
	try {
		// if id exist
		if (id) {
			// delete current follower
			const result = await prisma.follower.delete({
				where: { id },
			});

			return result;
		}

		// userId and currentUserId is required, to create new follower
		if (!userId) throw new Error("userId required");
		if (!currentUserId) throw new Error("currentUserId");

		// create
		const result = await prisma.follower.create({
			data: {
				followerId: userId,
				followingId: currentUserId,
			},
		});

		return result;
	} catch (error) {
		console.log("[ERROR_TOGGLE_FOLLOW_USER_ACTION]", error);
		return {
			message: getErrorMessage(error),
		};
	} finally {
		revalidatePath(path || "/home");
	}
};
