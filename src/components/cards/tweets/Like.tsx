"use client"

import { Button } from '@/components/ui/button'
import { toggleLikeTweet } from '@/lib/tweet'
import { cn } from '@/lib/utils'
import { Like as Liked } from '@prisma/client'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useTransition } from 'react'

interface Props {
  liked: Liked;
  userId: string;
  currentUserId: string;
  path: string;
  threadId: string;
  totalLikes: number;
}

const Like = ({ liked, userId, currentUserId, path, threadId, totalLikes }: Props) => {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="icon"
      size="icon"
      className={cn("flex items-center gap-x-2 transition", liked ? "text-red-500" : "text-gray-200 hover:text-red-500")}
      onClick={() => toggleLikeTweet({
        isPending,
        startTransition,
        liked,
        userId,
        currentUserId,
        threadId,
        path
      })}
      disabled={isPending}
    >
      {liked
        ? <Image src="/assets/heart-fill-icon.png" alt="Heart Fill" width={20} height={20} className="object-contain" />
        : <Heart size="20" />
      }
      <span className="text-sm font-extrabold">
        {totalLikes}
      </span>
    </Button>
  )
}

export default Like