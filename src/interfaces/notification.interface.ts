// actions/notification.action.ts
export interface FollowUserNotificationActionProps {
  userId: string;
  sourceId: string;
  parentIdUser: string;
  path: string;
}