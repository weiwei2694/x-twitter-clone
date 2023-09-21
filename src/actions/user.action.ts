"use server";

import prisma from "@/lib/prismadb";

interface saveUserInterface {
	id: string;
	imageUrl: string;
	name: string;
	username: string;
	email: string;
	bio: string;
}

interface getUsersInterface {
	take?: number;
	skip?: number;
	userId: string;
	searchQuery?: string;
}

export async function saveUser({
	id,
	imageUrl,
	name,
	username,
	email,
	bio,
}: saveUserInterface) {
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

export async function getUsers({
	take = 2,
	skip = 0,
	userId,
	searchQuery = "",
}: getUsersInterface) {
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

export async function getUser(id: string) {
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
