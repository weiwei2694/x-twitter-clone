import Topbar from "@/components/home/Topbar"
import CreateTweetForm from "@/components/forms/createtweetform/CreateTweetForm";
import TweetsList from "@/components/home/TweetsList";
import { getTweetsAction } from "@/actions/tweet.action";
import { currentUser } from "@clerk/nextjs";
import { getUserAction } from "@/actions/user.action";
import { redirect } from "next/navigation";
import ButtonCreatePostMobile from "@/components/sharing/ButtonCreatePostMobile";

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
    if (!user || "message" in user) redirect('/');

    let tweets = await getTweetsAction({ userId: user.id, isFollowing });
    if (!tweets || "message" in tweets) tweets = [];

    return (
        <>
            <ButtonCreatePostMobile />
            <Topbar
                isFollowing={isFollowing}
                user={user}
            />
            <section className="border-b border-gray-300 max-sm:hidden">
                <CreateTweetForm
                    userId={user.id}
                    imageUrl={user.imageUrl}
                    htmlForId="home"
                />
            </section>
            {/* TODO : Display Posts & Infinite Scrolls */}
            <TweetsList dataTweets={tweets ?? []} userId={user.id} />
        </>
    )
}

export default Page