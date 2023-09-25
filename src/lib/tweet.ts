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

    toast({
      title: "Your post was deleted",
      duration: 2000,
      variant: "primary",
    });
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

			toast({
				title: "Removed from your Bookmarks",
				duration: 2000,
				variant: "primary",
			});
		} else {
			toggleBookmarkAction({
				userId,
				threadId,
        path,
			});

			toast({
				title: "Added to your Bookmarks",
				duration: 2000,
				variant: "primary",
			});
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

	toast({
		title: "Copied to clipboard",
		duration: 2000,
		variant: "primary",
	});
};

export const toggleLikeTweet = ({
	isPending,
	startTransition,
	liked,
	userId,
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
				userId,
				threadId,
        path
			});
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
