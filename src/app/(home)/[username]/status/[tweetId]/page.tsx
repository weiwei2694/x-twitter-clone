import { getTweetAction } from '@/actions/tweet.action';
import { getUserAction } from '@/actions/user.action';
import ShowTweetsData from '@/components/home/ShowTweetsData';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    tweetId: string;
  }
}

const Page = async ({ params }: Props) => {
  const { tweetId } = params;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user) redirect('/')

  let initialDataTweets: any = await getTweetAction(tweetId)
  initialDataTweets = initialDataTweets?.replies || [];

  return (
    <>
      {
        initialDataTweets
          ? <ShowTweetsData initialDataTweets={initialDataTweets} isFollowing={false} userId={user.id} />
          : null
      }
    </>
  )
}

export default Page