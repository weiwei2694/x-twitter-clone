import { getBookmarksAction } from '@/actions/tweet.action'
import { getUserAction } from '@/actions/user.action'
import Tweets from '@/components/cards/tweets/Tweets'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const Page = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect("/")

  let bookmarks = await getBookmarksAction(user.id)
  if (!bookmarks?.length) bookmarks = []

  const isBookmarksEmpty = !bookmarks.length;

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
    isBookmarksEmpty
      ? savePostsForLater()
      : bookmarks.map(tweet => (
        <Tweets
          tweet={tweet}
          userId={user.id}
        />
      ))
  )
}

export default Page