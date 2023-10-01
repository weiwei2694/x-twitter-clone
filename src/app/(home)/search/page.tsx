import { getTweetsBySearchAction } from "@/actions/tweet.action";
import { getUserAction, getUsersAction } from "@/actions/user.action";
import Latest from "@/components/search/Latest";
import Media from "@/components/search/Media";
import People from "@/components/search/People";
import Tabs from "@/components/search/Tabs";
import Top from "@/components/search/Top";
import NotFound from "@/components/sharing/NotFound";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    q: string;
    f: string;
  }
}

const Page = async ({ searchParams }: Props) => {
  const { q: queryQ, f: queryF } = searchParams;
  if (!queryQ) redirect('/explore');

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id);
  if (!user || "message" in user) redirect('/')

  const people = await getUsersAction({
    userId: user.id,
    isOnSearch: true,
    searchQuery: queryQ
  })

  const tweets = await getTweetsBySearchAction({
    searchQuery: queryQ
  })

  /**
   * @DisplayContent - Tabs
   * Top
   * Latest
   * People
   * Media
   */
  const DisplayContent = () => {
    if (!people?.length && !tweets?.length) {
      return <NotFound title={`No results for "${queryQ}"`} description="Try searching for something else" />
    }
    if (!queryF) return <Top currentUser={user} queryQ={queryQ} people={people} tweets={tweets} />

    switch (queryF.toLowerCase()) {
      case "top":
        return <Top currentUser={user} queryQ={queryQ} people={people} tweets={tweets} />;
      case "latest":
        return <Latest userId={user.id} tweets={tweets} />
      case "people":
        return <People queryQ={queryQ} people={people} currentUser={user} />
      case "media":
        return <Media tweets={tweets} userId={user.id} />
    }
  }

  return (
    <>
      <Tabs />
      <DisplayContent />
    </>
  )
}

export default Page