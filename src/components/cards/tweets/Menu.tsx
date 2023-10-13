"use client"

import DeleteModal from "@/components/modals/DeleteModal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteTweet } from "@/lib/tweet"
import { toggleFollowUser } from "@/lib/user"
import { Follower } from "@prisma/client"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import toast from "react-hot-toast"

interface Props {
  username: string;
  tweetId: string;
  isOwnTweet: boolean;
  path: string;
  followed: Follower;
  userId: string;
  currentUserId: string;
}

const Menu = ({
  username,
  tweetId,
  isOwnTweet,
  path,
  userId,
  currentUserId,
  followed
}: Props) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPendingTweet, startTransitionTweet] = useTransition();
  const [isPendingFollowUser, startTransitionFollowUser] = useTransition();

  const deleteTweetHandler = () => {
    deleteTweet({
      isPending: isPendingTweet,
      startTransition: startTransitionTweet,
      toast,
      path,
      id: tweetId
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full"
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/${username}/status/${tweetId}`)}
          >
            <Image
              src="/assets/right-arrow.png"
              alt="Right Arrow Icon"
              width={30}
              height={30}
              className="object-contain"
            />
            Go To Post
          </DropdownMenuItem>
          {isOwnTweet ? (
            <DropdownMenuItem
              onClick={() => setIsDialogOpen(true)}
              className="text-[#f4212e]"
            >
              <Image
                src="/assets/delete.png"
                alt="Delete"
                width={30}
                height={30}
                className="object-contain"
              />
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
              {followed ? (
                <Image
                  src="/assets/unfollow.png"
                  alt="Unfollow"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              ) : (
                <Image
                  src="/assets/follow.png"
                  alt="Follow"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              )}
              <p className="flex items-center gap-x-2">
                {followed ? "Unfollow" : "Follow"}
                <span className="max-w-[80px] overflow-hidden whitespace-nowrap text-ellipsis">
                  @{username}
                </span>
              </p>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        title="Delete post?"
        description="This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results. "
        ButtonAction={
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-600/90 rounded-full font-extrabold text-sm"
            onClick={deleteTweetHandler}
            disabled={isPendingTweet}
          >
            Delete
          </Button>
        }
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  )
}

export default Menu