"use client"

import { DataTweet, MultipleTweetWithConnection } from '@/interfaces/tweet.interface'
import { ArrowUpRight, BookmarkMinus, BookmarkPlus, Heart, Link as LinkIcon, MessageCircle, MoreHorizontal, Share, Trash, UserPlus2, UserX2 } from 'lucide-react'
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
import { cn, customDatePost } from '@/lib/utils'
import toast from 'react-hot-toast';
import { useTweetModal } from '@/hooks/useTweetModal'
import { useReplyTweet } from '@/hooks/useReplyTweet'
import { copyLinkTweet, deleteTweet, renderText, toggleBookmarkTweet, toggleLikeTweet } from '@/lib/tweet'
import { toggleFollowUser } from '@/lib/user'
import Link from 'next/link'

// userId is from current user
interface Props {
  tweet: MultipleTweetWithConnection
  userId: string;
}

const Tweets = ({ tweet, userId }: Props) => {
  // handle hydration ui
  const [isMounted, setIsMounted] = useState(false)
  // router
  const router = useRouter();
  // current path
  const pathname = usePathname();
  // state from useTweetModal
  const setDataTweet = useReplyTweet(state => state.setDataTweet);
  const setOnOpenReplyTweetModal = useTweetModal(state => state.onOpen);

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

  const replyTweet = (isForModal: boolean) => {
    const dataTweet: DataTweet = {
      id: tweet.id,
      text: tweet.text,
      imageUrl: tweet.imageUrl,
      createdAt: tweet.createdAt,
      parentId: tweet.id,
      user: {
        name: tweet.user.name,
        username: tweet.user.username,
        imageUrl: tweet.user.imageUrl,
      },
    };

    setDataTweet(dataTweet);

    if (isForModal) {
      setOnOpenReplyTweetModal();
    } else {
      router.push('/compose/tweet');
    }
  };

  // format date | tweet.createdAt
  const formattedCreatedAt = tweet.createdAt && customDatePost(tweet.createdAt.getTime());

  // basic validation
  const isOwnTweet = tweet.userId === userId

  // handle hydration ui
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  return (
    <div
      className="flex gap-x-5 px-3 py-4 border-b border-b-gray-300 transition"
    >
      <div className="flex items-start jsutify-start rounded-full overflow-hidden">
        <Image
          src={tweet.user.imageUrl}
          alt={tweet.user.name}
          width={35}
          height={35}
          priority
          className="object-cover rounded-full w-[35px] h-[35px]"
        />
      </div>
      <div className="flex-1 flex flex-col space-y-10">
        <div className="flex-1 flex justify-between">
          <div className="flex-1 flex flex-col gap-y-5">
            <div className="flex-1 flex items-center flex-wrap gap-x-2">
              <h5 className="text-ellipsis overflow-hidden whitespace-nowrap font-bold text-white w-fit max-w-[150px]">
                {tweet.user.name}
              </h5>
              <p
                className="text-ellipsis whitespace-nowrap font-normal text-gray-200"
              >
                @{tweet.user.username} · {formattedCreatedAt}
              </p>
            </div>
            <p className="whitespace-break-spaces">
              {renderText(tweet.text)}
            </p>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full"
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem>
                  <Link className="flex items-center gap-x-2 w-full" href={`/${tweet.user.username}/status/${tweet.id}`}>
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
        <div className="flex flex-col space-y-3">
          <div>
            {tweet.imageUrl && (
              <Image
                src={tweet.imageUrl}
                alt="Preview Image"
                width={600}
                height={300}
                loading="lazy"
                className="object-contain rounded-xl"
              />
            )}
          </div>
          <div className="flex items-center gap-x-8">
            {/* Comment Dekstop */}
            <Button
              variant="icon"
              size="icon"
              className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none max-sm:hidden"
              onClick={() => replyTweet(true)}
            >
              <MessageCircle size="20px" />
              <span className="text-sm font-extrabold">
                {tweet.replies.length}
              </span>
            </Button>
            {/* Comment Mobile */}
            <Button
              variant="icon"
              size="icon"
              className="flex items-center gap-x-2 text-gray-200 transition hover:text-blue !outline-none sm:hidden"
              onClick={() => replyTweet(false)}
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
            {/* Share */}
            <div className="flex-1 flex justify-end">
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
                  <DropdownMenuItem
                    onClick={() => toggleBookmarkTweet({
                      isPending: isPendingBookmark,
                      startTransition: startTransitionBookmark,
                      toast,
                      path: pathname,
                      bookmark,
                      userId,
                      threadId: tweet.id
                    })}
                  >
                    {bookmark ? <BookmarkMinus size="20" /> : <BookmarkPlus size="20" />}
                    {bookmark ? "Delete From Bookmarks" : "Bookmark"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tweets