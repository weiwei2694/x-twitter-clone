import { getBookmarksAction } from '@/actions/tweet.action'
import { getUserAction } from '@/actions/user.action'
import Topbar from '@/components/bookmarks/Topbar'
import TweetsList from '@/components/home/TweetsList'
import ButtonCreatePostMobile from '@/components/sharing/ButtonCreatePostMobile'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user || "message" in user) redirect("/")

  let bookmarks = await getBookmarksAction(user.id)
  if (!bookmarks || "message" in bookmarks) bookmarks = []

  const isBookmarksEmpty = !bookmarks.length;

  const savePostsForLater = () => {
    return (
      <div className="flex justify-center mt-6">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-extrabold tracking-wide">Save posts for later</h1>
          <p className="font-normal text-gray-200">Bookmark posts to easily find them again in the future.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="relative">
      <ButtonCreatePostMobile />
      <Topbar username={user.username} userId={user.id} isBookmarksEmpty={isBookmarksEmpty} />
      {isBookmarksEmpty
        ? savePostsForLater()
        : <TweetsList
            dataTweets={bookmarks}
            userId={user.id}
          />
      }
    </section>
  )
}

export default Page