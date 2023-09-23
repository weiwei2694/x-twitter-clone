"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { useTweetModal } from "@/hooks/useTweetModal";
import CreateTweetForm from "../forms/CreateTweetForm";

interface Props {
    userId: string;
    imageUrl: string;
}

const CreateTweet = ({ userId, imageUrl }: Props) => {
    const { parentId, dataTweet, onClose, isOpen, setDataTweet, setParentId } = useTweetModal()

    const isDataTweetEmpty = !dataTweet;
    const isParentIdEmpty = !parentId;

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            setDataTweet(undefined)
            setParentId(undefined)
            onClose()
        }}>
            <DialogContent className="!outline-none !border-none bg-black-100 w-full select-none">
                <DialogHeader>
                    <h3 className="tracking-wide text-2xl font-semibold">
                        {
                            !isParentIdEmpty && !isDataTweetEmpty
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
                        id="createtweet"
                        isReply
                        parentId={parentId}
                        dataTweet={dataTweet}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTweet