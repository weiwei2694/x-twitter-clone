"use client"

import Tweets from "../cards/tweets/Tweets";
import { GetTweetsActionType } from "@/types/tweet.type";

interface Props {
  userId: string;
  tweets: GetTweetsActionType | undefined;
}

const Latest = ({ userId, tweets }: Props) => {
  const ascendingTweets = tweets?.data.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime() as number;
    const dateB = new Date(b.createdAt).getTime() as number;
    return dateB - dateA;
  })

  return (
    ascendingTweets?.length && ascendingTweets.map(tweet => (
      <Tweets
        key={tweet.id}
        tweet={tweet}
        userId={userId}
      />
    ))
  )
}

export default Latest