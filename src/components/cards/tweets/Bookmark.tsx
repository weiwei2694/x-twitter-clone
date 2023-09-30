"use client";

import { Button } from '@/components/ui/button'
import { toggleBookmarkTweet } from '@/lib/tweet'
import { cn } from '@/lib/utils'
import { Bookmark } from '@prisma/client'
import Image from 'next/image'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

interface Props {
  bookmark: Bookmark;
  path: string;
  userId: string;
  threadId: string;
  totalBookmarks: number;
}

const Bookmark = ({
  bookmark,
  path,
  userId,
  threadId,
  totalBookmarks
}: Props) => {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="icon"
      size="icon"
      className={cn("flex items-center gap-x-2 transition", bookmark ? "text-blue" : "text-gray-200 hover:text-blue")}
      onClick={() => toggleBookmarkTweet({
        isPending,
        startTransition,
        toast,
        path,
        bookmark,
        userId,
        threadId
      })}
      disabled={isPending}
    >
      {bookmark
        ? <Image src="/assets/bookmark-fill-icon.png" alt="Bookmark Fill" width={20} height={20} className="object-contain" />
        : <Image src="/assets/bookmark-icon.png" alt="Bookmark Fill" width={20} height={20} className="object-contain" />
      }
      <span className="text-sm font-extrabold">
        {totalBookmarks}
      </span>
    </Button>
  )
}

export default Bookmark