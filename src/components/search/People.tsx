import { UserWithFollowers } from "@/interfaces/user.interface"
import { User } from "@prisma/client";
import UsersTwo from "../cards/UsersTwo";
import NotFound from "../sharing/NotFound";

interface Props {
  currentUser: UserWithFollowers;
  people: User[] | undefined;
  queryQ: string;
}

const People = ({ currentUser, people, queryQ }: Props) => {
  const isDataPeopleEmpty = !people?.length

  return (
    !isDataPeopleEmpty ? people.map(user => (
      <UsersTwo
        key={user.id}
        userId={user.id}
        username={user.username}
        name={user.name}
        imageUrl={user.imageUrl}
        bio={user.bio}
        currentUser={currentUser}
      />
    )) : (
      <NotFound title={`No results for users "${queryQ}"`} description="Try searching for something else" />
    )
  )
}

export default People