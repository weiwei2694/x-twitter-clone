"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";

interface Props {
	currentPath: string;
	currentPage: number;
	hasNext: boolean;
}

const PaginationButtons = ({ currentPath, currentPage, hasNext }: Props) => {
	const [isMount, setIsMount] = useState(false);
	const [isPendingPrev, startTransitionPrev] = useTransition();
	const [isPendingNext, startTransitionNext] = useTransition();
	const router = useRouter();

	const nextHandler = () => {
		if (!hasNext || isPendingNext) return;
		const nextPage = currentPage + 1;
		const nextUrl = `${currentPath}${
			currentPath.includes("?") ? "&" : "?"
		}page=${nextPage}`;

		startTransitionNext(() => {
			router.push(nextUrl);
		});
	};

	const prevHandler = () => {
		if (currentPage <= 0 || isPendingPrev) return;
		const prevPage = currentPage - 1;
		const prevUrl = `${currentPath}${
			currentPath.includes("?") ? "&" : "?"
		}page=${prevPage}`;

		startTransitionPrev(() => {
			router.push(prevUrl);
		});
	};

	useEffect(() => {
		setIsMount(true);
	}, []);

	if (!isMount) return null;

	return (
		<section className="flex justify-center items-center py-10 gap-x-5">
			<Button
				onClick={prevHandler}
				disabled={isPendingPrev || currentPage <= 0}
			>
				Prev
			</Button>
			<p>{currentPage + 1}</p>
			<Button onClick={nextHandler} disabled={isPendingNext || !hasNext}>
				Next
			</Button>
		</section>
	);
};

export default PaginationButtons;
