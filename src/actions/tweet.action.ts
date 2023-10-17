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
				parentId,
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
					select: {
						id: true,
						imageUrl: true,
						name: true,
						username: true,
						followers: true,
						followings: true,
					},
				},
				bookmarks: true,
				likes: true,
				_count: {
					select: {
						replies: true,
					},
				},
			},
		});
	} catch (error) {
		console.log("[ERROR_GET_TWEET_ACTION]", error);
	}
}

type WhereFilter = {
	parentId: string | null;
	user: {
		followers: { some: { followingId: string } | undefined }
	};
	bookmarks: { some: { userId: string } } | undefined;
	likes: { some: { userId: string } } | undefined;
	userId: string | undefined;
}

export async function getTweetsAction({
	size = 30,
	page = 0,
	userId,
	isFollowing = false,
	isBookmarks = false,
	isProfile = false,
	isReplies = false,
	isLikes = false,
	parentId = "",
}: GetTweetsActionProps) {
	try {
		if (!userId) throw new Error("userId required");

		const skip = size * page;

		const whereFilter = {
			parentId: isReplies ? { not: null } : parentId ? parentId : null,
			user: {
				followers: isFollowing ? { some: { followingId: userId } } : undefined,
			},
		} as WhereFilter;

		if (isBookmarks) {
			whereFilter.bookmarks = {
				some: {
					userId,
				},
			};
		}

		if (isProfile) {
			whereFilter.userId = userId
		}

		if (isLikes) {
			whereFilter.likes = {
				some: {
					userId
				}
			}
		}

		const data = await prisma.thread.findMany({
			where: whereFilter,
			include: {
				user: {
					select: {
						id: true,
						imageUrl: true,
						name: true,
						username: true,
						followers: true,
						followings: true,
					},
				},
				bookmarks: true,
				likes: true,
				_count: {
					select: {
						replies: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			skip,
			take: size,
		});

		const totalCount = await prisma.thread.count({
			where: whereFilter,
		});
		const hasNext = Boolean(totalCount - skip - data.length);

		return {
			data,
			hasNext,
		};
	} catch (error) {
		console.log("[GET_TWEETS_ACTION]", error);
	}
}

export async function getTweetsByUserIdAction(
	userId: string,
	isReplies?: boolean
) {
	try {
		if (!userId) throw new Error("userId required");

		return await prisma.thread.findMany({
			where: {
				userId,
				parentId: isReplies ? { not: null } : null,
			},
			include: {
				user: {
					select: {
						id: true,
						imageUrl: true,
						username: true,
						name: true,
						followers: true,
						followings: true,
					},
				},
				likes: true,
				bookmarks: true,
				_count: {
					select: {
						replies: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	} catch (error) {
		console.log("[ERROR_GET_TWEETS_BY_USER_ID_ACTION]", error);
	}
}

export async function getTweetsBySearchAction({
	size = 5,
	searchQuery = "",
}: GetTweetsBySearchActionProps) {
	try {
		return await prisma.thread.findMany({
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
					select: {
						id: true,
						username: true,
						name: true,
						imageUrl: true,
						followers: true,
						followings: true,
					},
				},
				likes: true,
				bookmarks: true,
				_count: {
					select: {
						replies: true,
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

export async function getLikeTweetsByUserIdAction(userId: string) {
	try {
		const likes = await prisma.like.findMany({
			where: { userId },
			include: {
				thread: {
					include: {
						user: {
							select: {
								id: true,
								imageUrl: true,
								username: true,
								name: true,
								followers: true,
								followings: true,
							},
						},
						likes: true,
						bookmarks: true,
						_count: {
							select: {
								replies: true,
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

		return await prisma.thread.findMany({
			where: {
				bookmarks: {
					some: {
						userId,
					},
				},
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
						imageUrl: true,
						followers: true,
						followings: true,
					},
				},
				bookmarks: true,
				likes: true,
				_count: {
					select: {
						replies: true,
					},
				},
			},
		});

		// const results = await prisma.bookmark.findMany({
		// 	where: { userId },
		// 	include: {
		// 		thread: {
		// 			include: {
		// 				user: {
		// 					select: {
		// 						id: true,
		// 						name: true,
		// 						username: true,
		// 						imageUrl: true,
		// 						followers: true,
		// 						followings: true,
		// 					},
		// 				},
		// 				bookmarks: true,
		// 				likes: true,
		// 				_count: {
		// 					select: {
		// 						replies: true
		// 					}
		// 				}
		// 			},
		// 		},
		// 	},
		// });

		// if (!results) return [];

		// const tweets = results.map((value) => value.thread);

		// return tweets;
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
