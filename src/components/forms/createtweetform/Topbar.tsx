"use client";

import ButtonBack from "@/components/sharing/ButtonBack";
import SubmitButton from "./SubmitButton";

interface Props {
	isMobile: boolean;
	title: string;
	isLoading: boolean;
}

const Topbar = ({ isMobile, title, isLoading }: Props) => {
	return (
		isMobile && (
			<nav className="flex items-center justify-between">
				<ButtonBack />
				<SubmitButton
					isMobile={isMobile!}
					isLoading={isLoading}
					title={title}
				/>
			</nav>
		)
	);
};

export default Topbar;
