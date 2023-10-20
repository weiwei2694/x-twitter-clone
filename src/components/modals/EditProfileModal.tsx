"use client";

import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import EditProfileForm from "../forms/EditProfileForm";
import { User } from "@prisma/client";

interface Props {
	isOpen?: boolean;
	setIsOpen?: Dispatch<SetStateAction<boolean>>;
	user: User;
}

const EditProfileModal = ({ isOpen, setIsOpen, user }: Props) => {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="!outline-none !border-none bg-black-100 w-full select-none p-0">
				<EditProfileForm user={user} setIsOpen={setIsOpen} isModal />
			</DialogContent>
		</Dialog>
	);
};

export default EditProfileModal;
