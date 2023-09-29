"use client"

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react"

interface Props {
  replyTweet: (isForModal: boolean) => void;
  totalReplies: number;
}

const Comment = ({ replyTweet, totalReplies }: Props) => {
  return (
    <>
      {/**
       * @Dekstop
       */}
      <Button
        variant="icon"
        size="icon"
        className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none max-sm:hidden"
        onClick={() => replyTweet(true)}
      >
        <MessageCircle size="20px" />
        <span className="text-sm font-extrabold">
          {totalReplies}
        </span>
      </Button>

      {/**
       * @Mobile
       */}
      <Button
        variant="icon"
        size="icon"
        className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none sm:hidden"
        onClick={() => replyTweet(false)}
      >
        <MessageCircle size="20px" />
        <span className="text-sm font-extrabold">
          {totalReplies}
        </span>
      </Button>
    </>
  )
}

export default Comment