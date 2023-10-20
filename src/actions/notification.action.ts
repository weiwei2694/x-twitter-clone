"use server";

import {
	CommentPostNotificationActionProps,
	FollowUserNotificationActionProps,
	GetNotificationsActionProps,
	LikePostNotificationActionProps,
	ReplyCommentPostNotificationActionProps,
} from "@/interfaces/notification.interface";
import prisma from "@/lib/prismadb";
import {
	CommentPostNotificationActionType,
	FollowUserNotificationActionType,
	GetNotificationsActionType,
	GetTotalNotificationsActionType,
	LikePostNotificationActionType,
	ReplyCommentPostNotificationActionType,
} from "@/types/notification.type";
import { revalidatePath } from "next/cache";

/**
 * Creates a follow user notification action.
 *
 * @param {FollowUserNotificationActionProps} param - The parameters for creating the follow user notification action.
 * @param {string} param.userId - The ID of the user.
 * @param {string} param.parentIdUser - The ID of the parent user.
 * @param {string} param.sourceId - The ID of the source.
 * @param {string} param.path - The path for revalidation.
 * @return {Promise<FollowUserNotificationActionType>} The created follow user notification action.
 */
export const followUserNotificationAction = async ({
	userId,
	parentIdUser,
	sourceId,
	path,
}: FollowUserNotificationActionProps): Promise<FollowUserNotificationActionType> => {
	try {
		if (!userId) throw new Error("userId required");
		if (!parentIdUser) throw new Error("parentIdUser required");
		if (!sourceId) throw new Error("sourceId required");
		if (!path) throw new Error("path required");

		return await prisma.notification.create({
			data: {
				userId,
				parentIdUser,
				sourceId,
				activityType: "Follow",
				parentType: "User",
			},
		});
	} catch (error) {
		console.info("[ERROR_FOLLOW_USER_NOTIFICATION_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};

/**
 * Creates a notification for when a post is liked.
 *
 * @param {LikePostNotificationActionProps} props - The properties for creating the notification.
 * @param {string} props.userId - The ID of the user who liked the post.
 * @param {string} props.sourceId - The ID of the post being liked.
 * @param {string} props.parentIdPost - The ID of the parent post.
 * @param {string} props.path - The path to revalidate.
 * @return {Promise<LikePostNotificationActionType>} - The created notification.
 */
export const likePostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: LikePostNotificationActionProps): Promise<LikePostNotificationActionType> => {
	try {
		if (!userId) throw new Error("userId required");
		if (!sourceId) throw new Error("sourceId required");
		if (!parentIdPost) throw new Error("parentIdPost required");
		if (!path) throw new Error("path required");

		return await prisma.notification.create({
			data: {
				userId,
				sourceId,
				parentIdPost,
				activityType: "Like",
				parentType: "Post",
			},
		});
	} catch (error) {
		console.info("[ERROR_LIKE_POST_NOTIFICATION]", error);
	} finally {
		revalidatePath(path);
	}
};

/**
 * Creates a comment post notification action.
 *
 * @param {CommentPostNotificationActionProps} props - The properties for the comment post notification action.
 * @param {string} props.userId - The ID of the user.
 * @param {string} props.sourceId - The ID of the source.
 * @param {string} props.parentIdPost - The ID of the parent post.
 * @param {string} props.path - The path.
 * @return {Promise<CommentPostNotificationAction>} - A promise that resolves when the notification is created.
 */
export const commentPostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: CommentPostNotificationActionProps): Promise<CommentPostNotificationActionType> => {
	try {
		if (!userId) throw new Error("userId required");
		if (!sourceId) throw new Error("sourceId required");
		if (!parentIdPost) throw new Error("parentIdPost required");
		if (!path) throw new Error("path required");

		return await prisma.notification.create({
			data: {
				userId,
				sourceId,
				parentIdPost,
				parentType: "Post",
				activityType: "Comment",
			},
		});
	} catch (error) {
		console.info("[ERROR_COMMENT_POST_NOTIFICATION]", error);
	} finally {
		revalidatePath(path);
	}
};

/**
 * Reply to a comment and create a notification.
 *
 * @param {ReplyCommentPostNotificationActionProps} props - The properties for the reply comment post notification action.
 * @param {string} props.userId - The ID of the user replying to the comment.
 * @param {string} props.sourceId - The ID of the source.
 * @param {string} props.parentIdPost - The ID of the parent post.
 * @param {string} props.path - The path.
 * @return {Promise<ReplyCommentPostNotificationActionType>} The created notification.
 */
export const replyCommentPostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: ReplyCommentPostNotificationActionProps): Promise<ReplyCommentPostNotificationActionType> => {
	try {
		if (!userId) throw new Error("userId required");
		if (!sourceId) throw new Error("sourceId required");
		if (!parentIdPost) throw new Error("parentIdPost required");
		if (!path) throw new Error("path required");

		return await prisma.notification.create({
			data: {
				userId,
				sourceId,
				parentIdPost,
				parentType: "Post",
				activityType: "Reply",
			},
		});
	} catch (error) {
		console.info("[ERROR_REPLY_COMMENT_POST_NOTIFICATION]", error);
	} finally {
		revalidatePath(path);
	}
};

/**
 * Retrieves notifications for a specific user.
 *
 * @param {GetNotificationsActionProps} props - The parameters for retrieving notifications.
 * @param {string} props.userId - The ID of the user.
 * @param {number} props.size - The number of notifications to retrieve per page (default is 30).
 * @param {number} props.page - The page number to retrieve (default is 0).
 * @return {Promise<GetNotificationsActionType>} - The notifications for the user.
 */
export const getNotificationsAction = async ({
	userId,
	size = 30,
	page = 0,
}: GetNotificationsActionProps): Promise<GetNotificationsActionType> => {
	try {
		if (!userId) throw new Error("userId required");

		const skip = size * page;

		const data = await prisma.notification.findMany({
			where: { userId },
			include: {
				sourceUser: {
					select: {
						id: true,
						username: true,
						imageUrl: true,
					},
				},
				post: {
					select: {
						id: true,
						text: true,
						imageUrl: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			skip,
			take: size,
		});

		const remainingData = await prisma.notification.count({
			where: { userId },
		});
		const hasNext = Boolean(remainingData - data.length - skip);

		return {
			data,
			hasNext,
		};
	} catch (error) {
		console.info("[ERROR_GET_NOTIFICATIONS]", error);
	}
};

/**
 * Retrieves the total number of unread notifications for a given user.
 *
 * @param {string} userId - The ID of the user.
 * @return {Promise<GetTotalNotificationsActionType>} - The total number of unread notifications for the user.
 */
export const getTotalNotificationsAction = async (
	userId: string,
): Promise<GetTotalNotificationsActionType> => {
	try {
		return await prisma.notification.count({
			where: {
				userId,
				isRead: { not: true },
			},
		});
	} catch (error) {
		console.info("[ERROR_GET_TOTAL_NOTIFICATIONS_ACTION]", error);
	}
};

/**
 * Marks a notification as read.
 *
 * @param {string} notificationId - The ID of the notification.
 * @param {string} path - The path to revalidate.
 * @return {Promise<void>} - A promise that resolves when the notification is marked as read.
 */
export const markAsReadNotification = async (
	notificationId: string,
	path: string,
): Promise<void> => {
	try {
		if (!notificationId) throw new Error("notificationId required");
		if (!path) throw new Error("path required");

		await prisma.notification.update({
			where: { id: notificationId },
			data: {
				isRead: true,
			},
		});
	} catch (error) {
		console.info("[ERROR_MARK_AS_READ_NOTIFICATION]", error);
	} finally {
		revalidatePath(path);
	}
};

/**
 * Marks all notifications as read for a given user.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} path - The path for revalidation.
 * @return {Promise<void>} - A promise that resolves when the notifications are marked as read.
 */
export const markAllNotificationsAsReadAction = async (
	userId: string,
	path: string,
): Promise<void> => {
	try {
		if (!userId) throw new Error("userId required");
		if (!path) throw new Error("path required");

		await prisma.notification.updateMany({
			where: { userId },
			data: {
				isRead: true,
			},
		});
	} catch (error) {
		console.info("[ERROR_MARK_ALL_NOTIFICATIONS_AS_READ_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};

/**
 * Deletes a notification action.
 *
 * @param {string} notificationId - The ID of the notification to be deleted.
 * @param {string} path - The path to revalidate after deleting the notification.
 * @return {Promise<void>} - A promise that resolves when the notification is deleted.
 */
export const deleteNotificationAction = async (
	notificationId: string,
	path: string,
): Promise<void> => {
	try {
		if (!notificationId) throw new Error("notificationId required");

		await prisma.notification.delete({
			where: { id: notificationId },
		});
	} catch (error) {
		console.info("[ERROR_DELETE_NOTIFICATION_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};
