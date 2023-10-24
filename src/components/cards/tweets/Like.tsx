"use client";

import { Button } from "@/components/ui/button";
import { toggleLikeTweet } from "@/lib/tweet";
import { cn } from "@/lib/utils";
import { Like as Liked } from "@prisma/client";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";

interface Props {
	liked: Liked;
	userId: string;
	currentUserId: string;
	path: string;
	threadId: string;
	totalLikes: number;
}

const Like = ({
	liked,
	userId,
	currentUserId,
	path,
	threadId,
	totalLikes,
}: Props) => {
	const [isPending, startTransition] = useTransition();

	return (
		<Button
			variant="icon"
			size="icon"
			className={cn(
				"flex items-center gap-x-1 transition-all group",
				liked ? "text-pink-600" : "text-gray-200 hover:text-pink-600",
			)}
			onClick={(e) => {
				e.stopPropagation();
				toggleLikeTweet({
					isPending,
					startTransition,
					liked,
					userId,
					currentUserId,
					threadId,
					path,
				});
			}}
			disabled={isPending}
		>
			{liked ? (
				<div className="p-1 group-hover:bg-pink-600/20 rounded-full transition-all">
					<div className="w-6 h-6">
						<Image
							src="/assets/heart-fill-icon.svg"
							alt="Heart Fill Icon"
							width={20}
							height={20}
							className="h-6 w-6"
						/>
					</div>
				</div>
			) : (
				<span className="p-2 group-hover:bg-pink-600/20 rounded-full transition-all">
					<Heart className="w-4 h-4" />
				</span>
			)}
			<b>{totalLikes}</b>
		</Button>
	);
};

export default Like;
