import { GetTweetsActionType } from "@/types/tweet.type";
import Tweets from "../cards/tweets/Tweets";

interface Props {
  tweets: GetTweetsActionType | undefined;
  userId: string;
}

const Media = ({ tweets, userId }: Props) => {
  return (
    tweets?.data.length ? tweets.data.map(tweet => (
      <Tweets
        key={tweet.id}
        tweet={tweet}
        userId={userId}
      />
    )) : null
  )
}

export default Media