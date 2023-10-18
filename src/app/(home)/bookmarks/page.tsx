import { getTweetsAction } from '@/actions/tweet.action'
import { getUserAction } from '@/actions/user.action'
import Tweets from '@/components/cards/tweets/Tweets'
import PaginationButtons from '@/components/sharing/PaginationButtons'
import { isValidPage } from '@/lib/utils'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface Props {
  searchParams: {
    page: string;
  }
}

const Page = async ({ searchParams }: Props) => {
  const { page: qPage } = searchParams;
  const page = isValidPage(qPage);

  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect("/")

  const tweets = await getTweetsAction({
    userId: user.id,
    isBookmarks: true,
    page
  })

  const isBookmarksEmpty = !tweets?.data.length;

  const savePostsForLater = () => {
    return (
      <section className="flex justify-center mt-6">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-extrabold tracking-wide">Save posts for later</h1>
          <p className="font-normal text-gray-200">Bookmark posts to easily find them again in the future.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      {!isBookmarksEmpty
        ? (
          <>
            {tweets?.data.map(tweet => (
              <Tweets
                key={tweet.id}
                tweet={tweet}
                userId={user.id}
              />
            ))}

            <PaginationButtons
              currentPage={page}
              currentPath={"/bookmarks"}
              hasNext={tweets.hasNext}
            />
          </>
        )
        : savePostsForLater()}
    </>
  )
}

export default Page