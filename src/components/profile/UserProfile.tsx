"use client";

import { UserWithFollowers } from "@/interfaces/user.interface";
import Image from "next/image";
import React, { useTransition, useState } from "react";
import { Button } from "../ui/button";
import { copyLinkUser, toggleFollowUser } from "@/lib/user";
import { usePathname } from "next/navigation";
import { cn, convertToHttps, months } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	CalendarDays,
	LinkIcon,
	MapPin,
	MoreHorizontal,
	Router,
} from "lucide-react";
import toast from "react-hot-toast";
import { renderText } from "@/lib/tweet";
import EditProfileModal from "../modals/EditProfileModal";
import Link from "next/link";

interface Props {
	isMyProfile: boolean;
	user: UserWithFollowers;
	currentUser: {
		id: string;
		username: string;
	};
}

const UserProfile = ({ user, isMyProfile, currentUser }: Props) => {
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);
	const path = usePathname();

	const followed = user.followers.find(({ followingId, followerId }) => {
		return followingId === currentUser.id && followerId === user.id;
	});

	const isFollowed = () => {
		if (isPending) return "...";
		if (followed) return "Unfollow";
		return "Follow";
	};

	// Components
	const displayBanner = () => {
		if (!user.bannerUrl) {
			return (
				<div className="w-full max-sm:h-[135px] sm:h-[230px] bg-gray-300" />
			);
		}

		return (
			<Image
				src={user.bannerUrl}
				alt={user.username}
				width={600}
				height={230}
				className="object-cover w-full h-[230px]"
			/>
		);
	};

	const displayInformation = () => {
		const month = new Date(user.createdAt).getMonth();
		const year = new Date(user.createdAt).getFullYear();

		const linkWebsite = convertToHttps(user.website!);

		return (
			<div className="flex gap-x-3 flex-wrap">
				{user.location && (
					<p className="font-normal text-gray-200 flex items-center gap-x-1">
						<MapPin size="18" />
						{user.location}
					</p>
				)}
				{linkWebsite && (
					<Link
						href={linkWebsite.href}
						target="_blank"
						className="font-normal text-blue hover:text-blue/90 flex items-center gap-x-1"
					>
						<LinkIcon size="18" className="text-gray-200" />
						<span className="max-w-[231px] text-ellipsis overflow-hidden whitespace-nowrap">
							{linkWebsite.title}
						</span>
					</Link>
				)}
				<p className="font-normal text-gray-200 flex items-center gap-x-1">
					<CalendarDays size="18" />
					Joined {months[month]} {year}
				</p>
			</div>
		);
	};

	const displayHandler = () => {
		if (!isMyProfile) {
			return (
				<div className="flex items-center gap-x-4">
					<DropdownMenu>
						<DropdownMenuTrigger className="!outline-none p-1.5 border border-gray-200 rounded-full text-white hover:bg-gray-300/30">
							<MoreHorizontal size="20" />
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="end">
							<DropdownMenuItem
								onClick={() =>
									copyLinkUser({
										toast,
										username: user.username,
									})
								}
							>
								<LinkIcon size="20" />
								Copy link to profile
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						disabled={isPending}
						onClick={() =>
							toggleFollowUser({
								isPending,
								startTransition,
								toast,
								path,
								username: user.username,
								followed,
								userId: user.id,
								currentUserId: currentUser.id,
							})
						}
						className={cn(
							"py-2 px-4 font-bold tracking-wide rounded-full text-sm",
							!followed
								? "bg-white hover:bg-white/90 text-black-100"
								: "border border-gray-200 bg-transparent hover:border-red-500 hover:text-red-500 hover:bg-transparent",
						)}
					>
						{isFollowed()}
					</Button>
				</div>
			);
		}

		return (
			<div className="flex items-center gap-x-4">
				{/* Dekstop */}
				<Button
					variant="primary"
					className="py-2 px-4 font-bold tracking-wide rounded-full bg-transparent hover:bg-gray-300/30 border border-gray-200 text-sm max-md:hidden md:block"
					onClick={() => setIsOpen(true)}
				>
					Edit Profile
				</Button>
				{/* Mobile */}
				<Link
					className="py-2 px-4 font-bold tracking-wide rounded-full bg-transparent hover:bg-gray-300/30 border border-gray-200 text-sm max-md:block md:hidden"
					href="/settings/profile"
				>
					Edit Profile
				</Link>
			</div>
		);
	};

	const displayFollowersAndFollowings = () => {
		const totalFollowers = user.followers.length;
		const totalFollowings = user.followings.length;

		return (
			<div className="flex items-center gap-x-5">
				<p className="font-normal flex gap-x-2">
					{totalFollowers} <span className="text-gray-200">Followers</span>
				</p>
				<p className="font-normal flex gap-x-2">
					{totalFollowings} <span className="text-gray-200">Followings</span>
				</p>
			</div>
		);
	};

	return (
		<>
			{/* BannerUrl */}
			<section>{displayBanner()}</section>
			{/* ImageUrl, Username, Name, Since Join, Bio, Following, Follower, Edit Profile  */}
			<section className="px-3 flex flex-col max-sm:-space-y-8 sm:-space-y-12">
				{/* Head -> Profile & Handler */}
				<div className="flex justify-between">
					{/* image URL */}
					<Image
						src={user.imageUrl}
						alt={user.name}
						width={133}
						height={133}
						className="object-cover rounded-full max-sm:border-2 sm:border-4 border-black -translate-y-[50%] bg-gray-300 select-none max-sm:w-[90px] max-sm:h-[90px] sm:h-[133px] sm:w-[133px]"
					/>

					{/* handler -> Edit Button | Follow or Unfollow, Menu ( Copy Link To Profile ) */}
					<div className="mt-4 h-fit">{displayHandler()}</div>
				</div>
				{/* Body -> Username, Name, Followers, Followings */}
				<div className="flex flex-col space-y-4">
					{/* Username, Name */}
					<div className="flex flex-col">
						<h2 className="font-bold tracking-wide text-xl">{user.name}</h2>
						<p className="text-sm font-normal text-gray-200">
							@{user.username}
						</p>
					</div>
					{/* Bio, Followers, Followings */}
					<div className="flex flex-col space-y-2">
						<p className="whitespace-break-spaces text-gray-100">
							{renderText(user.bio || "")}
						</p>
						{/* Join Date, Location, Website */}
						{displayInformation()}
						{/* Followers, Followings */}
						{displayFollowersAndFollowings()}
					</div>
				</div>
			</section>

			{/* Edit Profile Modal */}
			<EditProfileModal isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
		</>
	);
};

export default UserProfile;
