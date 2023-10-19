import { Notification } from "@prisma/client";

export type FollowUserNotificationActionType = Notification | undefined;
export type LikePostNotificationActionType = FollowUserNotificationActionType;
export type CommentPostNotificationActionType = FollowUserNotificationActionType;
export type ReplyCommentPostNotificationActionType = FollowUserNotificationActionType;
export type GetNotificationsActionType = { data: Notification[], hasNext: boolean } | undefined;
export type GetTotalNotificationsActionType = number | undefined;