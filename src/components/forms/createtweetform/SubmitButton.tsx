"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
	isMobile: boolean;
	title: string;
	isLoading: boolean;
}

const SubmitButton = ({ isMobile, title, isLoading }: Props) => {
	return (
		<Button
			variant="primary"
			className={cn(
				"px-5 py-2 w-fit text-sm font-extrabold",
				isMobile && "py-1.5",
			)}
			type="submit"
			disabled={isLoading}
		>
			{title}
		</Button>
	);
};

export default SubmitButton;
