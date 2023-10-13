import { toggleFollowUserAction } from "@/actions/user.action";
import {
	CopyLinkUserProps,
	toggleFollowUserProps,
} from "@/interfaces/user.interface";
import { toastOptions } from "./utils";
import { followUserNotificationAction } from "@/actions/notification.action";

export const toggleFollowUser = ({
	isPending,
	startTransition,
	toast,
	path,
	username,
	followed,
	userId,
	currentUserId,
}: toggleFollowUserProps) => {
	if (isPending || userId === currentUserId) return;

	startTransition(() => {
		toggleFollowUserAction({ userId, currentUserId, path });
		followUserNotificationAction({
			userId,
			sourceId: currentUserId,
			parentIdUser: currentUserId,
			path,
		});
	})

	const message = followed
		? `You unfollowed ${username}`
		: `You followed ${username}`

	toast(message, toastOptions);
};

export const copyLinkUser = ({ toast, username }: CopyLinkUserProps) => {
	const url = process.env.NEXT_PUBLIC_NEXT_URL;
	navigator.clipboard.writeText(`${url}/${username}`);

	toast("Copied to clipboard", toastOptions);
};
