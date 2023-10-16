import { DetailTweet } from "@/interfaces/tweet.interface"
import Tweets from "../cards/tweets/Tweets"
import { UserWithFollowers } from "@/interfaces/user.interface";
import { User } from "@prisma/client";
import UsersTwo from "../cards/UsersTwo";
import Link from "next/link";

interface Props {
  tweets: DetailTweet[] | undefined;
  people: User[] | undefined;
  currentUser: UserWithFollowers;
  queryQ: string;
}

const Top = ({ tweets, currentUser, people, queryQ }: Props) => {
  const optionLink = {
    pathname: '/search',
    query: {
      q: queryQ,
      f: "people"
    }
  }

  const isDataPeopleEmpty = !people?.length

  return (
    <>
      {!isDataPeopleEmpty && (
        <section className="border-b border-gray-300">
          <h2 className="text-xl font-bold px-3 py-4">People</h2>
          {people.slice(0,3).map(user => (
            <UsersTwo
              key={user.id}
              userId={user.id}
              name={user.name}
              username={user.username}
              imageUrl={user.imageUrl}
              bio={user.bio}
              currentUser={currentUser}
            />
          ))}
          {people.length > 3 && (
            <div className="w-full py-4 px-3 hover:bg-gray-300/30">
              <Link
                href={optionLink}
                className="text-blue hover:underline"
              >
                View All
              </Link>
            </div>
          )}
        </section>
      )}
      {tweets?.map(tweet => (
        <Tweets
          key={tweet.id}
          tweet={tweet}
          userId={currentUser.id}
        />
      ))}
    </>
  )
}

export default Top