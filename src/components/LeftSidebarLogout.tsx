"use client";
import Image from 'next/image'
import { LogOut } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs";

const LeftSidebarLogout = () => {
  return (
    <SignOutButton>
      <div className="p-3 lg:py-2 lg:px-5 rounded-full hover:bg-black-200 transition flex items-center gap-x-12 cursor-pointer">
        <div className="hidden lg:flex items-center gap-x-6">
          <Image
            src="/assets/small-x-logo.png"
            alt="User Profile Example"
            width={30}
            height={30}
            className="object-contain rounded-full"
          />
          <div className="flex flex-col items-start">
            <h5 className="font-bold text-white tracking-wide">Wei Wei</h5>
            <span className="text-gray-200 font-bold">@weiwei2694</span>
          </div>
        </div>
        <LogOut size={30} />
      </div>
    </SignOutButton>
  )
}

export default LeftSidebarLogout