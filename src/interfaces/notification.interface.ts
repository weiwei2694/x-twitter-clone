// actions/notification.action.ts
export interface FollowUserNotificationActionProps {
  userId: string;
  sourceId: string;
  parentIdUser: string;
  path: string;
}

export interface LikePostNotificationProps {
  userId: string;
  sourceId: string;
  parentIdPost: string;
  path: string;
}