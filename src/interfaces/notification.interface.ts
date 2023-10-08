// actions/notification.action.ts
interface ParentTypeUserProps {
  userId: string;
  parentIdUser: string;
  sourceId: string;
  path: string;
}

interface ParentTypePostProps {
  userId: string;
  sourceId: string;
  parentIdPost: string;
  path: string;
}

export interface FollowUserNotificationActionProps extends ParentTypeUserProps {}
export interface LikePostNotificationActionProps extends ParentTypePostProps {}
export interface CommentPostNotificationActionProps extends ParentTypePostProps {}
export interface ReplyCommentPostNotificationActionProps extends ParentTypePostProps {}