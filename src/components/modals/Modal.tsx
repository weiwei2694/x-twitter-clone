"use client";

import { useEffect, useState } from "react";
import CreateTweet from "./CreateTweet";
import { useTweetModal } from "@/hooks/useTweetModal";

interface ModalProps {
    imageUrl: string;
    userId: string;
}

const Modal = ({ imageUrl, userId }: ModalProps) => {
    const [isMounted, setIsMounted] = useState(false);

    const tweetModal = useTweetModal();
    
    useEffect(() => {
        setIsMounted(true);
        tweetModal.setImageUrl(imageUrl);
        tweetModal.setUserId(userId);
    }, [])

    if (!isMounted) return null;

  return (
    <>
        <CreateTweet />
    </>
    )
}

export default Modal