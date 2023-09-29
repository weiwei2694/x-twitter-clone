"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { copyLinkTweet, toggleBookmarkTweet } from "@/lib/tweet";
import { Bookmark } from "@prisma/client";
import { BookmarkMinus, BookmarkPlus, LinkIcon, Share as ShareIcon } from "lucide-react";
import { TransitionStartFunction } from "react";
import toast from "react-hot-toast";

interface Props {
  isPending: boolean,
  startTransition: TransitionStartFunction;
  userId: string;
  tweetId: string;
  username: string;
  bookmark: Bookmark;
  path: string;
}

const Share = ({
  isPending,
  startTransition,
  userId,
  tweetId,
  username,
  bookmark,
  path
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="!outline-none p-2 text-gray-200 transition hover:text-blue"
      >
        <ShareIcon size="20px" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          onClick={() => copyLinkTweet({
            toast,
            username,
            tweetId
          })}
        >
          <LinkIcon size="20" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toggleBookmarkTweet({
            isPending,
            startTransition,
            toast,
            path,
            bookmark,
            userId,
            threadId: tweetId,
          })}
        >
          {bookmark ? <BookmarkMinus size="20" /> : <BookmarkPlus size="20" />}
          {bookmark ? "Delete From Bookmarks" : "Bookmark"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Share