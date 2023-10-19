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
import toast from "react-hot-toast";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  tweetId: string;
  username: string;
  bookmark: Bookmark;
  path: string;
  isDetailTweet?: boolean;
}

const Share = ({
  userId,
  tweetId,
  username,
  bookmark,
  path,
  isDetailTweet
}: Props) => {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="!outline-none p-2 text-gray-200 transition hover:text-blue hover:bg-blue/10 rounded-full"
      >
        <ShareIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          className="text-blue"
          onClick={e => {
            e.stopPropagation();
            copyLinkTweet({
              toast,
              username,
              tweetId
            });
          }}
        >
          <LinkIcon size="20" />
          Copy Link
        </DropdownMenuItem>
        {!isDetailTweet && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmarkTweet({
                isPending,
                startTransition,
                toast,
                path,
                bookmark,
                userId,
                threadId: tweetId,
              })
            }}
            disabled={isPending}
            className={cn(isPending && "opacity-50 cursor-not-allowed")}
          >
            {bookmark ? (
              <>
                <BookmarkMinus size="20" />
                Delete From Bookmarks
              </>
            ) : (
              <>
                <BookmarkPlus size="20" />
                Bookmark
              </>
            )}

          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Share