"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteTweet } from "@/lib/tweet"
import { toggleFollowUser } from "@/lib/user"
import { Follower } from "@prisma/client"
import { ArrowUpRight, MoreHorizontal, Trash, UserPlus2, UserX2 } from "lucide-react"
import Link from "next/link"
import { TransitionStartFunction } from "react"
import toast from "react-hot-toast"

interface Props {
  username: string;
  tweetId: string;
  isOwnTweet: boolean;
  isPendingFollowUser: boolean;
  startTransitionFollowUser: TransitionStartFunction;
  isPendingTweet: boolean;
  startTransitionTweet: TransitionStartFunction;
  path: string;
  followed: Follower;
  userId: string;
  currentUserId: string;
}

const Menu = ({
  username,
  tweetId,
  isOwnTweet,
  isPendingFollowUser,
  startTransitionFollowUser,
  isPendingTweet,
  startTransitionTweet,
  path,
  userId,
  currentUserId,
  followed
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full"
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem>
          <Link
            className="flex items-center gap-x-2 w-full"
            href={`/${username}/status/${tweetId}`}
          >
            <ArrowUpRight size="20" />
            Go To Post
          </Link>
        </DropdownMenuItem>
        {isOwnTweet ? (
          <DropdownMenuItem
            onClick={() => deleteTweet({
              isPending: isPendingTweet,
              startTransition: startTransitionTweet,
              toast,
              path,
              id: tweetId
            })}
          >
            <Trash size="20" />
            Delete
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => toggleFollowUser({
              isPending: isPendingFollowUser,
              startTransition: startTransitionFollowUser,
              toast,
              path,
              username,
              followed,
              userId,
              currentUserId,
            })}
          >
            {followed ? <UserX2 size="20" /> : <UserPlus2 size="20" />}
            {followed ? "Unfollow" : "Follow"}
            <span className="max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
              @{username}
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Menu