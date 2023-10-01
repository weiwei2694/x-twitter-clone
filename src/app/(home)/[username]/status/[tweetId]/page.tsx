import { getTweetAction } from '@/actions/tweet.action'
import { getUserAction, getUserByUsernameAction } from '@/actions/user.action';
import DetailTweet from '@/components/tweetId/DetailTweet';
import Tweets from '@/components/cards/tweets/Tweets';
import Topbar from '@/components/tweetId/Topbar'
import { currentUser as clerkCurrentUser } from '@clerk/nextjs';
import NotFound from '@/components/sharing/404';
import { redirect } from 'next/navigation';
import { DataTweet } from '@/interfaces/tweet.interface';
import ButtonCreatePostMobile from '@/components/sharing/ButtonCreatePostMobile';

interface Props {
  params: {
    username: string;
    tweetId: string;
  }
}

const Page = async ({ params }: Props) => {
  const { tweetId, username } = params;

  const dataTweet = await getTweetAction(tweetId);
  if (!dataTweet) return <NotFound />

  const clerkUser = await clerkCurrentUser()
  if (!clerkUser) return null

  const currentUser = await getUserAction(clerkUser.id)
  if (!currentUser) redirect('/')

  const user = await getUserByUsernameAction(username)
  if (!user) return <NotFound />;

  const isValidUsername = user.username === username;
  if (!isValidUsername) return <NotFound />

  const dataReplyTweet: DataTweet = {
    id: dataTweet.id,
    text: dataTweet.text,
    imageUrl: dataTweet.imageUrl,
    createdAt: dataTweet.createdAt,
    parentId: dataTweet.id,
    user: {
      name: dataTweet.user.name,
      username: dataTweet.user.username,
      imageUrl: dataTweet.user.imageUrl
    }
  }

  return (
    <>
      <ButtonCreatePostMobile
        isMobile
        dataTweet={dataReplyTweet}
      />
      <Topbar />
      <DetailTweet
        tweet={dataTweet}
        userId={currentUser.id}
      />
      {
        dataTweet.replies.map(tweet => (
          <Tweets
            key={tweet.id}
            tweet={tweet}
            userId={currentUser.id}
          />
        ))
      }
    </>
  )
}

export default Page