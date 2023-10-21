import { DataNotification } from "@/interfaces/notification.interface";
import { Notification } from "@prisma/client";

export type FollowUserNotificationActionType = Notification | undefined;
export type LikePostNotificationActionType = FollowUserNotificationActionType;
export type CommentPostNotificationActionType =
	FollowUserNotificationActionType;
export type ReplyCommentPostNotificationActionType =
	FollowUserNotificationActionType;
export type GetNotificationsActionType =
	| { data: DataNotification[]; hasNext: boolean }
	| undefined;
export type GetTotalNotificationsActionType = number | undefined;
