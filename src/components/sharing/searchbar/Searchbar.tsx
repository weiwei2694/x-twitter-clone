"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsersAction } from "@/actions/user.action";
import { User } from "@prisma/client";
import { UserWithFollowers } from "@/interfaces/user.interface";
import { useDebounce } from "@uidotdev/usehooks";
import Focused from "./Focused";

interface Props {
	currentUser: UserWithFollowers;
}

const Searchbar = ({ currentUser }: Props) => {
	const [isFocused, setIsFocused] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	async function getAllOfUsers(searchQuery: string) {
		const users = await getUsersAction({
			searchQuery,
			userId: currentUser.id,
			isOnSearch: true,
		});

		if (!users?.data.length) return;

		setUsers(users.data);
	}

	useEffect(() => {
		getAllOfUsers(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	// property input search
	const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
	};

	const onBlurSearch = () => {
		setTimeout(() => {
			setIsFocused(false);
			setUsers([]);
			setSearchTerm("");
		}, 100);
	};

	const onFocusSearch = () => {
		setIsFocused(true);
	};

	return (
		<div className="relative w-full">
			<div className="relative">
				<div className="absolute left-0 top-0 bottom-0 px-4 py-2.5">
					<Search
						size="20px"
						className={cn("", isFocused ? "text-blue" : "text-white")}
					/>
				</div>
				<Input
					type="text"
					value={searchTerm}
					onChange={onChangeSearch}
					className="no-focus !outline-none border-transparent focus:border-blue ps-12 bg-gray-400 text-white placeholder:text-white/80 rounded-full"
					placeholder="Search"
					onFocus={onFocusSearch}
					onBlur={onBlurSearch}
				/>
			</div>

			{isFocused && (
				<Focused
					users={users}
					currentUser={currentUser}
					setIsFocused={setIsFocused}
					searchTerm={searchTerm}
				/>
			)}
		</div>
	);
};

export default Searchbar;
