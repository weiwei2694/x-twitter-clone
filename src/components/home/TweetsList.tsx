"use client";

import { useEffect, useState } from "react";
import Tweets from "../cards/tweets/Tweets";
import { MultipleTweetWithConnection } from "@/interfaces/tweet.interface";
import Loading from "../sharing/Loading";
import { useTabsPosts } from "@/hooks/useTabsPosts";

interface Props {
  dataTweets: MultipleTweetWithConnection[];
  userId: string;
}

const TweetsList = ({ dataTweets, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const status = useTabsPosts(state => state.status)

  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, [status])

  const isDataTweetsEmpty = !dataTweets.length

  return (
    <div>
      {isLoading
        ? <Loading />
        : (
          isDataTweetsEmpty ? (
            <div className="text-center mt-16">
              <p className="text-gray-200">No posts can be displayed</p>
            </div>
          ) : dataTweets.map(tweet => (
            <Tweets key={tweet.id} tweet={tweet} userId={userId} />
          ))
        )
      }
    </div>
  )
}

export default TweetsList