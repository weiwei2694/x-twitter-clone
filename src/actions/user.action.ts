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
                isCompleted: true
			},
		});

		return newUser;
	} catch (error: any) {
		console.log("[ERROR_SAVE_USER", error.message);
	}
}

export async function getUser(id: string){
    try {
        if (!id) return;

        const result = await prisma.user.findUnique({
            where: { id }
        });

        if (!result) return;

        return result;
    } catch (error: any) {
        console.log("[ERROR_GET_USER", error.message);
    }
}