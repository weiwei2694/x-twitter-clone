import { getTweetsAction } from '@/actions/tweet.action';
import { getUserAction } from '@/actions/user.action';
import ShowRepliesData from '@/components/tweetId/ShowRepliesData';
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

  let initialRepliesData = await getTweetsAction({
    userId: user.id,
    parentId: tweetId,
    isFollowing: false
  })

  return (
    <>
      {
        initialRepliesData
          ? (
            <ShowRepliesData
              initialRepliesData={initialRepliesData}
              isFollowing={false}
              parentId={tweetId}
              userId={user.id}
            />
          )
          : null
      }
    </>
  )
}

export default Page