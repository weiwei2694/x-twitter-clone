"use server"

import prisma from "@/lib/prismadb"

interface Props {
    userId: string;
    currentUserId: string;
}

export async function followUser({ userId, currentUserId }: Props){
    try {
        if (!userId || !currentUserId) return;

        const result = await prisma.follower.create({
            data: {
                followerId: userId,
                followingId: currentUserId
            }
        })

        if (!result) return;

        return result;
    } catch (error:any) {
        console.log("[ERROR_FOLLOW_USER]", error.message)
    }
}

export async function unfollowUser(id: string){
    try {
        if (!id) return;

        const result = await prisma.follower.delete({
            where: { id }
        })

        if (!result) return;

        return result;
    } catch (error:any) {
        console.log("[ERROR_FOLLOW_USER]", error.message)
    }
}
