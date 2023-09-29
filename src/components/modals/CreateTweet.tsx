"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { useTweetModal } from "@/hooks/useTweetModal";
import CreateTweetForm from "../forms/createtweetform/CreateTweetForm";
import { useReplyTweet } from "@/hooks/useReplyTweet";

interface Props {
    userId: string;
    imageUrl: string;
}

const CreateTweet = ({ userId, imageUrl }: Props) => {
    const { onClose, isOpen } = useTweetModal()
    const { setDataTweet, dataTweet } = useReplyTweet();

    const isDataTweetEmpty = !dataTweet;

    const onOpenChangeDialog = () => {
        setDataTweet(null)
        onClose()
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onOpenChangeDialog}
        >
            <DialogContent className="!outline-none !border-none bg-black-100 w-full select-none">
                <DialogHeader>
                    <h3 className="tracking-wide text-2xl font-semibold">
                        {
                            !isDataTweetEmpty
                                ? `Replying to @${dataTweet.user.username}`
                                : 'Post Tweet'
                        }
                    </h3>
                </DialogHeader>
                <div className="mt-5">
                    <CreateTweetForm
                        isModal
                        userId={userId}
                        imageUrl={imageUrl}
                        htmlForId="createtweet"
                        isReply
                        dataTweet={dataTweet}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTweet