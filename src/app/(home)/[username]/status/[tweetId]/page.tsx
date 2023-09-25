import { getTweetAction } from '@/actions/tweet.action'
import { getUserAction, getUserByUsernameAction } from '@/actions/user.action';
import DetailTweet from '@/components/tweetId/DetailTweet';
import Tweets from '@/components/cards/Tweets';
import Topbar from '@/components/tweetId/Topbar'
import { currentUser as clerkCurrentUser } from '@clerk/nextjs';
import CreateTweetForm from '@/components/forms/CreateTweetForm';
import NotFound from '@/components/404';
import { redirect } from 'next/navigation';

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
  if (!dataTweet || "message" in dataTweet) return <NotFound />

  const clerkUser = await clerkCurrentUser()
  if (!clerkUser) return null

  const currentUser = await getUserAction(clerkUser.id)
  if (!currentUser || "message" in currentUser) redirect('/')

  const user = await getUserByUsernameAction(username)
  if (!user || "message" in user) return <NotFound />;
  
  const isValidUsername = user.username === username;
  if (!isValidUsername) return <NotFound />

  return (
    <div className="relative">
      <Topbar />
      <DetailTweet
        tweet={dataTweet}
        userId={currentUser.id}
      />
      <div className="border-b border-gray-300">
        <CreateTweetForm
          userId={currentUser.id}
          imageUrl={currentUser.imageUrl}
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
            userId={currentUser.id}
          />
        ))
      }
    </div>
  )
}

export default Page