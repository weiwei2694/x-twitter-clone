import { getLikeTweetsByUserId } from "@/actions/tweet.action";
import { getUserAction, getUserByUsernameAction } from "@/actions/user.action";
import NotFound from "@/components/sharing/404";
import Tweets from "@/components/cards/tweets/Tweets";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
  params: {
    username: string;
  }
}

export const generateMetadata = async ({ params }: Props) => {
  const { username } = params;
  const user = await getUserByUsernameAction(username);

  if (!user) {
    return {
      title: "Profile"
    }
  }

  return {
    title: `Posts with liked by ${user.name} (${user.username})`,
    openGraph: {
      title: `Posts with liked by ${user.name} (${user.username})`
    }
  }
}


const Page = async ({ params }: Props) => {
  const username = params.username;

  // currentUser()
  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const currentUser = await getUserAction(clerkUser.id);
  if (!currentUser) redirect('/');

  const user = await getUserByUsernameAction(username);
  if (!user) return <NotFound />;

  let likeTweets = await getLikeTweetsByUserId(user.id);
  if (!likeTweets?.length) likeTweets = [];

  const isLikeTweetsEmpty = !likeTweets.length;

  const savePostsForLater = () => {
    return (
      <div className="flex justify-center mt-8 px-3">
        <div className="flex flex-col items-start max-w-[300px]">
          {currentUser.id === user.id
            ? (
              <>
                <h1 className="text-3xl font-extrabold tracking-wide">You don’t have any likes yet</h1>
                <p className="font-normal text-gray-200">Tap the heart on any post to show it some love. When you do, it’ll show up here..</p>
              </>
            )
            : (
              <>
                <h1 className="text-3xl font-extrabold tracking-wide">@{user.username} hasn’t </h1>
                <p className="font-normal text-gray-200">When they do, those posts will show up here.</p>
              </>
            )}

        </div>
      </div>
    )
  }

  return (
    <>
      {isLikeTweetsEmpty
        ? savePostsForLater()
        : (
          likeTweets.map(tweet => (
            <Tweets
              key={tweet.id}
              tweet={tweet}
              userId={currentUser.id}
            />
          ))
        )}
    </>
  )
}

export default Page