"use client";
import { usePrevious } from "@/hooks/usePrevious";
import { cn, getCurrentPath } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

interface TabsProps {
	username: string;
}

interface TabProps {
	title: string;
	href: string;
	path: string;
}

const Tab = ({ title, href, path }: TabProps) => {
	const isSamePath = path === href;
	const { addToNavigationHistory } = usePrevious();
	const [isPending, startTransition] = useTransition();

	return (
		<Link
			href={href}
			onClick={(e) => {
				if (isPending) return;

				e.stopPropagation();
				startTransition(() => {
					addToNavigationHistory(getCurrentPath());
				});
			}}
			className="flex-1 flex justify-center cursor-pointer hover:bg-gray-300 transition"
		>
			<p
				className={cn(
					"py-3.5",
					isSamePath
						? "border-b-[3px] border-b-blue font-bold text-white"
						: "text-gray-200 font-normal",
				)}
			>
				{title}
			</p>
		</Link>
	);
};

const Tabs = ({ username }: TabsProps) => {
	const path = usePathname();

	return (
		<section className="max-sm:mt-8 sm:mt-12 border-b border-gray-300">
			<ul className="flex items-center justify-evenly">
				<Tab title="Posts" href={`/${username}`} path={path} />
				<Tab title="Replies" href={`/${username}/with_replies`} path={path} />
				<Tab title="Likes" href={`/${username}/likes`} path={path} />
			</ul>
		</section>
	);
};

export default Tabs;
