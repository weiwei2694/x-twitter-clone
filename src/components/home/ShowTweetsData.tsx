"use client"

import { useState, useEffect, useTransition } from 'react'
import { useInView } from 'react-intersection-observer';
import Loading from '../sharing/Loading';
import { DetailTweet } from '@/interfaces/tweet.interface';
import { getTweetsAction } from '@/actions/tweet.action';
import Tweets from '../cards/tweets/Tweets';

interface Props {
  initialDataTweets: DetailTweet[] | null;
  userId: string;
  isFollowing: boolean;
  parentId?: string;
}

const ShowTweetsData = ({ initialDataTweets, userId, isFollowing, parentId }: Props) => {
  const [dataTweets, setDataTweets] = useState(initialDataTweets);

  const [isTweetsDataMaxed, setIsTweetsDataMaxed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [ref, inView] = useInView();
  const [_, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);

  const loadMoreDataTweets = async () => {
    try {
      if (currentPage === 0) {
        return startTransition(() => {
          setCurrentPage((prev: number) => prev + 1);
        })
      }
      setIsPending(true);

      const newDataTweets = await getTweetsAction({
        userId,
        page: currentPage,
        isFollowing,
        parentId
      })

      startTransition(() => {
        if (!newDataTweets?.length) {
          return setIsTweetsDataMaxed(true);
        }

        setDataTweets((prev: DetailTweet[] | null) => [
          ...(prev?.length ? prev : []),
          ...newDataTweets
        ]);
        setCurrentPage(prev => prev + 1);
      })
    } catch (error) {
      console.info("[ERROR_LOAD_MORE_DATA_TWEETS]", error)
    } finally {
      setIsPending(false);
    }
  }

  useEffect(() => {
    setDataTweets(initialDataTweets);
    setIsTweetsDataMaxed(false);
    setCurrentPage(1);
  }, [initialDataTweets])

  useEffect(() => {
    if (isPending) return;

    if (inView) {
      loadMoreDataTweets();
    }
  }, [inView])

  return (
    dataTweets?.length && (
      <>
        {dataTweets.map(tweet => (
          <Tweets
            key={tweet.id}
            tweet={tweet}
            userId={userId}
          />
        ))}

        {!isTweetsDataMaxed && (
          <section ref={ref}>
            <Loading />
          </section>
        )}
      </>
    )
  )
}

export default ShowTweetsData