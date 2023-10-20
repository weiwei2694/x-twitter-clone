"use client";

import Searchbar from "../sharing/searchbar/Searchbar";
import { UserWithFollowers } from "@/interfaces/user.interface";

interface Props {
	user: UserWithFollowers;
}

const Topbar = ({ user }: Props) => {
	return (
		<nav className="sticky top-0 z-10 backdrop-blur bg-black/80 py-4 px-3">
			<Searchbar currentUser={user} />
		</nav>
	);
};

export default Topbar;
