"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { usePrevious } from "@/hooks/usePrevious";
import { useTransition } from "react";

const ButtonBack = () => {
	const router = useRouter();
	const { navigationHistory, goBack } = usePrevious();
	const [isPending, startTransition] = useTransition();

	const redirectToPreviousPage = () => {
		if (isPending) return;

		const len = navigationHistory.length - 1;
		router.push(navigationHistory[len] ?? "/home");

		startTransition(() => {
			goBack();
		});
	};

	return (
		<Button
			className="button__icon-hover"
			variant="icon"
			size="icon"
			onClick={redirectToPreviousPage}
			type="button"
		>
			<ArrowLeft size="16" />
		</Button>
	);
};

export default ButtonBack;
