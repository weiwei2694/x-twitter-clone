"use client"

import { Button } from '@/components/ui/button';
import { links } from '@/constants';
import { useTweetModal } from '@/hooks/useTweetModal';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  username: string;
}

const Lists = ({ username }: Props) => {
  const pathname = usePathname()
  const openTweetModal = useTweetModal(state => state.onOpen)

  return (
    <ul className="flex flex-col space-y-6">
      {links.map(link => {
        if (!link.href) link.href = `/${username}`

        const isNotLogo = link.title !== "X Logo";
        const isSamePath = isNotLogo && link.href === pathname;

        return (
          <li
            key={link.title}
            className={cn("w-fit rounded-full overflow-hidden", isSamePath && "bg-black-200 font-bold")}
          >
            <Link
              href={link.href}
              className="flex flex-row items-center gap-x-6 tracking-wider text-xl max-xl:p-3 xl:py-3 xl:px-5 hover:bg-black-200 transition">
              <Image
                src={link.icon}
                alt={link.title}
                width={30}
                height={30}
                className="object-contain w-[30px] h-[30px]"
              />
              {isNotLogo && (
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