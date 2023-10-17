import { getTweetsAction } from "@/actions/tweet.action";
import { currentUser } from "@clerk/nextjs";
import { getUserAction } from "@/actions/user.action";
import { redirect } from "next/navigation";
import NotFound from "@/components/sharing/NotFound";
import ShowTweetsData from "@/components/home/ShowTweetsData";

const Page = async () => {
    const clerkUser = await currentUser()
    if (!clerkUser) return null;

    const user = await getUserAction(clerkUser.id)
    if (!user) redirect('/');

    const isFollowing = false;
    let tweets = await getTweetsAction({ userId: user.id, isFollowing });
    if (!tweets?.length) tweets = [];

    return (
        <>
            {tweets.length
                ? <ShowTweetsData userId={user.id} isFollowing={isFollowing} initialDataTweets={tweets} />
                : <NotFound description="No posts can be displayed" />}
        </>
    )
}

export default Page