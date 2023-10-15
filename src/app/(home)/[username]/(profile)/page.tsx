import { getTweetsByUserIdAction } from "@/actions/tweet.action";
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
    title: `${user.name} (${user.username})`,
    openGraph: {
      title: `${user.name} (${user.username})`
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

  let tweets = await getTweetsByUserIdAction(user.id);
  if (!tweets?.length) tweets = [];

  return (
    <>
      {
        tweets.map(tweet => (
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