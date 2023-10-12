"use client"

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import Loading from '../sharing/Loading';
import { MultipleTweetWithConnection } from '@/interfaces/tweet.interface';
import { getTweetsAction } from '@/actions/tweet.action';
import Tweets from '../cards/tweets/Tweets';

interface Props {
  initialDataTweets: MultipleTweetWithConnection[] | null;
  userId: string;
  isFollowing: boolean;
  parentId?: string;
}

const ShowTweetsData = ({ initialDataTweets, userId, isFollowing, parentId }: Props) => {
  const [dataTweets, setDataTweets] = useState(initialDataTweets);

  const [isTweetsDataMaxed, setIsTweetsDataMaxed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionLoadingRef, inView] = useInView();

  const loadMoreDataTweets = async () => {
    const newDataTweets = await getTweetsAction({
      userId,
      page: currentPage,
      isFollowing,
      parentId
    })

    if (!newDataTweets?.length) {
      setIsTweetsDataMaxed(true)
      return;
    }

    setDataTweets((prev: MultipleTweetWithConnection[] | null) => [
      ...(prev?.length ? prev : []),
      ...newDataTweets
    ]);
    setCurrentPage(prev => prev + 1);
  }

  useEffect(() => {
    setDataTweets(initialDataTweets);
    setIsTweetsDataMaxed(false);
    setCurrentPage(1);
  }, [initialDataTweets])

  useEffect(() => {
    if (inView) {
      loadMoreDataTweets();
    }
  }, [inView])

  return (
    <>
      {dataTweets?.map(tweet => (
        <Tweets
          key={tweet.id}
          tweet={tweet}
          userId={userId}
        />
      ))}

      {!isTweetsDataMaxed && (
        <section
          ref={sectionLoadingRef}
        >
          <Loading />
        </section>
      )}
    </>
  )
}

export default ShowTweetsData