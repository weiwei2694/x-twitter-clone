"use server";

import {
	GetUsersActionProps,
	SaveUserActionProps,
	ToggleFollowUserActionProps,
	UpdateUserActionProps,
} from "@/interfaces/user.interface";
import prisma from "@/lib/prismadb";
import {
	GetUserActionType,
	GetUserByUsernameActionType,
	GetUsersActionType,
	SaveUserActionType,
	ToggleFollowUserActionType,
	UpdateUserActionType,
} from "@/types/user.type";
import { revalidatePath } from "next/cache";

/**
 * Saves user action with the given parameters.
 *
 * @param {SaveUserActionProps} props - The props for saving the user action.
 * @param {string} props.id - The ID of the user.
 * @param {string} props.imageUrl - The URL of the user's image.
 * @param {string} props.name - The name of the user.
 * @param {string} props.username - The username of the user.
 * @param {string} props.email - The email of the user.
 * @param {string} props.bio - The bio of the user.
 * @param {boolean} props.isCompleted - Indicates if the user action is completed.
 * @return {Promise<SaveUserActionType>} The updated user object or undefined if not found.
 */
export async function saveUserAction({
	id,
	imageUrl,
	name,
	username,
	email,
	bio,
	isCompleted,
}: SaveUserActionProps): Promise<SaveUserActionType> {
	try {
		if (!id) throw new Error("id required");
		if (!name) throw new Error("name required");

		const existingUser = await prisma.user.findUnique({
			where: { id },
		});

		if (existingUser) {
			return await prisma.user.update({
				where: { id },
				data: {
					name,
					bio,
					isCompleted,
				},
			});
		}

		if (!imageUrl) throw new Error("imageUrl required");
		if (!username) throw new Error("username required");
		if (!email) throw new Error("email required");

		return await prisma.user.create({
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
	} catch (error) {
		console.log("[ERROR_SAVE_USER_ACTION]", error);
	}
}

/**
 * Retrieves a list of users based on the provided parameters.
 *
 * @param {GetUsersActionProps} props - The parameters for fetching users.
 * @param {number} [props.size = 5] - The number of users to fetch per page.
 * @param {number} [props.page = 0] - The page number.
 * @param {string} props.userId - The ID of the user.
 * @param {string} [props.searchQuery = ""] - The search query for filtering users.
 * @param {boolean} porps.isOnSearch - Indicates whether the search query is active.
 * @return {Promise<GetUsersActionType>} - A promise that resolves to the fetched users.
 */
export async function getUsersAction({
	size = 5,
	page = 0,
	userId,
	searchQuery = "",
	isOnSearch,
}: GetUsersActionProps): Promise<GetUsersActionType> {
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

/**
 * Retrieves a user's information and related data.
 *
 * @param {string} id - The ID of the user.
 * @return {Promise<GetUserActionType>} The user's information and related data.
 */
export async function getUserAction(id: string): Promise<GetUserActionType> {
	try {
		if (!id) throw new Error("id required");

		return await prisma.user.findUnique({
			where: { id },
			include: {
				followers: true,
				followings: true,
			},
		});
	} catch (error) {
		console.log("[ERROR_USER_ACTION]", error);
	}
}

/**
 * Updates a user's information.
 *
 * @param {UpdateUserActionProps} props - The properties to update the user with.
 * @param {string} props.id - The ID of the user.
 * @param {string} props.imageUrl - The URL of the user's image.
 * @param {string} props.bannerUrl - The URL of the user's banner.
 * @param {string} props.name - The name of the user.
 * @param {string} props.bio - The bio of the user.
 * @param {string} props.location - The location of the user.
 * @param {string} props.website - The website of the user.
 * @param {string} props.path - The path of the user.
 * @return {Promise<UpdateUserActionType>} The updated user object.
 */
export async function updateUserAction({
	id,
	imageUrl,
	bannerUrl,
	name,
	bio,
	location,
	website,
	path,
}: UpdateUserActionProps): Promise<UpdateUserActionType> {
	try {
		if (!id) throw new Error("id required");
		if (!imageUrl) throw new Error("bannerUrl required");
		if (!name) throw new Error("name required");

		return await prisma.user.update({
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
	} catch (error) {
		console.log("[ERROR_UPDATE_USER_ACTION]", error);
	} finally {
		revalidatePath(path || "");
	}
}

/**
 * Fetches a user from the database based on the provided username.
 *
 * @param {string} username - The username of the user to fetch.
 * @return {Promise<GetUserByUsernameActionType>} A promise that resolves to the user object.
 */
export async function getUserByUsernameAction(
	username: string,
): Promise<GetUserByUsernameActionType> {
	try {
		if (!username) throw new Error("username required");

		return await prisma.user.findUnique({
			where: { username },
			include: {
				followers: true,
				followings: true,
			},
		});
	} catch (error) {
		console.info("[ERROR_GET_USER_BY_USERNAME_ACTION]", error);
	}
}

/**
 * Toggles the follow status of a user.
 *
 * @param {ToggleFollowUserActionProps} props - An object containing the following properties:
 * @param {string} props.userId - The ID of the user to be followed/unfollowed.
 * @param {string} props.currentUserId - The ID of the current user performing the action.
 * @param {string} props.path - The path to revalidate after the action is performed.
 * @return {Promise<ToggleFollowUserActionType>} - A promise that resolves to the updated follower object.
 */
export const toggleFollowUserAction = async ({
	userId,
	currentUserId,
	path,
}: ToggleFollowUserActionProps): Promise<ToggleFollowUserActionType> => {
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
