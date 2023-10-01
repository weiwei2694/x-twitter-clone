import { getTweetsAction } from "@/actions/tweet.action";
import { currentUser } from "@clerk/nextjs";
import { getUserAction } from "@/actions/user.action";
import { redirect } from "next/navigation";
import Tweets from "@/components/cards/tweets/Tweets";

interface Props {
    searchParams: {
        filter: string;
    }
}

const Page = async ({ searchParams }: Props) => {
    const isFollowing = searchParams.filter === "following";

    const clerkUser = await currentUser()
    if (!clerkUser) return null;

    const user = await getUserAction(clerkUser.id)
    if (!user) redirect('/');

    let tweets = await getTweetsAction({ userId: user.id, isFollowing });
    if (!tweets?.length) tweets = [];

    return (
        tweets.map(tweet => (
            <Tweets
                key={tweet.id}
                tweet={tweet}
                userId={user.id}
            />
        ))
    )
}

export default Page