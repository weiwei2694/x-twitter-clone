"use client";

import { cn } from '@/lib/utils'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Link {
    icon: string;
    title: string;
    href: string;
}

interface LeftSidebarListsProps {
    link: Link
}

const LeftSidebarLists = ({ link }: LeftSidebarListsProps) => {
    const pathname = usePathname();

    const isNotLogo = link.title !== "X Logo";
    const isSamePath = isNotLogo && link.href === pathname;

    return (
        <li
            className={cn("w-fit p-3 lg:py-3 lg:px-5 rounded-full hover:bg-black-200 transition", isSamePath && "bg-black-200 font-bold")}
        >
            <Link href={link.href} className="flex flex-row items-center gap-x-6 tracking-wider text-xl">
                <Image src={link.icon} alt={link.title} width={30} height={30} className="object-contain w-[30px] h-[30px]" />
                {isNotLogo && (
                    <span className="hidden lg:inline">
                        {link.title}
                    </span>
                )}
            </Link>
        </li>
    )
}

export default LeftSidebarLists