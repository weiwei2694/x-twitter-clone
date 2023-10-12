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
	if (isPending || (userId === currentUserId)) return;

	startTransition(() => {
		if (followed) {
			toggleFollowUserAction({
				userId: followed.followerId,
				path,
			});

			toast(`You unfollowed ${username}`, toastOptions);
		} else {
			toggleFollowUserAction({ userId, currentUserId, path });

			toast(`You followed ${username}`, toastOptions);

			followUserNotificationAction({
				userId,
				sourceId: currentUserId,
				parentIdUser: currentUserId,
				path,
			});
		}
	});
};

export const copyLinkUser = ({ toast, username }: CopyLinkUserProps) => {
	const url = process.env.NEXT_PUBLIC_NEXT_URL;
	navigator.clipboard.writeText(`${url}/${username}`);

	toast("Copied to clipboard", toastOptions);
};
