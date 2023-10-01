import { MultipleTweetWithConnection } from "@/interfaces/tweet.interface"
import Tweets from "../cards/tweets/Tweets";

interface Props {
  tweets: MultipleTweetWithConnection[] | undefined;
  userId: string;
}

const Media = ({ tweets, userId }: Props) => {
  return (
    tweets?.map(tweet => (
      <Tweets
        key={tweet.id}
        tweet={tweet}
        userId={userId}
      />
    ))
  )
}

export default Media