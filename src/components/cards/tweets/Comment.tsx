"use client"

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react"
import { MouseEvent } from "react";

interface Props {
  replyTweet: (isForModal: boolean) => void;
  totalReplies: number;
}

const Comment = ({ replyTweet, totalReplies }: Props) => {
  const replyTweetHandler = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    replyTweet(true);
  }

  return (
    <>
      {/* Dekstop */}
      <Button
        variant="icon"
        size="icon"
        className="flex items-center gap-x-1 text-gray-200 transition-all hover:text-blue !outline-none max-sm:hidden group"
        onClick={replyTweetHandler}
      >
        <span className="p-2 group-hover:bg-blue/10 rounded-full transition-all">
          <MessageCircle className="h-4 w-4" />
        </span>
        <b>
          {totalReplies}
        </b>
      </Button>

      {/* Mobile */}
      <Button
        variant="icon"
        size="icon"
        className="flex items-center gap-x-2 text-gray-200 transition-all hover:text-blue !outline-none sm:hidden group"
        onClick={replyTweetHandler}
      >
        <span className="p-2 group-hover:bg-blue/10 rounded-full transition-all">
          <MessageCircle className="h-4 w-4" />
        </span>
        <b>
          {totalReplies}
        </b>
      </Button>
    </>
  )
}

export default Comment