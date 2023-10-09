"use client";

import { markAsReadNotification } from "@/actions/notification.action";
import { DataNotification } from "@/interfaces/notification.interface";
import { customDatePost } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent } from "react";
import Unread from "./Unread";
import Menu from "./Menu";

interface Props {
  dataNotification: DataNotification
}

const UserNotification = ({ dataNotification }: Props) => {
  const router = useRouter()
  const path = usePathname()

  const handleNavigation = async (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation()

    if (!dataNotification.isRead) await markAsReadNotification(dataNotification.id, path)
    router.push(`/${dataNotification.sourceUser?.username}/status/${dataNotification.post?.id}`)
  }

  const redirectToSourceId = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.stopPropagation();

    router.push(`/${dataNotification.sourceUser?.username}`)
  }

  return (
    <div onClick={(e) => handleNavigation(e)} className="notifications__component">
      <div className="flex justify-center items-center w-[40px] h-[40px]">
        <Image
          src="/assets/user-notification-icon.png"
          alt="Profile Icon"
          width={20}
          height={20}
          className="object-contain"
        />
      </div>
      <div className="notifications__component-body">
        <div className="flex flex-col space-y-2">
          <Image
            src={dataNotification.sourceUser?.imageUrl ?? "/assets/small-x-logo.svg"}
            alt={dataNotification.sourceUser?.username ?? "Logo Twitter"}
            width={40}
            height={40}
            className="object-cover rounded-full w-[40px] h-[40px]"
          />
          <div className="flex justify-start items-start gap-x-2">
            <h5 onClick={redirectToSourceId} className="font-bold tracking-wide">
              {dataNotification.sourceUser?.username}.
            </h5>
            <p>followed you</p>
            ∙
            <span className="font-normal text-gray-200">
              {customDatePost(dataNotification.createdAt.getTime())}
            </span>
          </div>
        </div>
        <div className="flex justify-end items-start">
          {!dataNotification.isRead && (
            <Unread />
          )}
          <Menu notificationId={dataNotification.id} isRead={dataNotification.isRead} />
        </div>
      </div>
    </div>
  )
}

export default UserNotification