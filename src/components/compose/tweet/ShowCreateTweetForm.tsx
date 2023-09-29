"use client"

import CreateTweetForm from '@/components/forms/CreateTweetForm'
import { useReplyTweet } from '@/hooks/useReplyTweet'

interface Props {
  userId: string;
  imageUrl: string;
}

const ShowCreateTweetForm = ({ userId, imageUrl }: Props) => {
  const dataTweet = useReplyTweet(state => state.dataTweet);

  return (
    <CreateTweetForm
      dataTweet={dataTweet}
      isReply={dataTweet ? true : false}
      userId={userId}
      imageUrl={imageUrl}
      htmlForId="compoose-tweet"
      isMobile
    />
  )
}

export default ShowCreateTweetForm