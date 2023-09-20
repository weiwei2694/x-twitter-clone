"use client"
import { links } from '@/constants'
import { Button } from './ui/button';
import { LogOut, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { SignOutButton, SignedIn } from '@clerk/nextjs';

interface LeftSidebarProps {
    username: string;
    name: string;
    imageUrl: string;
}

const LeftSidebar = ({ username, name, imageUrl }: LeftSidebarProps) => {
    const pathname = usePathname();
    return (
        <aside className="w-fit h-screen p-3 border-r border-r-gray-300 hidden sm:flex flex-col justify-between">
            <ul className="flex flex-col space-y-6">
                {links.map(link => {
                    if (!link.href) link.href = `/${username}`

                    const isNotLogo = link.title !== "X Logo";
                    const isSamePath = isNotLogo && link.href === pathname;

                    return (
                        <li
                            key={link.title}
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
                })}
                <Button variant="primary" className="w-fit lg:w-full p-3">
                    <span className="hidden lg:inline">
                        Tweet
                    </span>
                    <span className="lg:hidden">
                        <Plus size={30} />
                    </span>
                </Button>
            </ul>
            <SignedIn>
                <SignOutButton>
                    <div className="p-3 lg:py-2 lg:px-5 rounded-full hover:bg-black-200 transition flex items-center gap-x-12 cursor-pointer">
                        <div className="hidden lg:flex items-center gap-x-6">
                            <Image
                                src={imageUrl}
                                alt={name}
                                width={50}
                                height={50}
                                priority
                                className="object-contain rounded-full"
                            />
                            <div className="flex flex-col items-start">
                                <h5 className="font-bold text-white tracking-wide">{name}</h5>
                                <span className="text-gray-200 font-bold">@{username}</span>
                            </div>
                        </div>
                        <LogOut size={30} />
                    </div>
                </SignOutButton>
            </SignedIn>
        </aside>
    )
}

export default LeftSidebar