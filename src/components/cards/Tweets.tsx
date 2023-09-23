"use client"

import { DataTweet, TweetWithConnection } from '@/interfaces/tweet.interface'
import { BookmarkMinus, BookmarkPlus, Heart, Link as LinkIcon, MessageCircle, MoreHorizontal, Share, UserPlus2, UserX2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState, useTransition } from 'react'
import { cn, customDatePost } from '@/lib/utils'
import { deleteTweetAction, toggleBookmarkTweet, toggleLikeTweet } from '@/actions/tweet.action'
import { useToast } from "@/components/ui/use-toast"
import { followUser, unfollowUser } from '@/actions/follower.action'
import { useTweetModal } from '@/hooks/useTweetModal'

// userId is from current user
interface Props {
  tweet: TweetWithConnection
  userId: string;
}

const Tweets = ({ tweet, userId }: Props) => {
  // handle hydration ui
  const [isMounted, setIsMounted] = useState(false)
  // router
  const router = useRouter();
  // toast from shadcn
  const { toast } = useToast();
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

  // toggle like action | like and unlike
  const liked = tweet.likes.find(like => like.userId === userId);
  const toggleLikeAction = () => {
    if (isPendingLike) return;

    startTransitionLike(() => {
      if (liked) {
        toggleLikeTweet({
          likeId: liked.id
        })
      } else {
        toggleLikeTweet({
          userId,
          threadId: tweet.id
        })
      }
    })

    router.refresh();
  }

  // toggle follow user action | follow and unfollow
  const followed = tweet.user.followers.find(({ followingId }) => followingId === userId)
  const toggleFollowUserAction = () => {
    if (isPendingFollowUser) return;

    startTransitionFollowUser(() => {
      if (followed) {
        unfollowUser(followed.id)
      } else {
        followUser({ userId, currentUserId: userId })
      }
    });

    router.refresh();
  }

  // toggle bookmark action | delete bookmark and added bookmark
  const bookmark = tweet.bookmarks.find(item => item.userId === userId);
  const toggleBookmarkAction = () => {
    if (isPendingBookmark) return;

    startTransitionBookmark(() => {
      if (bookmark) {
        toggleBookmarkTweet({
          bookmarkId: bookmark.id
        })

        toast({
          title: "Removed from your Bookmarks",
          duration: 2000,
          variant: "primary"
        })
      } else {
        toggleBookmarkTweet({
          userId,
          threadId: tweet.id
        })

        toast({
          title: "Added to your Bookmarks",
          duration: 2000,
          variant: "primary"
        })
      }
    })

    router.refresh();
  }

  // reply tweet
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
    }

    tweetModal.setParentId(tweet.id);
    tweetModal.setDataTweet(dataTweet);
    tweetModal.onOpen();
  }

  // delete tweet
  const deleteTweet = () => {
    if (isPendingTweet) return;

    startTransitionTweet(() => {
      deleteTweetAction(tweet.id);

      toast({
        title: "Your post was deleted",
        duration: 2000,
        variant: "primary"
      })
    })

    router.refresh()
  }

  // tweet text | tweet.text
  const renderText = () => {
    const textWithoutEmptyLines = tweet.text.replace(/^\s*$/gm, '');
    const textWithSingleLineBreaks = textWithoutEmptyLines.replace(/\n+/g, '\n\n');
    return textWithSingleLineBreaks
  };

  // format date | tweet.createdAt
  const formattedCreatedAt = tweet.createdAt && customDatePost(tweet.createdAt.getTime());

  // shared post with copy link
  const copyLink = () => {
    const url = process.env.NEXT_PUBLIC_NEXT_URL;
    const username = tweet.user.username;
    const tweetId = tweet.id;

    navigator.clipboard.writeText(`${url}/${username}/status/${tweetId}`);

    toast({
      title: "Copied to clipboard",
      duration: 2000,
      variant: "primary"
    })
  }

  // basic validation
  const isOwnTweet = tweet.userId === userId

  // handle hydration ui
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  return (
    <div className={cn("flex gap-x-5 px-3 py-4 border-b border-b-gray-300 transition")}>
      <div className="flex items-start jsutify-start rounded-full overflow-hidden">
        <Image
          src={tweet.user.imageUrl}
          alt={tweet.user.name}
          width={35}
          height={35}
          priority
          className="object-cover rounded-full"
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
              {renderText()}
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
                {isOwnTweet ? (
                  <DropdownMenuItem
                    // TODO: create handler delete tweet
                    onClick={deleteTweet}
                  >
                    Delete
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={toggleFollowUserAction}
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
              onClick={toggleLikeAction}
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
                    onClick={copyLink}
                  >
                    <LinkIcon size="20" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={toggleBookmarkAction}
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