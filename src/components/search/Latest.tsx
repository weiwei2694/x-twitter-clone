import { MultipleTweetWithConnection } from "@/interfaces/tweet.interface";
import Tweets from "../cards/tweets/Tweets";

interface Props {
  userId: string;
  tweets: MultipleTweetWithConnection[] | undefined;
}

const Latest = ({ userId, tweets }: Props) => {
  const ascendingTweets = tweets?.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime() as number;
    const dateB = new Date(b.createdAt).getTime() as number;
    return dateB - dateA;
  })

  return (
    ascendingTweets?.map(tweet => (
      <Tweets
        key={tweet.id}
        tweet={tweet}
        userId={userId}
      />
    ))
  )
}

export default Latest