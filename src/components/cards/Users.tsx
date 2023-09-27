"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation"
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { UserWithFollowers } from "@/interfaces/user.interface";
import { toggleFollowUser } from "@/lib/user";
import toast from "react-hot-toast";
import Link from "next/link";
import { User } from "lucide-react";

interface UsersProps {
    username: string;
    name: string;
    imageUrl: string;
    userId: string;
    currentUser: UserWithFollowers;
    isOnSearch?: boolean;
}

const Users = ({ username, name, imageUrl, userId, currentUser, isOnSearch }: UsersProps) => {
    // path
    const path = usePathname();
    // mutation for toggle follow and unfollow user
    const [isPending, startTransition] = useTransition()

    const followed = currentUser.followings.find(({ followingId }) => followingId === currentUser.id)

    const isFollowed = () => {
        if (isPending) return "..."
        if (followed) return "Unfollow"
        return "Follow"
    }

    return (
        <li
            className="flex items-center jsutify-between gap-x-8 w-full hover:bg-gray-300/90 rounded-xl p-3 overflow-hidden"
        >
            <div className="flex items-center gap-x-2 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={name}
                    width={40}
                    height={40}
                    className="object-cover rounded-full"
                />
                <div className="flex items-start flex-col -space-y-1">
                    <Link
                        href={`/${username}`}
                        className="font-normal text-white whitespace-nowrap hover:underline"
                    >
                        {name}
                    </Link>
                    <p className="font-normal text-gray-200 whitespace-nowrap">@{username}</p>
                    {followed && (
                        <p className="font-normal text-gray-200 flex items-center gap-x-1">
                            <User size={14} />
                            Following
                        </p>
                    )}
                </div>
            </div>
            {!isOnSearch && (
                <div className="flex-1 flex justify-end">
                    <Button
                        disabled={isPending}
                        onClick={() => toggleFollowUser({
                            isPending,
                            startTransition,
                            toast,
                            path,
                            username,
                            followed,
                            userId,
                            currentUserId: currentUser.id,
                        })}
                        className={
                            cn(
                                "py-1 px-4 font-bold tracking-wide rounded-full",
                                !followed
                                    ? "bg-white hover:bg-white/90 text-black-100"
                                    : "border border-gray-200 bg-transparent hover:border-red-500 hover:text-red-500 hover:bg-transparent"
                            )
                        }
                    >
                        {isFollowed()}
                    </Button>
                </div>
            )}
        </li>
    )
}

export default Users