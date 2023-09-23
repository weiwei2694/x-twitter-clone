"use client";

import { useTabsPosts } from '@/hooks/useTabsPosts'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface TabsProps {
    title: string;
    isFollowing: boolean;
}
interface TopbarProps {
    isFollowing: boolean;
}

const Tabs = ({ title, isFollowing }: TabsProps) => {
    const router = useRouter()
    const tabsPosts = useTabsPosts()

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

const Topbar = ({ isFollowing }: TopbarProps) => {
    return (
        <nav className="sticky top-0 z-10 backdrop-blur bg-black/80 border-b border-gray-300">
            <div className="px-3 py-4">
                <h2 className="font-bold tracking-wide text-xl">Home</h2>
            </div>

            <div className="flex justify-evenly">
                <Tabs title="For You" isFollowing={isFollowing} />
                <Tabs title="Following" isFollowing={isFollowing} />
            </div>
        </nav>
    )
}

export default Topbar