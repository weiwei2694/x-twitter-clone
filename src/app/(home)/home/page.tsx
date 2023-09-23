import Topbar from "@/components/home/Topbar"
import CreateTweetForm from "@/components/forms/CreateTweetForm";
import TweetsList from "@/components/home/TweetsList";
import { getTweets } from "@/actions/tweet.action";
import { currentUser } from "@clerk/nextjs";
import { getUser } from "@/actions/user.action";

const Page = async ({ searchParams }: { searchParams: { filter: string }}) => {
    const clerkUser = await currentUser()
    if (!clerkUser) return null;

    const user = await getUser(clerkUser.id)
    if (!user) return null;

    const isFollowing = searchParams.filter === "following";
    const tweets = await getTweets({ userId: user.id, isFollowing });

    return (
        <div className="relative">
            <Topbar isFollowing={isFollowing} />
            <div className="border-b border-gray-300">
                <CreateTweetForm userId={user.id} imageUrl={user.imageUrl} id="home" />
            </div>
            {/* TODO : Display Posts & Infinite Scrolls */}
            <TweetsList dataTweets={tweets ?? []} filter={searchParams.filter} userId={user.id} />
        </div>
    )
}

export default Page