"use client";

import { usePathname } from "next/navigation";
import ButtonBack from "../sharing/ButtonBack";

interface Props {
	name: string;
	username: string;
	totalTweets: number;
	totalReplies: number;
	totalLikes: number;
}

const Topbar = ({
	name,
	username,
	totalTweets,
	totalReplies,
	totalLikes,
}: Props) => {
	const path = usePathname();

	const showTotals = (currentPath: string): string | null => {
		const variants = {
			[`/${username}`]: `${totalTweets} posts`,
			[`/${username}/with_replies`]: `${totalReplies} replies`,
			[`/${username}/likes`]: `${totalLikes} likes`,
		};

		return variants[currentPath];
	};

	return (
		<nav className="sticky top-0 z-10 backdrop-blur bg-black/80">
			<div className="px-3 py-4">
				<div className="flex flex-row items-center gap-x-2">
					<ButtonBack />
					<div className="flex flex-col item-start justify-start">
						<h2 className="font-bold tracking-wide text-xl">{name}</h2>
						<p className="text-sm font-normal text-gray-200">
							{showTotals(path)}
						</p>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Topbar;
