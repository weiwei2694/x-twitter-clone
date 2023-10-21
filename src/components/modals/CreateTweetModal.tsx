"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useTweetModal } from "@/hooks/useTweetModal";
import CreateTweetForm from "../forms/createtweetform/CreateTweetForm";
import { useReplyTweet } from "@/hooks/useReplyTweet";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
	userId: string;
	imageUrl: string;
}

const CreateTweetModal = ({ userId, imageUrl }: Props) => {
	const { onClose, isOpen } = useTweetModal();
	const { setDataTweet, dataTweet } = useReplyTweet();

	const isDataTweetEmpty = !dataTweet;

	const onOpenChangeDialog = () => {
		setDataTweet(null);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChangeDialog}>
			<DialogContent className="!outline-none !border-none bg-black-100 w-full select-none">
				<DialogHeader>
					<Button
						variant="icon"
						size="icon"
						onClick={(e) => {
							e.stopPropagation();
							onOpenChangeDialog();
						}}
						className="button__icon-hover absolute top-3 left-3"
					>
						<XIcon className="w-5 h-5" />
					</Button>
				</DialogHeader>
				<div className="mt-10">
					<CreateTweetForm
						isModal
						userId={userId}
						imageUrl={imageUrl}
						htmlForId="createtweet"
						isReply
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default CreateTweetModal;
