import { getTweetAction } from '@/actions/tweet.action'
import { getUserAction } from '@/actions/user.action';
import DetailTweet from '@/components/tweetId/DetailTweet';
import Tweets from '@/components/cards/Tweets';
import Topbar from '@/components/tweetId/Topbar'
import { currentUser } from '@clerk/nextjs';
import CreateTweetForm from '@/components/forms/CreateTweetForm';
import NotFound from '@/components/404';

interface Props {
  params: {
    username: string;
    tweetId: string;
  }
}

const Page = async ({ params }: Props) => {
  const tweetId = params.tweetId;
  const username = params.username

  const dataTweet = await getTweetAction(tweetId);
  if (!dataTweet) return <NotFound />

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const user = await getUserAction(clerkUser.id)
  if (!user) return null;
  
  const isValidUsername = user.username === username;
  if (!isValidUsername) return <NotFound />

  return (
    <div className="relative">
      <Topbar />
      <DetailTweet tweet={dataTweet} userId={user.id} />
      <div className="border-b border-gray-300">
        <CreateTweetForm
          userId={user.id}
          imageUrl={user.imageUrl}
          isReply
          htmlForId="tweetId"
          dataTweet={dataTweet}
          parentId={dataTweet.id}
        />
      </div>
      {/* Create Infinite Scroll -> if required */}
      {
        dataTweet.replies.map(tweet => (
          <Tweets
            key={tweet.id}
            tweet={tweet}
            userId={user.id}
          />
        ))
      }
    </div>
  )
}

export default Page