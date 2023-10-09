"use client";

import { markAsReadNotification } from "@/actions/notification.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookX, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MouseEvent, useTransition } from "react";

interface Props {
  notificationId: string;
  isRead: boolean;
}

const Menu = ({ notificationId, isRead }: Props) => {
  const path = usePathname()
  const [isPending, startTransition] = useTransition()

  const markAsReadHandler = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();

    if (isPending) return;

    startTransition(() => {
      markAsReadNotification(notificationId, path)
    })
  }

  const deleteNotification = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="!outline-none text-white bg-transparent hover:bg-blue/20 hover:text-blue transition p-2 rounded-full"
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        {!isRead && (
          <DropdownMenuItem
            onClick={markAsReadHandler}
            className="text-[#f4212e]"
            disabled={isPending}
          >
            <div className="w-7 flex items-center justify-center">
              <BookX className="object-contain w-4 h-4" />
            </div>
            Mark as read
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={deleteNotification}
          className="text-[#f4212e]"
        >
          <div className="w-7 flex items-center justify-center">
            <Image
              src="/assets/delete.png"
              alt="Delete"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          Delete Notification
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Menu