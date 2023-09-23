"use server"

import prisma from "@/lib/prismadb"

interface Props {
    id?: string;
    userId?: string;
    currentUserId?: string;
}

export const toggleFollowUserAction = async ({
    id,
    userId,
    currentUserId
}: Props) => {
    // delete
    if (id) {
        const result = await prisma.follower.delete({
            where: { id }
        })

        if (!result) return;

        return result
    }

    // create
    if (!userId || !currentUserId) return;
    const result = await prisma.follower.create({
        data: {
            followerId: userId,
            followingId: currentUserId
        }
    })

    if (!result) return;

    return result;
}