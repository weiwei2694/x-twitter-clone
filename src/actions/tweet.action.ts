"use server";

import {
	CreateTweetActionProps,
	GetTweetsActionProps,
	ToggleLikeActionProps,
	ToggleBookmarkActionProps,
	GetTweetsBySearchActionProps,
} from "@/interfaces/tweet.interface";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const createTweetAction = async ({
	userId,
	imageUrl,
	text,
	parentId,
	path,
}: CreateTweetActionProps) => {
	try {
		return await prisma.thread.create({
			data: {
				userId,
				imageUrl,
				text,
				parentId
			},
		});
	} catch (error) {
		console.log("[ERROR_CREATE_TWEET_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};

export async function getTweetAction(id: string) {
	try {
		if (!id) throw new Error("id required");

		const existingTweet = await prisma.thread.findFirst({
			where: { id },
		});

		if (!existingTweet) return null;

		return await prisma.thread.findFirst({
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
	} catch (error) {
		console.log("[ERROR_GET_TWEET_ACTION]", error);
	}
}

export async function getTweetsAction({
	size = 20,
	page = 0,
	userId,
	isFollowing,
	parentId = "",
}: GetTweetsActionProps) {
	try {
		const skip = size * page;

		const where = {
			parentId: parentId ? { equals: parentId, not: null } : null,
			user: {
				followers: isFollowing ? { some: { followingId: userId } } : undefined,
			},
		};

		const include = {
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
		};

		return await prisma.thread.findMany({
			where,
			include,
			orderBy: {
				createdAt: "desc",
			},
			skip,
			take: size,
		});
	} catch (error) {
		console.log("[GET_TWEETS_ACTION]", error);
	}
}

export async function getTweetsByUserIdAction(
	userId: string,
	isReplies?: boolean
) {
	try {
		if (isReplies) {
			const replies = await prisma.thread.findMany({
				where: {
					userId,
					parentId: {
						not: null,
					},
				},
				include: {
					user: {
						include: {
							followers: true,
							followings: true,
						},
					},
					likes: true,
					bookmarks: true,
					replies: {
						select: {
							id: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return replies;
		}

		if (!userId) throw new Error("userId required");

		const tweets = await prisma.thread.findMany({
			where: {
				userId,
				parentId: null,
			},
			include: {
				user: {
					include: {
						followers: true,
						followings: true,
					},
				},
				likes: true,
				bookmarks: true,
				replies: {
					select: {
						id: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return tweets;
	} catch (error) {
		console.log("[ERROR_GET_TWEETS_BY_USER_ID_ACTION]", error);
	}
}

export async function getTweetsBySearchAction({
	size = 5,
	searchQuery = "",
}: GetTweetsBySearchActionProps) {
	try {
		const results = await prisma.thread.findMany({
			where: {
				parentId: null,
				OR: [
					{
						text: {
							contains: searchQuery,
						},
					},
					{
						user: {
							OR: [
								{
									name: {
										contains: searchQuery,
									},
								},
								{
									username: {
										contains: searchQuery,
									},
								},
							],
						},
					},
				],
			},
			include: {
				user: {
					include: {
						followers: true,
						followings: true,
					},
				},
				likes: true,
				bookmarks: true,
				replies: {
					select: {
						id: true,
					},
				},
			},
			orderBy: {
				likes: {
					_count: "desc",
				},
			},
			take: size,
		});

		return results;
	} catch (error) {
		console.info("[ERROR_GET_TWEETS_BY_SEARCH_ACTION]", error);
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
		console.log("[ERROR_DELETE_TWEET_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
}

export async function toggleLikeAction({
	userId = "",
	threadId = "",
	path,
}: ToggleLikeActionProps) {
	try {
		const existingLike = await prisma.like.findFirst({
			where: {
				userId,
				threadId,
			},
		});

		if (existingLike)
			return await prisma.like.delete({
				where: { id: existingLike.id },
			});

		return await prisma.like.create({
			data: {
				userId,
				threadId,
			},
		});
	} catch (error) {
		console.log("[ERROR_TOGGLE_LIKE_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
}

export async function getLikeTweetsByUserId(userId: string) {
	try {
		const likes = await prisma.like.findMany({
			where: { userId },
			include: {
				thread: {
					include: {
						user: {
							include: {
								followers: true,
								followings: true,
							},
						},
						likes: true,
						bookmarks: true,
						replies: {
							select: {
								id: true,
							},
						},
					},
				},
			},
			orderBy: {
				thread: {
					createdAt: "desc",
				},
			},
		});

		const tweets = likes.map((like) => like.thread);

		return tweets;
	} catch (error) {
		console.log("[ERROR_GET_LIKE_TWEETS]", error);
	}
}

export async function toggleBookmarkAction({
	userId = "",
	threadId = "",
	path,
}: ToggleBookmarkActionProps) {
	try {
		const existingBookmark = await prisma.bookmark.findFirst({
			where: {
				userId,
				threadId,
			},
		});

		if (existingBookmark)
			return await prisma.bookmark.delete({
				where: { id: existingBookmark.id },
			});

		return await prisma.bookmark.create({
			data: {
				userId,
				threadId,
			},
		});
	} catch (error) {
		console.log("[ERROR_TOGGLE_BOOKMARK_ACTION]", error);
	} finally {
		revalidatePath(path || "/home");
	}
}

export async function getBookmarksAction(userId: string) {
	try {
		if (!userId) throw new Error("userId required");

		const results = await prisma.bookmark.findMany({
			where: { userId },
			include: {
				thread: {
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

		if (!results) return [];

		const tweets = results.map((value) => value.thread);

		return tweets;
	} catch (error) {
		console.log("[ERROR_GET_BOOKMARKS_ACTION]", error);
	}
}

export async function deleteBookmarksAction(userId: string, path: string) {
	try {
		if (!userId) throw new Error("userId required");

		const deleteBookmarks = await prisma.bookmark.deleteMany({
			where: {
				userId,
			},
		});

		return deleteBookmarks;
	} catch (error) {
		console.log("[ERROR_DELETE_BOOKMARKS_ACTION]", error);
	} finally {
		revalidatePath(path || "/bookmarks");
	}
}
