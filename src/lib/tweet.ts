import {
	deleteTweetAction,
	toggleBookmarkAction,
	toggleLikeAction,
} from "@/actions/tweet.action";
import {
	CopyLinkTweetProps,
	DeleteTweetProps,
	ToggleBookmarkTweetProps,
	ToggleLikeTweetProps,
} from "@/interfaces/tweet.interface";
import { toastOptions } from "./utils";
import { likePostNotificationAction } from "@/actions/notification.action";

/**
 * Deletes a tweet.
 *
 * @param {DeleteTweetProps} props - The properties of the tweet deletion.
 * @param {boolean} props.isPending - Indicates if the tweet deletion is pending.
 * @param {function} props.startTransition - The function to start a transition.
 * @param {function} props.toast - The function to display a toast message.
 * @param {string} props.path - The path of the tweet.
 * @param {string} props.id - The ID of the tweet.
 */
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

/**
 * Toggles the bookmark state of a tweet.
 *
 * @param {ToggleBookmarkTweetProps} props - The properties object containing the necessary information for bookmarking a tweet.
 * @param {boolean} props.isPending - A flag indicating whether the bookmark action is pending.
 * @param {function} props.startTransition - A function to initiate a transition.
 * @param {function} props.toast - A function to display a toast message.
 * @param {string} props.path - The path of the tweet.
 * @param {boolean} props.bookmark - A flag indicating whether the tweet is bookmarked.
 * @param {string} props.userId - The ID of the user.
 * @param {string} props.threadId - The ID of the tweet thread.
 * @return {void}
 */
export const toggleBookmarkTweet = ({
	isPending,
	startTransition,
	toast,
	path,
	bookmark,
	userId,
	threadId,
}: ToggleBookmarkTweetProps): void => {
	if (isPending) return;

	const message = bookmark
		? "Removed from your Bookmarks"
		: "Added to your Bookmarks";

	toast(message, toastOptions);

	startTransition(() => {
		toggleBookmarkAction({
			userId,
			threadId,
			path,
		});
	});
};

/**
 * Copies the link to a tweet and displays a toast message.
 *
 * @param {CopyLinkTweetProps} props - The properties for copying the link to a tweet.
 * @param {string} props.toast - The toast message to display.
 * @param {string} props.username - The username of the tweet.
 * @param {string} props.tweetId - The ID of the tweet.
 */
export const copyLinkTweet = ({
	toast,
	username,
	tweetId,
}: CopyLinkTweetProps) => {
	const url = process.env.NEXT_PUBLIC_NEXT_URL;
	navigator.clipboard.writeText(`${url}/${username}/status/${tweetId}`);

	toast("Copied to clipboard", toastOptions);
};

/**
 * Toggles the like status of a tweet and sends a like notification if necessary.
 *
 * @param {ToggleLikeTweetProps} props - The properties needed to toggle the like status of a tweet.
 * @param {boolean} props.isPending - A flag indicating whether the like action is pending.
 * @param {function} props.startTransition - A function to start a transition.
 * @param {boolean} props.liked - A flag indicating whether the tweet is liked.
 * @param {string} props.userId - The ID of the user.
 * @param {string} props.currentUserId - The ID of the current user.
 * @param {string} props.threadId - The ID of the tweet thread.
 * @param {string} props.path - The path of the tweet.
 * @return {void} No return value.
 */
export const toggleLikeTweet = ({
	isPending,
	startTransition,
	liked,
	userId,
	currentUserId,
	threadId,
	path,
}: ToggleLikeTweetProps): void => {
	if (isPending) return;

	startTransition(() => {
		toggleLikeAction({
			userId: currentUserId,
			threadId,
			path,
		});

		if (liked || currentUserId === userId) return;

		likePostNotificationAction({
			userId,
			sourceId: currentUserId,
			parentIdPost: threadId,
			path,
		});
	});
};

/**
 * Removes empty lines and multiple line breaks from the given text.
 *
 * @param {string} text - The text to be processed.
 * @return {string} The processed text without empty lines and multiple line breaks.
 */
export const renderText = (text: string): string => {
	const textWithoutEmptyLines = text.replace(/^\s*$/gm, " ");
	const textWithSingleLineBreaks = textWithoutEmptyLines.replace(/\n+/g, "\n");
	return textWithSingleLineBreaks;
};

export const URL_REGEX =
	/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
