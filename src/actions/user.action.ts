"use server";

import { GetUsersActionProps, SaveUserActionProps, ToggleFollowUserActionProps } from "@/interfaces/user.interface";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export async function saveUserAction({
	id,
	imageUrl,
	name,
	username,
	email,
	bio,
}: SaveUserActionProps) {
	try {
		if (!id || !imageUrl || !name || !username || !email) return;

		const newUser = await prisma.user.create({
			data: {
				id,
				imageUrl,
				name,
				username,
				email,
				bio,
				isCompleted: true,
			},
		});

		return newUser;
	} catch (error: any) {
		console.log("[ERROR_SAVE_USER", error.message);
	}
}

export async function getUsersAction({
	take = 2,
	skip = 0,
	userId,
	searchQuery = "",
}: GetUsersActionProps) {
	try {
		const result = await prisma.user.findMany({
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

		return result;
	} catch (error: any) {
		console.log("[ERROR_GET_USERS]", error.message);
	}
}

export async function getUserAction(id: string) {
	try {
		if (!id) return;

		const result = await prisma.user.findUnique({
			where: { id },
			include: {
				followers: true,
				followings: true,
			},
		});

		if (!result) return;

		return result;
	} catch (error: any) {
		console.log("[ERROR_GET_USER", error.message);
	}
}

export const toggleFollowUserAction = async ({
	id,
	userId,
	currentUserId,
	path,
}: ToggleFollowUserActionProps) => {
	try {
		// delete
		if (id) {
			const result = await prisma.follower.delete({
				where: { id },
			});

			if (!result) return;

			return result;
		}

		// create
		if (!userId || !currentUserId) return;
		const result = await prisma.follower.create({
			data: {
				followerId: userId,
				followingId: currentUserId,
			},
		});

		if (!result) return;

		return result;
	} catch (error: any) {
		console.log("[ERROR_TOGGLE_FOLLOWER_USER_ACTION]", error.messsage);
	} finally {
		revalidatePath(path || "/home");
	}
};
