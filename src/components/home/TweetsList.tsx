"use client";

import { useEffect, useState } from "react";
import Tweets from "../cards/Tweets";
import { TweetWithConnection } from "@/interfaces/tweet.interface";
import Loading from "../Loading";
import { useTabsPosts } from "@/hooks/useTabsPosts";

interface Props {
  dataTweets: TweetWithConnection[];
  userId: string;
  filter: string;
}

const TweetsList = ({ dataTweets, userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const status = useTabsPosts(state => state.status)

  console.log(dataTweets)

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