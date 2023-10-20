"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "../ui/button";

interface Props {
	title: string;
	description: string;
	ButtonAction: ReactNode;
	isDialogOpen: boolean;
	setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteModal = ({
	title,
	description,
	ButtonAction,
	isDialogOpen,
	setIsDialogOpen,
}: Props) => {
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="!w-[320px] !outline-none !border-none bg-black-100 select-none p-8 rounded-xl">
				<section className="flex flex-col space-y-7">
					{" "}
					{/* Body */}
					<DialogHeader className="flex flex-col space-y-2">
						<DialogTitle className="font-extrabold tracking-wide text-xl">
							{title}
						</DialogTitle>
						<DialogDescription className="font-normal text-gray-200 leading-5">
							{description}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="w-full">
						<div className="flex flex-col space-y-3 w-full">
							{ButtonAction}
							<Button
								variant="ghost"
								className="bg-transparent hover:bg-gray-300/30 hover:text-white border border-gray-200 rounded-full font-extrabold text-sm"
								onClick={(e) => {
									e.stopPropagation();
									setIsDialogOpen(false);
								}}
							>
								Cancel
							</Button>
						</div>
					</DialogFooter>
				</section>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteModal;
