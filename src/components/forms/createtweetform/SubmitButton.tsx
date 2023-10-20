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
			className={cn("px-6 py-1.5 w-fit", isMobile && "text-base")}
			type="submit"
			disabled={isLoading}
		>
			{title}
		</Button>
	);
};

export default SubmitButton;
