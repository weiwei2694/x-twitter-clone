"use client"

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import Loading from '../sharing/Loading';
import { MultipleTweetWithConnection } from '@/interfaces/tweet.interface';
import { getTweetsAction } from '@/actions/tweet.action';
import Tweets from '../cards/tweets/Tweets';

interface Props {
  initialRepliesData: MultipleTweetWithConnection[] | null;
  userId: string;
  isFollowing: boolean;
  parentId: string;
}

const ShowRepliesData = ({ initialRepliesData, userId, isFollowing, parentId }: Props) => {
  const [dataTweets, setDataTweets] = useState(initialRepliesData);

  const [isRepliesDataMaxed, setIsRepliesDataMaxed] = useState(false);
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
      setIsRepliesDataMaxed(true)
      return;
    }

    setDataTweets((prev: MultipleTweetWithConnection[] | null) => [
      ...(prev?.length ? prev : []),
      ...newDataTweets
    ]);
    setCurrentPage(prev => prev + 1);
  }

  useEffect(() => {
    setDataTweets(initialRepliesData);
    setIsRepliesDataMaxed(false);
    setCurrentPage(1);
  }, [initialRepliesData])

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

      {!isRepliesDataMaxed && (
        <section
          ref={sectionLoadingRef}
        >
          <Loading />
        </section>
      )}
    </>
  )
}

export default ShowRepliesData