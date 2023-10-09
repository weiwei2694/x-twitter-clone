"use client";

import { markAsReadNotification } from "@/actions/notification.action";
import { DataNotification } from "@/interfaces/notification.interface";
import { customDatePost } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";

interface Props {
  dataNotification: DataNotification
}

const ReplyNotificaation = ({ dataNotification }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter()
  const path = usePathname()
  const childLink = useRef<HTMLAnchorElement | null>(null);

  const handleNavigation = async (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (e.target !== childLink.current) {
      if (!dataNotification.isRead) await markAsReadNotification(dataNotification.id, path)
      router.push(`/${dataNotification.sourceUser?.username}/status/${dataNotification.post?.id}`)
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  return (
    <div onClick={(e) => handleNavigation(e)} className="notifications__component">
      <div className="flex justify-center items-center w-[40px] h-[40px]">
        <Image
          src="/assets/reply-notification-icon.png"
          alt="Reply Icon"
          width={20}
          height={20}
          className="object-contain w-[20px] h-[20px]"
        />
      </div>
      <div className="w-full flex flex-row items-center justify-between gap-x-8">
        <div className="flex flex-col space-y-2 flex-1">
          <Image
            src={dataNotification.sourceUser?.imageUrl ?? "/assets/small-x-logo.svg"}
            alt={dataNotification.sourceUser?.username ?? "Logo Twitter"}
            width={40}
            height={40}
            className="object-cover rounded-full w-[40px] h-[40px]"
          />

          <div className="flex justify-start items-start flex-wrap gap-x-2">
            <Link ref={childLink} href={`/${dataNotification.sourceUser?.username}`} className="font-bold tracking-wide">
              {dataNotification.sourceUser?.username}.
            </Link>
            <p>replied your Comment</p>
            ∙
            <p className="font-normal text-gray-200">
              {customDatePost(dataNotification.createdAt.getTime())}
            </p>
          </div>
        </div>
        {dataNotification.post?.imageUrl && (
          <div className="">
            <Image
              src={dataNotification.post?.imageUrl}
              alt={dataNotification.post?.text}
              width={300}
              height={300}
              className="object-cover w-[60px] h-[60px]"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReplyNotificaation