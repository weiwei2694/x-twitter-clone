import { User } from '@prisma/client'
import React from 'react'
import Users from '../cards/Users'
import Searchbar from './searchbar/Searchbar';
import { UserWithFollowers } from '@/interfaces/user.interface';

interface RightSidebarProps {
  users: User[],
  user: UserWithFollowers;
}

const RightSidebar = ({ users, user: currentUser }: RightSidebarProps) => {
  const isUsersEmpty = !users.length;

  const showUsersList = () => {
    if (isUsersEmpty) {
      return (
        <p className="text-gray-200 font-normal">there are no users to follow</p>
      )
    }

    return (
      users.map(user => (
        <Users
          key={user.id}
          username={user.username}
          name={user.name}
          imageUrl={user.imageUrl}
          userId={user.id}
          currentUser={currentUser}
          isOnSearch={false}
        />
      ))
    )
  }

  return (
    <aside className="h-screen w-full max-w-[350px] p-3 border-l border-l-gray-300 max-lg:hidden lg:flex flex-col space-y-6">
      {/* TODO: searchbar */}
      <Searchbar currentUser={currentUser} />

      {/* TODO: who to follow */}
      <div className="p-3 bg-gray-400 rounded-xl flex flex-col space-y-6">
        <h3 className="text-xl text-gray-100 font-bold tracking-wide">
          Who To Follow
        </h3>
        <ul>
          {showUsersList()}
        </ul>
      </div>
    </aside>
  )
}

export default RightSidebar