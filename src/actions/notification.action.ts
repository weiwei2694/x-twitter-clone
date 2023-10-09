"use server";

import {
	CommentPostNotificationActionProps,
	FollowUserNotificationActionProps,
	LikePostNotificationActionProps,
	ReplyCommentPostNotificationActionProps,
} from "@/interfaces/notification.interface";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const followUserNotificationAction = async ({
	userId,
	parentIdUser,
	sourceId,
	path,
}: FollowUserNotificationActionProps) => {
	if (!userId) throw new Error("userId required");
	if (!parentIdUser) throw new Error("parentIdUser required");
	if (!sourceId) throw new Error("sourceId required");
	if (!path) throw new Error("path required");

	try {
		await prisma.notification.create({
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

export const likePostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: LikePostNotificationActionProps) => {
	if (!userId) throw new Error("userId required");
	if (!sourceId) throw new Error("sourceId required");
	if (!parentIdPost) throw new Error("parentIdPost required");
	if (!path) throw new Error("path required");

	try {
		await prisma.notification.create({
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

export const commentPostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: CommentPostNotificationActionProps) => {
	if (!userId) throw new Error("userId required");
	if (!sourceId) throw new Error("sourceId required");
	if (!parentIdPost) throw new Error("parentIdPost required");
	if (!path) throw new Error("path required");

	try {
		await prisma.notification.create({
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

export const replyCommentPostNotificationAction = async ({
	userId,
	sourceId,
	parentIdPost,
	path,
}: ReplyCommentPostNotificationActionProps) => {
	try {
		await prisma.notification.create({
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

export const getNotifications = async (userId: string) => {
	if (!userId) throw new Error("userId required");

	try {
		return await prisma.notification.findMany({
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
				createdAt: "asc",
			},
		});
	} catch (error) {
		console.info("[ERROR_GET_NOTIFICATIONS]", error);
	}
};

export const markAsReadNotification = async (notificationId: string, path: string) => {
	if (!notificationId) throw new Error("notificationId required")
	if (!path) throw new Error("path required")

	try {
		await prisma.notification.update({
			where: { id: notificationId },
			data: {
				isRead: true
			}
		})
	} catch (error) {
		console.info("[ERROR_MARK_AS_READ_NOTIFICATION]", error);
	} finally {
		revalidatePath(path)
	}
}