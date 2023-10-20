"use client";

import { DataTweet } from "@/interfaces/tweet.interface";
import { renderText } from "@/lib/tweet";
import { customDatePost } from "@/lib/utils";
import Image from "next/image";

interface Props {
	isReply: boolean;
	dataTweet: DataTweet | null;
}

const Reply = ({ isReply, dataTweet }: Props) => {
	if (!isReply || !dataTweet) return null;

	const formattedCreatedAt = customDatePost(dataTweet.createdAt.getTime());

	return (
		<section className="flex justify-start items-start gap-x-5 h-full">
			<div className="flex flex-col items-center justify-start gap-y-2 h-full">
				<div className="relative">
					<Image
						src={dataTweet.user.imageUrl}
						alt={dataTweet.user.name}
						width={35}
						height={35}
						className="object-cover w-[35px] h-[35px] rounded-full"
					/>
				</div>

				<div className="h-full w-[2px] bg-gray-300 rounded-full" />
			</div>
			<div className="flex-1 flex flex-col gap-y-5">
				<div className="flex-1 flex items-center flex-wrap gap-x-2">
					<h5 className="text-ellipsis overflow-hidden whitespace-nowrap font-bold text-white w-fit max-w-[150px]">
						{dataTweet.user.name}
					</h5>
					<p className="text-ellipsis whitespace-nowrap font-normal text-gray-200">
						@{dataTweet.user.username} · {formattedCreatedAt}
					</p>
				</div>
				<p className="whitespace-break-spaces">{renderText(dataTweet.text)}</p>
				<p className="text-gray-200">
					Replying to{" "}
					<span
						className="text-blue"
						onClick={() =>
							(window.location.href = `/${dataTweet.user.username}`)
						}
					>
						@{dataTweet.user.username}
					</span>
				</p>
			</div>
		</section>
	);
};

export default Reply;
