"use client";

import { Button } from "@/components/ui/button";
import { usePrevious } from "@/hooks/usePrevious";
import { useReplyTweet } from "@/hooks/useReplyTweet";
import { useTweetModal } from "@/hooks/useTweetModal";
import { DataTweet } from "@/interfaces/tweet.interface";
import { getCurrentPath } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent, useTransition } from "react";

interface Props {
	dataTweet: DataTweet;
	totalReplies: number;
}

const Comment = ({ dataTweet, totalReplies }: Props) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const setDataTweet = useReplyTweet((state) => state.setDataTweet);
	const setOnOpenReplyTweetModal = useTweetModal((state) => state.onOpen);
	const { addToNavigationHistory } = usePrevious();

	const replyTweetHandler = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
		isForModal: boolean,
	) => {
		e.stopPropagation();

		startTransition(() => {
			setDataTweet(dataTweet);

			if (isForModal) setOnOpenReplyTweetModal();
			else {
				addToNavigationHistory(getCurrentPath());
				router.push("/compose/tweet");
			}
		});
	};

	return (
		<>
			{/* Dekstop */}
			<Button
				variant="icon"
				size="icon"
				className="flex items-center gap-x-1 text-gray-200 transition-all hover:text-blue !outline-none max-sm:hidden group"
				disabled={isPending}
				onClick={(e) => replyTweetHandler(e, true)}
			>
				<span className="p-2 group-hover:bg-blue/10 rounded-full transition-all">
					<MessageCircle className="h-4 w-4" />
				</span>
				<b>{totalReplies}</b>
			</Button>

			{/* Mobile */}
			<Button
				variant="icon"
				size="icon"
				disabled={isPending}
				className="flex items-center gap-x-2 text-gray-200 transition-all hover:text-blue !outline-none sm:hidden group"
				onClick={(e) => replyTweetHandler(e, false)}
			>
				<span className="p-2 group-hover:bg-blue/10 rounded-full transition-all">
					<MessageCircle className="h-4 w-4" />
				</span>
				<b>{totalReplies}</b>
			</Button>
		</>
	);
};

export default Comment;
