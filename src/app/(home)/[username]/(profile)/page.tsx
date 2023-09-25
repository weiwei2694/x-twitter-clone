import { getTweetsByUserIdAction } from "@/actions/tweet.action";
import { getUserAction, getUserByUsernameAction } from "@/actions/user.action";
import NotFound from "@/components/404";
import Tweets from "@/components/cards/Tweets";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
  params: {
    username: string;
  }
}

const Page = async ({ params }: Props) => {
  const username = params.username;

  // currentUser()
  const clerkUser = await clerkCurrentUser();
  if (!clerkUser) return null;

  const currentUser = await getUserAction(clerkUser.id);
  if (!currentUser || "message" in currentUser) redirect('/');

  const user = await getUserByUsernameAction(username);
  if (!user || "message" in user) return <NotFound />;

  let tweets = await getTweetsByUserIdAction(user.id);
  if (!tweets || "message" in tweets) tweets = [];

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