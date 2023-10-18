"use server";

import {
	GetUsersActionProps,
	SaveUserActionProps,
	ToggleFollowUserActionProps,
	UpdateUserActionProps,
} from "@/interfaces/user.interface";
import prisma from "@/lib/prismadb";
import { GetUsersActionType } from "@/types/user.type";
import { User } from "@prisma/client";
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
			where: whereFilter
		})
		const hasNext = Boolean(remainingData - skip - data.length);

		return {
			data,
			hasNext,
		}
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

// Just to create fake user data
export const createManyUser = async () => {
	await prisma.user.createMany({
		data: [
			{
				id: "3fb1263a-f92e-4a04-a678-cb5f7acfc0b5",
				name: "John Doe",
				username: "johndoe",
				email: "john.doe@example.com",
				imageUrl: "johndoe.jpg",
				bannerUrl: "banner_johndoe.jpg",
				location: "New York",
				website: "www.johndoe.com",
				bio: "Hello, I'm John Doe.",
			},
			{
				id: "d5e04c90-8d14-43a9-850d-0a4ebe9e24dd",
				name: "Jane Smith",
				username: "janesmith",
				email: "jane.smith@example.com",
				imageUrl: "janesmith.jpg",
				bannerUrl: "banner_janesmith.jpg",
				location: "Los Angeles",
				website: "www.janesmith.com",
				bio: "Hi there, I'm Jane Smith.",
			},
			{
				id: "2a899f90-9aa5-49d4-8752-18012f40e57c",
				name: "James Johnson",
				username: "jamesjohnson",
				email: "james.johnson@example.com",
				imageUrl: "jamesjohnson.jpg",
				bannerUrl: "banner_jamesjohnson.jpg",
				location: "Chicago",
				website: "www.jamesjohnson.com",
				bio: "Hey, I'm James Johnson.",
			},
			{
				id: "14b2a6a6-22a4-4ca1-8964-9b88a34d9df2",
				name: "Emily Wilson",
				username: "emilywilson",
				email: "emily.wilson@example.com",
				imageUrl: "emilywilson.jpg",
				bannerUrl: "banner_emilywilson.jpg",
				location: "Houston",
				website: "www.emilywilson.com",
				bio: "Greetings, I'm Emily Wilson.",
			},
			{
				id: "9a1b1406-422a-4bc5-8ea0-4af286f3b4ce",
				name: "William Jones",
				username: "williamjones",
				email: "william.jones@example.com",
				imageUrl: "williamjones.jpg",
				bannerUrl: "banner_williamjones.jpg",
				location: "Phoenix",
				website: "www.williamjones.com",
				bio: "Hello, I'm William Jones.",
			},
			{
				id: "76878ac9-c09e-4e87-86ea-1a9a273207bf",
				name: "Sophia Brown",
				username: "sophiabrown",
				email: "sophia.brown@example.com",
				imageUrl: "sophiabrown.jpg",
				bannerUrl: "banner_sophiabrown.jpg",
				location: "Philadelphia",
				website: "www.sophiabrown.com",
				bio: "Hey, I'm Sophia Brown.",
			},
			{
				id: "3d1b8466-3a7e-4f2c-911a-e437d62dcaea",
				name: "Liam Harris",
				username: "liamharris",
				email: "liam.harris@example.com",
				imageUrl: "liamharris.jpg",
				bannerUrl: "banner_liamharris.jpg",
				location: "San Antonio",
				website: "www.liamharris.com",
				bio: "Hi there, I'm Liam Harris.",
			},
			{
				id: "cbb3012d-cd3e-4013-ae8d-10ec81d780fb",
				name: "Olivia Lewis",
				username: "olivialewis",
				email: "olivia.lewis@example.com",
				imageUrl: "olivialewis.jpg",
				bannerUrl: "banner_olivialewis.jpg",
				location: "San Diego",
				website: "www.olivialewis.com",
				bio: "Hello, I'm Olivia Lewis.",
			},
		],
		skipDuplicates: true,
	});
};
