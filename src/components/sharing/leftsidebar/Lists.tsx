"use client"

import { Button } from '@/components/ui/button';
import { links } from '@/constants';
import { usePrevious } from '@/hooks/usePrevious';
import { useTweetModal } from '@/hooks/useTweetModal';
import { cn, getCurrentPath } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  username: string;
  totalNotifications: number;
}

const Lists = ({ username, totalNotifications }: Props) => {
  const pathname = usePathname()
  const { addToNavigationHistory } = usePrevious();
  const openTweetModal = useTweetModal(state => state.onOpen)

  return (
    <ul className="flex flex-col space-y-6">
      {links.map(link => {
        if (!link.href) link.href = `/${username}`

        const isLogo = link.title === "X Logo";
        const isSamePath = !isLogo && (link.href === pathname);

        return (
          <li
            key={link.title}
            className={cn("w-fit rounded-full overflow-hidden", isSamePath && "font-bold")}
          >
            <Link
              href={link.href}
              onClick={() => {
                const isNotifications = link.href === "/notifications"
                const isProfile = link.href === `/${username}`
                if (isNotifications || isProfile) {
                  addToNavigationHistory(getCurrentPath())
                };
              }}
              className="flex flex-row items-center gap-x-6 tracking-wider text-xl max-xl:p-3 xl:py-3 xl:px-5 hover:bg-black-200 transition">
              <div className="relative">
                <Image
                  src={isSamePath ? link.activeIcon : link.icon}
                  alt={link.title}
                  width={30}
                  height={30}
                  className="object-contain w-[30px] h-[30px]"
                />

                {link.href === '/notifications' && Boolean(totalNotifications) && (
                  <span className="w-[20px] h-[20px] grid place-items-center bg-blue text-white rounded-full absolute text-xs -top-1 -right-1">
                    {totalNotifications}
                  </span>
                )}
              </div>
              {!isLogo && (
                <span className="max-xl:hidden xl:inline">
                  {link.title}
                </span>
              )}
            </Link>
          </li>
        )
      })}
      <Button
        variant="primary"
        className="max-xl:w-fit xl:w-full p-3"
        onClick={openTweetModal}
      >
        <span className="max-xl:hidden xl:inline">
          Post
        </span>
        <span className="max-xl:inline xl:hidden">
          <Plus size={30} />
        </span>
      </Button>
    </ul>
  )
}

export default Lists