"use client";

import { useTabsPosts } from '@/hooks/useTabsPosts'
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import MobileSidebar from './MobileSidebar';
import { UserWithFollowers } from '@/interfaces/user.interface';
import Image from 'next/image';

interface TabsProps {
    title: string;
}
interface TopbarProps {
    user: UserWithFollowers;
}

const Tabs = ({ title }: TabsProps) => {
    const router = useRouter()
    const tabsPosts = useTabsPosts()
    const searchParams = useSearchParams()

    const isFollowing = searchParams.get('filter') === "following"

    // Initial Value
    useEffect(() => {
        if (isFollowing) tabsPosts.setStatus("Following");
    }, []);

    const isTitleEqualToStatus = title === tabsPosts.status;

    const handleSearchParams = () => {
        const isStatusFollowing = tabsPosts.status === "Following"

        if (tabsPosts.status === title) return;

        if (!isStatusFollowing) {
            tabsPosts.setStatus("Following");
            router.push("/home?filter=following");
            return;
        }

        tabsPosts.setStatus("For You");
        router.push("/home");
    }

    return (
        <div
            className="flex-1 flex justify-center cursor-pointer hover:bg-gray-300 transition"
            onClick={handleSearchParams}
        >
            <p className={cn("py-3.5", isTitleEqualToStatus ? "border-b-[3px] border-b-blue font-bold text-white" : "text-gray-200 font-normal")}>
                {title}
            </p>
        </div>
    )
}

const Topbar = ({ user }: TopbarProps) => {
    return (
        <nav className="sticky top-0 z-10 backdrop-blur bg-black/80 border-b border-gray-300">
            <div className="px-3 py-4">
                {/* Mobile */}
                <div className="max-sm:flex sm:hidden flex-row justify-start relative">
                    <div className="relative z-10">
                        <MobileSidebar user={user} />
                    </div>
                    <div className="absolute left-0 top-0 right-0 z-0 flex justify-center">
                        <Image
                            src="/assets/small-x-logo.png"
                            alt="X Logo"
                            width={30}
                            height={30}
                            className="object-contain w-[30px] h-[30px]"
                        />
                    </div>
                </div>
                <h2 className="font-bold tracking-wide text-xl max-sm:hidden sm:block">Home</h2>
                {/* Dekstop */}
            </div>

            <div className="flex justify-evenly">
                <Tabs title="For You" />
                <Tabs title="Following" />
            </div>
        </nav>
    )
}

export default Topbar