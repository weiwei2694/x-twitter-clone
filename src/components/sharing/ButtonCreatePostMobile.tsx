"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useReplyTweet } from "@/hooks/useReplyTweet";
import { DataTweet } from "@/interfaces/tweet.interface";
import { usePrevious } from "@/hooks/usePrevious";
import { getCurrentPath } from "@/lib/utils";
import { useTransition } from "react";

interface Props {
	isMobile?: boolean;
	dataTweet?: DataTweet;
}

const ButtonCreatePostMobile = ({ isMobile, dataTweet }: Props) => {
	const router = useRouter();
	const setDataTweet = useReplyTweet((state) => state.setDataTweet);
	const { addToNavigationHistory } = usePrevious();
	const [isPending, startTransition] = useTransition();

	const replyTweet = () => {
		startTransition(() => {
			if (isMobile && dataTweet) setDataTweet(dataTweet);

			addToNavigationHistory(getCurrentPath());
			router.push("/compose/tweet");
		});
	};

	return (
		<div className="fixed bottom-28 right-6 sm:hidden">
			<Button
				disabled={isPending}
				variant="primary"
				className="rounded-full p-2"
				onClick={replyTweet}
			>
				<Image
					src="/assets/create-tweet.svg"
					alt="Tweet Icon"
					width={40}
					height={40}
					className="object-contain"
				/>
			</Button>
		</div>
	);
};

export default ButtonCreatePostMobile;
