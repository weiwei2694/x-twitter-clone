"use server"

import prisma from "@/lib/prismadb"

interface createTweetInterface {
    userId: string;
    imageUrl?: string | undefined;
    text: string;
}

export const createTweet = async ({
    userId,
    imageUrl,
    text,
}: createTweetInterface) => {
    try {
        if (!text || !userId) return;

        const result = await prisma.thread.create({
            data: {
                userId,
                imageUrl,
                text
            }
        })

        if (!result) return;

        return result;
    } catch (error:any) {
        console.log("[ERROR_CREATE_TWEET]", error.message)
    }
}