"use server";

import {
	CreateTweetActionProps,
	GetTweetsActionProps,
	ToggleLikeActionProps,
	ToggleBookmarkActionProps,
	GetTweetsBySearchActionProps,
} from "@/interfaces/tweet.interface";
import prisma from "@/lib/prismadb";
import {
	CreateTweetActionType,
	DeleteBookmarksAction,
	DeleteTweetActionType,
	GetTotalBookmarksActionType,
	GetTotalTweetsActionType,
	GetTweetActionType,
	GetTweetsActionType,
	ToggleBookmarkActionType,
	ToggleLikeActionType,
	WhereFilter,
} from "@/types/tweet.type";
import { revalidatePath } from "next/cache";

/**
 * Creates a new tweet action.
 *
 * @param {CreateTweetActionProps} param - The parameters for creating the tweet action.
 * @param {string} param.userId - The ID of the user creating the tweet action.
 * @param {string} param.imageUrl - The URL of the image associated with the tweet action.
 * @param {string} param.text - The text content of the tweet action.
 * @param {string} param.parentId - The ID of the parent tweet action, if any.
 * @param {string} param.path - The path of the tweet action.
 * @return {Promise<CreateTweetActionType>} The created tweet action.
 */
export const createTweetAction = async ({
	userId,
	imageUrl,
	text,
	parentId,
	path,
}: CreateTweetActionProps): Promise<CreateTweetActionType> => {
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

/**
 * Retrieves a tweet action by its ID.
 *
 * @param {string} id - The ID of the tweet action.
 * @return {Promise<GetTweetActionType>} A promise that resolves to the tweet action object, or null if not found.
 */
export async function getTweetAction(id: string): Promise<GetTweetActionType> {
	try {
		if (!id) throw new Error("id required");

		const existingTweet = await prisma.thread.findFirst({
			where: { id },
		});

		if (!existingTweet) return;

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

/**
 * Retrieves tweets based on the provided parameters.
 *
 * @param {GetTweetsActionProps} param - The parameters for retrieving tweets.
 * @param {number} param.size - The number of tweets to retrieve per page. Default is 30.
 * @param {number} param.page - The page number of tweets to retrieve. Default is 0.
 * @param {string} param.userId - The ID of the user whose tweets are being retrieved.
 * @param {boolean} param.isFollowing - Whether to retrieve tweets from users that the specified user is following. Default is false.
 * @param {boolean} param.isBookmarks - Whether to retrieve bookmarked tweets of the specified user. Default is false.
 * @param {boolean} param.isProfile - Whether to retrieve tweets of the specified user's profile. Default is false.
 * @param {boolean} param.isReplies - Whether to retrieve tweets that are replies to other tweets. Default is false.
 * @param {boolean} param.isLikes - Whether to retrieve tweets that the specified user has liked. Default is false.
 * @param {string} param.parentId - The ID of the parent tweet if retrieving replies. Default is an empty string.
 * @return {Promise<GetTweetsActionType>} - A promise that resolves to the retrieved tweets.
 */
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
}: GetTweetsActionProps): Promise<GetTweetsActionType> {
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
			whereFilter.userId = userId;
		}

		if (isLikes) {
			whereFilter.likes = {
				some: {
					userId,
				},
			};
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

/**
 * Calculates the total number of tweets based on the given criteria.
 *
 * @param {GetTweetsActionProps} getTweetsActionProps - The properties for getting tweets.
 * @param {string} getTweetsActionProps.userId - The ID of the user.
 * @param {boolean} [getTweetsActionProps.isFollowing=false] - Indicates whether to include tweets from users the user is following.
 * @param {boolean} [getTweetsActionProps.isBookmarks=false] - Indicates whether to include bookmarked tweets.
 * @param {boolean} [getTweetsActionProps.isProfile=false] - Indicates whether to include tweets from the user's profile.
 * @param {boolean} [getTweetsActionProps.isReplies=false] - Indicates whether to include replies to tweets.
 * @param {boolean} [getTweetsActionProps.isLikes=false] - Indicates whether to include tweets that the user has liked.
 * @param {string} [getTweetsActionProps.parentId=""] - The ID of the parent tweet.
 * @return {Promise<GetTotalTweetsActionType>} The total number of tweets that match the criteria, or undefined if an error occurs.
 */
export async function getTotalTweetsAction({
	userId,
	isFollowing = false,
	isBookmarks = false,
	isProfile = false,
	isReplies = false,
	isLikes = false,
	parentId = "",
}: GetTweetsActionProps): Promise<GetTotalTweetsActionType> {
	try {
		if (!userId) throw new Error("userId required");

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
			whereFilter.userId = userId;
		}

		if (isLikes) {
			whereFilter.likes = {
				some: {
					userId,
				},
			};
		}

		return await prisma.thread.count({
			where: whereFilter,
		});
	} catch (error) {
		console.info("[ERROR_GET_TOTAL_TWEETS_ACTION]", error);
	}
}

/**
 * Retrieves tweets based on a search query.
 *
 * @param {GetTweetsBySearchActionProps} param - The parameter object.
 * @param {number} param.size - The number of tweets to retrieve (default: 30).
 * @param {number} param.page - The page of tweets to retrieve (default: 0).
 * @param {string} param.searchQuery - The search query to filter tweets by (default: "").
 * @return {Promise<GetTweetsActionType>} A promise that resolves to an object containing the retrieved tweets and a flag indicating whether there is more data to fetch.
 */
export async function getTweetsBySearchAction({
	size = 30,
	page = 0,
	searchQuery = "",
}: GetTweetsBySearchActionProps): Promise<GetTweetsActionType> {
	try {
		const skip = size * page;

		const whereFilter = {
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
		} as any;

		const data = await prisma.thread.findMany({
			where: whereFilter,
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
			skip,
			take: size,
		});

		const remainingData = await prisma.thread.count({
			where: whereFilter,
		});
		const hasNext = Boolean(remainingData - skip - data.length);

		return {
			data,
			hasNext,
		};
	} catch (error) {
		console.info("[ERROR_GET_TWEETS_BY_SEARCH_ACTION]", error);
	}
}

/**
 * Deletes a tweet action.
 *
 * @param {string} id - The ID of the tweet.
 * @param {string} path - The path to revalidate.
 * @returns {Promise<DeleteTweetActionType>} The result of the delete operation.
 */
export async function deleteTweetAction(
	id: string,
	path: string,
): Promise<DeleteTweetActionType> {
	try {
		if (!id) throw new Error("id required");

		return await prisma.thread.delete({
			where: { id },
		});
	} catch (error) {
		console.log("[ERROR_DELETE_TWEET_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
}

/**
 * Toggles the like action for a user on a thread.
 *
 * @param {ToggleLikeActionProps} props - The parameters for the like action.
 * @param {string} props.userId - The ID of the user performing the action.
 * @param {string} props.threadId - The ID of the thread to like/unlike.
 * @param {string} props.path - The path to revalidate after the action.
 * @return {Promise<ToggleLikeActionType>} - The result of the like action.
 */
export async function toggleLikeAction({
	userId = "",
	threadId = "",
	path,
}: ToggleLikeActionProps): Promise<ToggleLikeActionType> {
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

/**
 * Toggles a bookmark for a user on a specific thread.
 *
 * @param {ToggleBookmarkActionProps} props - The properties for the toggle bookmark action.
 * @param {string} props.userId - The ID of the user.
 * @param {string} props.threadId - The ID of the thread.
 * @param {string} props.path - The path for revalidation (optional).
 * @return {Promise<ToggleBookmarkActionType>} - The result of the toggle bookmark action.
 */
export async function toggleBookmarkAction({
	userId = "",
	threadId = "",
	path,
}: ToggleBookmarkActionProps): Promise<ToggleBookmarkActionType> {
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

/**
 * Retrieves the total number of bookmarks for a given user.
 *
 * @param {string} userId - The ID of the user.
 * @return {Promise<number>} - The total number of bookmarks.
 */
export async function getTotalBookmarksAction(
	userId: string,
): Promise<GetTotalBookmarksActionType> {
	try {
		if (!userId) throw new Error("userId required");

		return await prisma.thread.count({
			where: {
				bookmarks: {
					some: {
						userId,
					},
				},
			},
		});
	} catch (error) {
		console.log("[ERROR_GET_BOOKMARKS_ACTION]", error);
	}
}

/**
 * Deletes all bookmarks for a given user and revalidates the specified path.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} path - The path to revalidate (default: "/bookmarks").
 * @return {Promise<DeleteBookmarksAction>} - The number of bookmarks deleted.
 */
export async function deleteBookmarksAction(
	userId: string,
	path: string,
): Promise<DeleteBookmarksAction> {
	try {
		if (!userId) throw new Error("userId required");

		return await prisma.bookmark.deleteMany({
			where: {
				userId,
			},
		});
	} catch (error) {
		console.log("[ERROR_DELETE_BOOKMARKS_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
}
