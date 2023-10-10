"use client";

import { DataTweet, SingleTweetWithConnection } from '@/interfaces/tweet.interface'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { formatDateTime } from '@/lib/utils'
import { useTweetModal } from '@/hooks/useTweetModal'
import { renderText } from '@/lib/tweet';
import { useReplyTweet } from '@/hooks/useReplyTweet';
import { Share, Bookmark, Like, Menu, Comment } from "../cards/tweets"
import TweetText from '../sharing/TweetText';

interface Props {
  tweet: SingleTweetWithConnection;
  userId: string;
}

const DetailTweet = ({ tweet, userId }: Props) => {
  /**
   * @router
   * @pathname
   */
  const router = useRouter();
  const pathname = usePathname();

  /**
   * @state
   * isMounted ( handle hydration UI )
   * setDataTweet
   * setOnReplyTweetModal
   */
  const [isMounted, setIsMounted] = useState(false)
  const setOnOpenReplyTweetModal = useTweetModal(state => state.onOpen);
  const setDataTweet = useReplyTweet(state => state.setDataTweet);

  /**
   * @liked
   * @followed
   * @bookmark
   * 
   * Check current user engagement,
   * whether they have followed,
   * bookmarked,
   * or liked this post,
   * or vice versa
   */
  const liked = tweet.likes.find(like => like.userId === userId);
  const followed = tweet.user.followers.find(({ followingId }) => followingId === userId)
  const bookmark = tweet.bookmarks.find(item => item.userId === userId);

  /**
   * @replyTweet
   * 
   * communication to createTweetForm
   */
  const replyTweet = (isForModal: boolean) => {
    const dataTweet: DataTweet = {
      id: tweet.id,
      text: tweet.text,
      imageUrl: tweet.imageUrl,
      createdAt: tweet.createdAt,
      parentId: tweet.id,
      isParentIdExist: Boolean(tweet.parentId),
      user: {
        id: tweet.user.id,
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

  /**
   * @isOwnTweet
   * 
   * for validation on the menu side
   * if false, display follow user action
   */
  const isOwnTweet = tweet.userId === userId

  /**
   * @displayTweetImage
   * 
   * If the image from the tweet exists, display it
   */
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

  /**
   * handle hydration ui
   */
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) return null;

  return (
    <section className="flex flex-col py-4 px-3 space-y-4">
      {/**
       * @Header
       * User Image Url
       * Name
       * Username
       * Menu
       */}
      <section className="flex items-center justify-between gap-x-10">
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
          <Menu
            username={tweet.user.username}
            tweetId={tweet.id}
            path={pathname}
            isOwnTweet={isOwnTweet}
            followed={followed!}
            userId={tweet.user.id}
            currentUserId={userId}
          />
        </div>
      </section>
      {/**
       * @Body
       * Tweet Text
       * Image
       * When tweet created
      */}
      <section className="flex-1 flex flex-col space-y-10">
        <div className="flex flex-col space-y-3">
          <p className="whitespace-break-spaces">
            <TweetText content={renderText(tweet.text)} />
          </p>
          {displayTweetImage()}
          <p className="font-normal text-gray-200">
            {formatDateTime(tweet.createdAt)}
          </p>
        </div>
      </section>
      {/**
       * @Footer
       * Comment
       * Like
       * Bookmark
       * Share
       */}
      <section className="py-1 border-t border-b border-gray-300">
        <div className="flex items-center justify-between gap-x-8">
          {/**
           * @Comment
           */}
          <Comment
            totalReplies={tweet.replies.length}
            replyTweet={replyTweet}
          />
          {/**
           * @Like
           */}
          <Like
            liked={liked!}
            path={pathname}
            userId={tweet.user.id}
            currentUserId={userId}
            threadId={tweet.id}
            totalLikes={tweet.likes.length}
          />
          {/**
           * @Bookmark
           */}
          <Bookmark
            userId={userId}
            path={pathname}
            threadId={tweet.id}
            bookmark={bookmark!}
            totalBookmarks={tweet.bookmarks.length}
          />
          {/**
             * @CopyLink
             */}
          <Share
            path={pathname}
            userId={userId}
            tweetId={tweet.id}
            bookmark={bookmark!}
            username={tweet.user.username}
            isDetailTweet
          />
        </div>
      </section>
    </section>
  )
}

export default DetailTweet