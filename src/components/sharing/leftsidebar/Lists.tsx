"use client";

import { Button } from "@/components/ui/button";
import { links } from "@/constants";
import { usePrevious } from "@/hooks/usePrevious";
import { useTweetModal } from "@/hooks/useTweetModal";
import { cn, getCurrentPath } from "@/lib/utils";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
	username: string;
	totalUnreadNotifications: number;
}

const Lists = ({ username, totalUnreadNotifications }: Props) => {
	const pathname = usePathname();
	const { addToNavigationHistory } = usePrevious();
	const openTweetModal = useTweetModal((state) => state.onOpen);

	return (
		<ul className="flex flex-col space-y-3">
			{links.map((link) => {
				if (!link.href) link.href = `/${username}`;

				const isLogo = link.title === "X Logo";
				const isSamePath = !isLogo && link.href === pathname;

				return (
					<li
						key={link.title}
						className={cn(
							"w-fit rounded-full overflow-hidden",
							isSamePath && "font-extrabold",
						)}
					>
						<Link
							href={link.href}
							onClick={() => {
								const isNotifications = link.href === "/notifications";
								const isProfile = link.href === `/${username}`;
								if (isNotifications || isProfile) {
									addToNavigationHistory(getCurrentPath());
								}
							}}
							className={cn(
								"flex flex-row items-center space-x-5 tracking-wider text-xl max-xl:p-3 hover:bg-black-200 transition",
								isLogo ? "xl:p-4" : "xl:py-3.5 xl:px-4",
							)}
						>
							<div className="relative">
								<Image
									src={isSamePath ? link.activeIcon : link.icon}
									alt={link.title}
									width={30}
									height={30}
									className={cn(
										"w-[28px] h-[28px]",
										isLogo ? "object-cover" : "object-contain",
									)}
								/>

								{link.href === "/notifications" &&
									Boolean(totalUnreadNotifications) && (
										<span className="w-[12px] h-[12px] grid place-items-center bg-blue text-white rounded-full absolute text-xs top-0 right-0" />
									)}
							</div>
							{!isLogo && (
								<span className="max-xl:hidden xl:inline">{link.title}</span>
							)}
						</Link>
					</li>
				);
			})}
			<li>
				<div className="mt-4 w-11/12">
					<Button
						variant="primary"
						className="max-xl:w-fit xl:w-full p-3"
						onClick={openTweetModal}
					>
						<span className="max-xl:hidden xl:inline">Post</span>
						<span className="max-xl:inline xl:hidden">
							<Plus size={30} />
						</span>
					</Button>
				</div>
			</li>
		</ul>
	);
};

export default Lists;
