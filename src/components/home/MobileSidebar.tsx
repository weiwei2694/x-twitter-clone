"use client";

import Image from "next/image";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { UserWithFollowers } from "@/interfaces/user.interface";
import { mobileSidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

interface Props {
	user: UserWithFollowers;
}

const MobileSidebar = ({ user }: Props) => {
	const pathname = usePathname();

	// components
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

	const Header = () => {
		return (
			<SheetHeader className="p-3 text-start">
				<Image
					src={user.imageUrl}
					alt="User Profile"
					width={40}
					height={40}
					className="object-cover rounded-full w-[40px] h-[40px]"
				/>

				<div className="flex flex-col">
					<h2 className="font-bold tracking-wide text-xl">{user.name}</h2>
					<p className="text-sm font-normal text-gray-200">@{user.username}</p>
				</div>

				{displayFollowersAndFollowings()}
			</SheetHeader>
		);
	};

	const Content = () => {
		return (
			<section className="w-full">
				<ul className="flex flex-col w-full">
					{mobileSidebarLinks.map((link) => {
						if (!link.href) link.href = `/${user.username}`;
						const isSamePath = link.href === pathname;

						return (
							<li key={link.title} className="w-full">
								<Link
									href={link.href}
									className="flex w-full flex-row items-center gap-x-6 tracking-wider text-xl font-bold p-3 hover:bg-black-200 transition-all"
								>
									<Image
										src={isSamePath ? link.activeIcon : link.icon}
										alt={link.title}
										width={23}
										height={23}
										className="object-contain w-[23px] h-[23px]"
									/>
									{link.title}
								</Link>
							</li>
						);
					})}
				</ul>
			</section>
		);
	};

	const Footer = () => {
		return (
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1" className="border-none">
					<AccordionTrigger className="border-none hover:no-underline hover:bg-black-200 px-3 font-bold tracking-wide">
						Settings And Supports
					</AccordionTrigger>
					<AccordionContent>
						<SignOutButton
							signOutCallback={() => {
								window.location.href = "/";
							}}
						>
							<p className="flex items-center gap-x-3 text-base p-3 hover:bg-black-200">
								<LogOut className="w-5 h-5" />
								Log out
							</p>
						</SignOutButton>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		);
	};

	return (
		<Sheet>
			<SheetTrigger className="rounded-full hover:bg-gray-300/50 transition !outline-none">
				<Image
					src={user.imageUrl}
					alt="User Profile"
					width={35}
					height={35}
					className="object-cover rounded-full w-[35px] h-[35px]"
				/>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="p-0 flex flex-col justify-start items-start space-y-0 overflow-y-scroll"
			>
				<Header />
				<Content />
				<Footer />
			</SheetContent>
		</Sheet>
	);
};

export default MobileSidebar;
