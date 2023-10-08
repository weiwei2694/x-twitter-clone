import {
	deleteTweetAction,
	toggleBookmarkAction,
	toggleLikeAction,
} from "@/actions/tweet.action";
import {
	CopyLinkTweetProps,
	DataTweet,
	DeleteTweetProps,
	ToggleBookmarkTweetProps,
	ToggleLikeTweetProps,
} from "@/interfaces/tweet.interface";
import { toastOptions } from "./utils";
import { likePostNotificationAction } from "@/actions/notification.action";

export const deleteTweet = ({
	isPending,
	startTransition,
	toast,
	path,
	id,
}: DeleteTweetProps) => {
	if (isPending) return;

	startTransition(() => {
		deleteTweetAction(id, path);

		toast("Your post was deleted", toastOptions);
	});
};

export const toggleBookmarkTweet = ({
	isPending,
	startTransition,
	toast,
	path,
	bookmark,
	userId,
	threadId,
}: ToggleBookmarkTweetProps) => {
	if (isPending) return;

	startTransition(() => {
		if (bookmark) {
			toggleBookmarkAction({
				bookmarkId: bookmark.id,
				path,
			});

			toast("Removed from your Bookmarks", toastOptions);
		} else {
			toggleBookmarkAction({
				userId,
				threadId,
				path,
			});

			toast("Added to your Bookmarks", toastOptions);
		}
	});
};

export const copyLinkTweet = ({
	toast,
	username,
	tweetId,
}: CopyLinkTweetProps) => {
	const url = process.env.NEXT_PUBLIC_NEXT_URL;
	navigator.clipboard.writeText(`${url}/${username}/status/${tweetId}`);

	toast("Copied to clipboard", toastOptions);
};

export const toggleLikeTweet = ({
	isPending,
	startTransition,
	liked,
	userId,
	currentUserId,
	threadId,
	path,
}: ToggleLikeTweetProps) => {
	if (isPending) return;

	startTransition(() => {
		if (liked) {
			toggleLikeAction({
				likeId: liked.id,
				path,
			});
		} else {
			toggleLikeAction({
				userId: currentUserId,
				threadId,
				path,
			});

			likePostNotificationAction({
				userId,
				sourceId: currentUserId,
				parentIdPost: threadId,
				path
			})
		}
	});
};

// generate by chatGPT
export const renderText = (text: string) => {
	const textWithoutEmptyLines = text.replace(/^\s*$/gm, "");
	const textWithSingleLineBreaks = textWithoutEmptyLines.replace(
		/\n+/g,
		"\n\n"
	);
	return textWithSingleLineBreaks;
};
