import React from "react";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { SignOutButton } from "@clerk/nextjs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface Props {
	imageUrl: string;
	username: string;
	name: string;
}

const Logout = ({ imageUrl, username, name }: Props) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="max-xl:p-3 xl:py-2 xl:px-5 rounded-full hover:bg-black-200 transition flex items-center gap-x-20 cursor-pointer !outline-none !w-full">
				<div className="max-xl:hidden xl:flex items-center gap-x-2">
					<Image
						src={imageUrl}
						alt={name}
						width={50}
						height={50}
						priority
						className="object-cover rounded-full w-[50px] h-[50px]"
					/>
					<div className="flex flex-col items-start text-start">
						<h5 className="font-bold text-white tracking-wide whitespace-nowrap w-full max-w-[100px] overflow-hidden text-ellipsis">
							{name}
						</h5>
						<p className="text-gray-200 font-bold whitespace-nowrap w-full max-w-[100px] overflow-hidden text-ellipsis">
							@{username}
						</p>
					</div>
				</div>
				<MoreHorizontal className="w-6 h-6 text-white" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<SignOutButton
						signOutCallback={() => {
							window.location.href = "/";
						}}
					>
						<p>Log out @{username}</p>
					</SignOutButton>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Logout;
