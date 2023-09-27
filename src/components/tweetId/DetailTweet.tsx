"use client";

import { DataTweet, SingleTweetWithConnection } from '@/interfaces/tweet.interface'
import { Heart, Link as LinkIcon, MessageCircle, MoreHorizontal, Share, Trash, UserPlus2, UserX2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState, useTransition } from 'react'
import { cn, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast';
import { useTweetModal } from '@/hooks/useTweetModal'
import { copyLinkTweet, deleteTweet, renderText, toggleBookmarkTweet, toggleLikeTweet } from '@/lib/tweet';
import { toggleFollowUser } from '@/lib/user';

interface Props {
  tweet: SingleTweetWithConnection;
  userId: string;
}

const DetailTweet = ({ tweet, userId }: Props) => {
  // handle hydration ui
  const [isMounted, setIsMounted] = useState(false)
  // router
  const router = useRouter();
  // current pathname
  const pathname = usePathname();
  // state from useTweetModal
  const tweetModal = useTweetModal();

  // mutation
  // like
  const [isPendingLike, startTransitionLike] = useTransition()
  // follow user
  const [isPendingFollowUser, startTransitionFollowUser] = useTransition()
  // bookmark
  const [isPendingBookmark, startTransitionBookmark] = useTransition()
  // delete tweet
  const [isPendingTweet, startTransitionTweet] = useTransition();

  const liked = tweet.likes.find(like => like.userId === userId);
  const followed = tweet.user.followers.find(({ followingId }) => followingId === userId)
  const bookmark = tweet.bookmarks.find(item => item.userId === userId);

  const replyTweet = () => {
    const dataTweet: DataTweet = {
      id: tweet.id,
      text: tweet.text,
      imageUrl: tweet.imageUrl,
      createdAt: tweet.createdAt,
      user: {
        name: tweet.user.name,
        username: tweet.user.username,
        imageUrl: tweet.user.imageUrl,
      },
    };

    tweetModal.setParentId(tweet.id);
    tweetModal.setDataTweet(dataTweet);
    tweetModal.onOpen();
  };

  // basic validation
  const isOwnTweet = tweet.userId === userId

  // display tweet image
  const displayTweetImage = () => {
    if (!tweet.imageUrl) return null;

    return (
      <Image
        src={tweet.imageUrl}
        alt="Preview Image"
        width={600}
        height={300}
        loading="lazy"
        className="object-contain rounded-xl w-full"
      />
    )
  }

  // handle hydration ui
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  return (
    <div className="flex flex-col py-4 px-3 space-y-4">
      {/* Header -> User Image URL, Name, Username, Menu */}
      <div className="flex items-center justify-between gap-x-10">
        <div className="flex items-start justify-start gap-x-5">
          <Image
            src={tweet.user.imageUrl}
            alt={tweet.user.name}
            width={35}
            height={35}
            priority
            className="object-cover rounded-full w-[35px] h-[35px]"
          />
          <div className="flex-1 flex flex-col items-start -space-y-1">
            <h5 className="text-ellipsis overflow-hidden whitespace-nowrap font-bold text-white w-fit max-w-[150px]">
              {tweet.user.name}
            </h5>
            <p
              className="text-ellipsis whitespace-nowrap font-normal text-gray-200"
            >
              @{tweet.user.username}
            </p>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full"
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              {isOwnTweet ? (
                <DropdownMenuItem
                  onClick={() => deleteTweet({
                    isPending: isPendingTweet,
                    startTransition: startTransitionTweet,
                    toast,
                    path: pathname,
                    id: tweet.id
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
                    path: pathname,
                    username: tweet.user.username,
                    followed,
                    userId: tweet.user.id,
                    currentUserId: userId,
                  })}
                >
                  {followed ? <UserX2 size="20" /> : <UserPlus2 size="20" />}
                  {followed ? "Unfollow" : "Follow"}
                  <span className="max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">
                    @{tweet.user.username}
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Body -> Text as Description, Image Url, Date Post */}
      <div className="flex-1 flex flex-col space-y-10">
        <div className="flex flex-col space-y-3">
          <p className="whitespace-break-spaces">
            {renderText(tweet.text)}
          </p>
          {displayTweetImage()}
          <p className="font-normal text-gray-200">
            {formatDateTime(tweet.createdAt)}
          </p>
        </div>
      </div>
      {/* Footer -> Comment, Like, Share */}
      <div className="py-1 border-t border-b border-gray-300">
        <div className="flex items-center justify-between gap-x-8">
          {/* Comment */}
          <Button
            variant="icon"
            size="icon"
            className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none"
            onClick={replyTweet}
          >
            <MessageCircle size="20px" />
            <span className="text-sm font-extrabold">
              {tweet.replies.length}
            </span>
          </Button>
          {/* Like */}
          <Button
            variant="icon"
            size="icon"
            className={cn("flex items-center gap-x-2 transition", liked ? "text-red-500" : "text-gray-200 hover:text-red-500")}
            onClick={() => toggleLikeTweet({
              isPending: isPendingLike,
              startTransition: startTransitionLike,
              toast,
              liked,
              userId,
              threadId: tweet.id,
              path: pathname
            })}
            disabled={isPendingLike}
          >
            {liked
              ? <Image src="/assets/heart-fill-icon.png" alt="Heart Fill" width={20} height={20} className="object-contain" />
              : <Heart size="20" />
            }
            <span className="text-sm font-extrabold">
              {tweet.likes.length}
            </span>
          </Button>
          {/* Bookmark */}
          <Button
            variant="icon"
            size="icon"
            className={cn("flex items-center gap-x-2 transition", bookmark ? "text-blue" : "text-gray-200 hover:text-blue")}
            onClick={() => toggleBookmarkTweet({
              isPending: isPendingBookmark,
              startTransition: startTransitionBookmark,
              toast,
              path: pathname,
              bookmark,
              userId,
              threadId: tweet.id
            })}
            disabled={isPendingBookmark}
          >
            {bookmark
              ? <Image src="/assets/bookmark-fill-icon.png" alt="Bookmark Fill" width={20} height={20} className="object-contain" />
              : <Image src="/assets/bookmark-icon.png" alt="Bookmark Fill" width={20} height={20} className="object-contain" />
            }
            <span className="text-sm font-extrabold">
              {tweet.bookmarks.length}
            </span>
          </Button>
          {/* Share */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="!outline-none p-2 text-gray-200 transition hover:text-blue"
              >
                <Share size="20px" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  onClick={() => copyLinkTweet({
                    toast,
                    username: tweet.user.username,
                    tweetId: tweet.id
                  })}
                >
                  <LinkIcon size="20" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailTweet