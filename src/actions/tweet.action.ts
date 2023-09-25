"use server";

import {
	CreateTweetActionProps,
	GetTweetsActionProps,
	ToggleLikeActionProps,
	ToggleBookmarkActionProps,
} from "@/interfaces/tweet.interface";
import prisma from "@/lib/prismadb";
import { getErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const createTweetAction = async ({
	userId,
	imageUrl,
	text,
	parentId,
	path,
}: CreateTweetActionProps) => {
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

		if (!userId) throw new Error("userId required");
		if (!text) throw new Error("text required");
		
		// if parentId doent's exist -> create tweet
		const result = await prisma.thread.create({
			data: {
				userId,
				imageUrl,
				text,
			},
		});

		return result;
	} catch (error) {
		console.log("[ERROR_CREATE_TWEET_ACTION]", error)
		return {
			message: getErrorMessage(error)
		}
	} finally {
		revalidatePath(path || "/home");
	}
};

export async function getTweetsAction({
	take = 20,
	userId,
	isFollowing,
}: GetTweetsActionProps) {
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
	} catch (error) {
		console.log("[GET_TWEETS_ACTION]", error)
		return {
			message: getErrorMessage(error)
		}
	}
}

export async function toggleLikeAction({
	likeId = "",
	userId,
	threadId,
	path,
}: ToggleLikeActionProps) {
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
		if (!userId) throw new Error("userId required");
		if (!threadId) throw new Error("threadId required");

		const result = await prisma.like.create({
			data: {
				userId,
				threadId,
			},
		});

		return result;
	} catch (error) {
		console.log("[ERROR_TOGGLE_LIKE_ACTION]", error)
		return {
			message: getErrorMessage(error)
		}
	} finally {
		revalidatePath(path || "/home");
	}
}

export async function toggleBookmarkAction({
	bookmarkId = "",
	userId,
	threadId,
	path,
}: ToggleBookmarkActionProps) {
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
		if (!userId) throw new Error("userId required");
		if (!threadId) throw new Error("threadId required");

		const result = await prisma.bookmark.create({
			data: {
				userId,
				threadId,
			},
		});

		return result;
	} catch (error) {
		console.log("[ERROR_TOGGLE_BOOKMARK_ACTION]", error)
		return {
			message: getErrorMessage(error)
		}
	} finally {
		revalidatePath(path || "/home");
	}
}

export async function deleteTweetAction(id: string, path: string) {
	try {
		if (!id) throw new Error("id required");

		const result = await prisma.thread.delete({
			where: { id },
		});

		return result;
	} catch (error) {
		console.log("[ERROR_DELETE_TWEET_ACTION]", error)
		return {
			message: getErrorMessage(error)
		}
	} finally {
		revalidatePath(path || "/home");
	}
}

export async function getTweetAction(id: string) {
	try {
		if (!id) throw new Error("id required");

		const result = await prisma.thread.findUnique({
			where: { id },
			include: {
				user: {
					include: {
						followers: true,
						followings: true,
					},
				},
				bookmarks: true,
				likes: true,
				replies: {
					orderBy: {
						createdAt: "desc",
					},
					include: {
						user: {
							include: {
								followers: true,
								followings: true,
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
				},
			},
		});

		return result;
	} catch (error) {
		console.log("[ERROR_GET_TWEET_ACTION]", error);
		return {
			message: getErrorMessage(error)
		}
	}
}
