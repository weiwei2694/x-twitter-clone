"use client";

import { markAsReadNotification } from "@/actions/notification.action";
import { DataNotification } from "@/interfaces/notification.interface";
import { renderText } from "@/lib/tweet";
import { cn, customDatePost, getCurrentPath } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState, useTransition } from "react";
import Unread from "./Unread";
import Menu from "./Menu";
import { usePrevious } from "@/hooks/usePrevious";
import TweetText from "@/components/sharing/TweetText";

interface Props {
	dataNotification: DataNotification;
	currentUsername: string;
}

const PostNotification = ({ dataNotification, currentUsername }: Props) => {
	const [isMounted, setIsMounted] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { addToNavigationHistory } = usePrevious();

	const router = useRouter();
	const path = usePathname();
	const menuFeed = useRef<HTMLDivElement | null>(null);

	const handleNavigation = (
		e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
	) => {
		e.stopPropagation();

		if (isPending) return;

		startTransition(() => {
			if (!dataNotification.isRead) {
				markAsReadNotification(dataNotification.id, path);
			}

			const targetPath = `/${currentUsername}/status/${dataNotification.post?.id}`;
			router.push(targetPath);
			addToNavigationHistory(getCurrentPath());
		});
	};

	const redirectToSourceId = (
		e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
	) => {
		e.stopPropagation();

		router.push(`/${dataNotification.sourceUser?.username}`);
	};

	const showActivityImage = (activityType: string) => {
		const options: any = {
			Reply: (
				<Image
					src="/assets/reply-notification-icon.svg"
					alt="Reply Icon"
					width={20}
					height={20}
				/>
			),
			Comment: (
				<Image
					src="/assets/comment-notification-icon.svg"
					alt="Comment Icon"
					width={20}
					height={20}
				/>
			),
			Like: (
				<Image
					src="/assets/heart-fill-icon.svg"
					alt="Heart Fill Icon"
					width={20}
					height={20}
				/>
			),
		};

		return options[activityType];
	};

	const showActivityText = (activityType: string) => {
		const options: any = {
			Reply: "replied your Comment",
			Comment: "commented on your Tweet",
			Like: "liked your Tweet",
		};

		return options[activityType];
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<div
			onClick={(e) => handleNavigation(e)}
			className={cn(
				"notifications__component",
				isPending && "notifications__component-disabled",
			)}
		>
			<div className="flex justify-center items-center w-[40px] h-[40px]">
				{showActivityImage(dataNotification.activityType ?? "")}
			</div>
			<div className="notifications__component-body">
				<div className="flex flex-col space-y-2 flex-1">
					<Image
						src={
							dataNotification.sourceUser?.imageUrl ??
							"/assets/small-x-logo.svg"
						}
						alt={dataNotification.sourceUser?.username ?? "Logo Twitter"}
						width={40}
						height={40}
						className="object-cover rounded-full w-[40px] h-[40px]"
					/>

					<div className="flex justify-start items-start flex-wrap gap-x-2">
						<h5
							onClick={redirectToSourceId}
							className="font-bold tracking-wide"
						>
							{dataNotification.sourceUser?.username}.
						</h5>
						<p>{showActivityText(dataNotification.activityType ?? "")}</p>∙
						<p className="font-normal text-gray-200">
							{customDatePost(dataNotification.createdAt.getTime())}
						</p>
					</div>

					<div className="flex flex-col space-y-2">
						<p className="font-normal text-gray-200">
							<TweetText content={renderText(
								dataNotification.post?.text ??
								"This post is no longer available",
							)} />
						</p>
						{dataNotification.post?.imageUrl && (
							<Image
								src={dataNotification.post?.imageUrl}
								alt={dataNotification.post?.text}
								width={300}
								height={300}
								className="object-cover w-[50px] h-[50px]"
							/>
						)}
					</div>
				</div>
				<div ref={menuFeed} className="flex justify-end items-start">
					{!dataNotification.isRead && <Unread />}
					<Menu
						isRead={dataNotification.isRead}
						notificationId={dataNotification.id}
					/>
				</div>
			</div>
		</div>
	);
};

export default PostNotification;
