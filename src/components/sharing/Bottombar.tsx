"use client";

import { linksMobile } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
	username: string;
}

const Bottombar = ({ username }: Props) => {
	const pathname = usePathname();
	return (
		<div className="max-sm:flex sm:hidden fixed bottom-0 px-6 pb-10 pt-4 left-0 right-0 border-t border-t-gray-300 backdrop-blur bg-black/80">
			<ul className="flex items-center justify-between w-full">
				{linksMobile.map((link) => {
					if (!link.href) link.href = `/${username}`;

					const isSamePath = link.href === pathname;
					const isOnStatusPost =
						link.href === "/home" && pathname.includes("status");

					return (
						<li key={link.title}>
							<Link
								href={link.href}
								className="flex flex-col items-center space-y-2"
							>
								<Image
									src={
										isSamePath || isOnStatusPost ? link.activeIcon : link.icon
									}
									alt={link.title}
									width={25}
									height={25}
									className="object-contain transition-all"
								/>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Bottombar;
