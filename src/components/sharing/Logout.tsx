"use client";

import { SignOutButton } from "@clerk/nextjs";

const Logout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SignOutButton
			signOutCallback={() => {
				window.location.href = "/";
			}}
		>
			{children}
		</SignOutButton>
	);
};

export default Logout;
