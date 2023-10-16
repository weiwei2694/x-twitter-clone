"use client"

import { User } from '@prisma/client'
import { useState, useEffect, useTransition } from 'react'
import { useInView } from 'react-intersection-observer';
import Users from '../cards/Users'
import { UserWithFollowers } from '@/interfaces/user.interface';
import { getUsersAction } from '@/actions/user.action';
import Loading from '../sharing/Loading';

interface Props {
  initialDataUsers: User[] | null;
  user: UserWithFollowers;
}

const ShowUsersData = ({ initialDataUsers, user }: Props) => {
  const [dataUsers, setDataUsers] = useState(initialDataUsers);
  const [isUsersDataMaxed, setIsUsersDataMaxed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [_, startTransition] = useTransition();
  const [ref, inView] = useInView();

  const loadMoreDataUsers = async () => {
    try {
      if (currentPage === 0) {
        return startTransition(() => {
          setCurrentPage((prev: number) => prev + 1);
        })
      }
      setIsPending(true);

      const newDataUsers = await getUsersAction({
        userId: user.id,
        size: 20,
        page: currentPage,
      })

      startTransition(() => {
        if (!newDataUsers?.length) {
          return setIsUsersDataMaxed(true);
        }

        setDataUsers((prev: User[] | null) => [
          ...(prev?.length ? prev : []),
          ...newDataUsers
        ]);
        setCurrentPage(prev => prev + 1);
      })
    } catch (error) {
      console.info("[ERROR_LOAD_MORE_DATA_USERS]", error)
    } finally {
      setIsPending(false);
    }
  }

  useEffect(() => {
    if (isPending) return;

    if (inView) {
      loadMoreDataUsers();
    }
  }, [inView])

  if (!dataUsers?.length) {
    return (
      <div className="flex justify-center py-4 px-3">
        <div className="flex flex-col items-start">
          <p className="font-normal text-gray-200">Try searching for something else</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ul
        className="flex flex-col py-4 px-3"
      >
        {dataUsers.map(userData => (
          <Users
            key={userData.id}
            name={userData.name}
            username={userData.username}
            imageUrl={userData.imageUrl}
            userId={userData.id}
            currentUser={user}
          />
        ))}
      </ul>

      {!isUsersDataMaxed && (
        <section
          ref={ref}
        >
          <Loading />
        </section>
      )}
    </>
  )
}

export default ShowUsersData