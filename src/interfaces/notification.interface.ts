interface SourceUser {
	id: string;
	username: string;
	imageUrl: string;
}

interface Post {
	id: string;
	text: string;
	imageUrl: string | null;
}

export interface DataNotification {
	id: string;
	isRead: boolean;
	userId: string;
	activityType: string | null;
	sourceId: string;
	parentIdPost: string | null;
	parentIdUser: string | null;
	parentType: string;
	createdAt: Date;
	sourceUser: SourceUser | null;
	post: Post | null;
}

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

export interface FollowUserNotificationActionProps
	extends ParentTypeUserProps {}
export interface LikePostNotificationActionProps extends ParentTypePostProps {}
export interface CommentPostNotificationActionProps
	extends ParentTypePostProps {}
export interface ReplyCommentPostNotificationActionProps
	extends ParentTypePostProps {}
export interface GetNotificationsActionProps {
	userId: string;
	size?: number;
	page?: number;
}
