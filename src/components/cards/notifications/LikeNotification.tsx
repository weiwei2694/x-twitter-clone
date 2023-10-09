"use client";

import { markAsReadNotification } from "@/actions/notification.action";
import { DataNotification } from "@/interfaces/notification.interface";
import { renderText } from "@/lib/tweet";
import { customDatePost } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";

interface Props {
  dataNotification: DataNotification
}

const LikeNotification = ({ dataNotification }: Props) => {
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
          src="/assets/heart-fill-icon.png"
          alt="Heart Fill Icon"
          width={25}
          height={25}
          className="object-contain w-[25px] h-[25px]"
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
            <p>liked your Tweet</p>
            ∙
            <p className="font-normal text-gray-200">
              {customDatePost(dataNotification.createdAt.getTime())}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <p className="font-normal text-gray-200">
              {renderText(dataNotification.post?.text!)}
            </p>
            {dataNotification.post?.imageUrl && (
              <Image
                src={dataNotification.post?.imageUrl}
                alt={dataNotification.post?.text}
                width={300}
                height={300}
                className="object-cover w-[50px] h-[50px]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LikeNotification