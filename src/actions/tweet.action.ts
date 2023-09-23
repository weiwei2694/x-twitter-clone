"use server";

import prisma from "@/lib/prismadb";

interface getTweetsInterface {
	take?: number;
	userId: string;
	isFollowing: boolean;
}

interface createTweetInterface {
	userId: string;
	imageUrl?: string | undefined;
	text: string;
	parentId?: string;
}

interface toggleLikeTweetInterface {
	likeId?: string;
	userId?: string;
	threadId?: string;
}

interface toggleBookmarkTweet {
	bookmarkId?: string;
	userId?: string;
	threadId?: string;
}

export const createTweet = async ({
	userId,
	imageUrl,
	text,
	parentId,
}: createTweetInterface) => {
	try {
		// if parentId exist -> create reply
		if (parentId) {
			const result = await prisma.thread.create({
				data: {
					userId,
					imageUrl,
					text,
					parentId,
				},
			});

			return result;
		}

		// if parentId doent's exist -> create tweet
		if (!text || !userId) return;

		const result = await prisma.thread.create({
			data: {
				userId,
				imageUrl,
				text,
			},
		});

		return result;
	} catch (error: any) {
		console.log("[ERROR_CREATE_TWEET]", error.message);
	}
};

export async function getTweets({
	take = 20,
	userId,
	isFollowing,
}: getTweetsInterface) {
	try {
		if (isFollowing) {
			const results = await prisma.thread.findMany({
				where: {
					parentId: null,
					user: {
						followers: {
							some: {
								followingId: userId,
							},
						},
					},
				},
				include: {
					user: {
						include: {
							followers: true,
							followings: true,
							bookmarks: true,
						},
					},
					bookmarks: true,
					likes: true,
					replies: {
						select: {
							id: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
				take,
			});

			return results;
		}

		const results = await prisma.thread.findMany({
			where: {
				parentId: null,
			},
			include: {
				user: {
					include: {
						followers: true,
						followings: true,
						bookmarks: true,
					},
				},
				bookmarks: true,
				likes: true,
				replies: {
					select: {
						id: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take,
		});

		return results;
	} catch (error: any) {
		console.log("[ERROR_GET_TWEETS]", error.message);
	}
}

export async function toggleLikeTweet({
	likeId = "",
	userId,
	threadId,
}: toggleLikeTweetInterface) {
	try {
		// unlike
		const exits = await prisma.like.findUnique({
			where: { id: likeId },
		});

		if (exits) {
			const result = await prisma.like.delete({
				where: { id: likeId },
			});

			return result;
		}

		// like
		if (!userId || !threadId) return;

		const result = await prisma.like.create({
			data: {
				userId,
				threadId,
			},
		});

		if (!result) return;

		return result;
	} catch (error: any) {
		console.log("[ERROR_TOGGLE_LIKE_TWEET]", error.message);
	}
}

export async function toggleBookmarkTweet({
	bookmarkId = "",
	userId,
	threadId,
}: toggleBookmarkTweet) {
	try {
		// delete bookmark
		const exits = await prisma.bookmark.findUnique({
			where: { id: bookmarkId },
		});

		if (exits) {
			const result = await prisma.bookmark.delete({
				where: { id: bookmarkId },
			});

			return result;
		}

		// add bookmark
		if (!userId || !threadId) return;

		const result = await prisma.bookmark.create({
			data: {
				userId,
				threadId,
			},
		});

		if (!result) return;

		return result;
	} catch (error: any) {
		console.log("[ERROR_TOGGLE_BOOKMARK_TWEET]", error.message);
	}
}

export async function deleteTweetAction(id: string) {
	try {
		if (!id) return;

		const result = await prisma.thread.delete({
			where: { id },
		});

		return result;
	} catch (error: any) {
		console.log("[ERROR_DELETE_TWEET_ACTION]", error.message);
	}
}
