"use client"

import { DataTweet, DetailTweet } from '@/interfaces/tweet.interface'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { customDatePost, getCurrentPath } from '@/lib/utils'
import { useTweetModal } from '@/hooks/useTweetModal'
import { useReplyTweet } from '@/hooks/useReplyTweet'
import { renderText } from '@/lib/tweet'
import { Like, Share, Comment, Menu } from "./"
import TweetText from '@/components/sharing/TweetText'
import { usePrevious } from '@/hooks/usePrevious'

interface Props {
  tweet: DetailTweet
  userId: string;
}

const Tweets = ({ tweet, userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { addToNavigationHistory } = usePrevious();

  const [isMounted, setIsMounted] = useState(false)
  const setDataTweet = useReplyTweet(state => state.setDataTweet);
  const setOnOpenReplyTweetModal = useTweetModal(state => state.onOpen);

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

  const formattedCreatedAt = tweet.createdAt && customDatePost(tweet.createdAt.getTime());

  const isOwnTweet = tweet.userId === userId;

  const redirectToDetailPost = () => {
    addToNavigationHistory(getCurrentPath());
    router.push(`/${tweet.user.username}/status/${tweet.id}`);
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) return null;

  return (
    <article
      className="flex gap-x-5 px-3 py-4 border-b border-b-gray-300 bg-black-100 hover:bg-black-200/20 transition-all cursor-pointer"
      onClick={e => {
        e.stopPropagation();
        redirectToDetailPost();
      }}
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
      <div className="flex-1 flex flex-col">
        <section className="flex-1 flex justify-between">
          <div className="flex-1 flex flex-col spcae-y-6">
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
              <TweetText content={renderText(tweet.text)} />
            </p>
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

        <section className="flex flex-col space-y-3">
          <section>
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
          </section>

          <section className="flex items-center gap-x-8">
            <Comment
              totalReplies={tweet._count.replies}
              replyTweet={replyTweet}
            />
            <Like
              liked={liked!}
              path={pathname}
              userId={tweet.user.id}
              currentUserId={userId}
              threadId={tweet.id}
              totalLikes={tweet.likes.length}
            />
            <div className="flex-1 flex justify-end">
              <Share
                path={pathname}
                userId={userId}
                tweetId={tweet.id}
                bookmark={bookmark!}
                username={tweet.user.username}
              />
            </div>
          </section>
        </section>
      </div>
    </article>
  )
}

export default Tweets