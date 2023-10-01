import { UserWithFollowers } from "@/interfaces/user.interface"
import { User } from "@prisma/client";
import UsersTwo from "../cards/UsersTwo";

interface Props {
  currentUser: UserWithFollowers;
  people: User[] | undefined;
}

const People = ({ currentUser, people }: Props) => {
  return (
    people?.map(user => (
      <UsersTwo
        key={user.id}
        userId={user.id}
        username={user.username}
        name={user.name}
        imageUrl={user.imageUrl}
        bio={user.bio}
        currentUser={currentUser}
      />
    ))
  )
}

export default People