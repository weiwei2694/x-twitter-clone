import Users from "@/components/cards/Users";
import { usePrevious } from "@/hooks/usePrevious";
import { UserWithFollowers } from "@/interfaces/user.interface";
import { cn, getCurrentPath } from "@/lib/utils";
import { User } from "@prisma/client";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
	users: User[];
	currentUser: UserWithFollowers;
	setIsFocused: Dispatch<SetStateAction<boolean>>;
	searchTerm: string;
}

const Focused = ({ users, currentUser, setIsFocused, searchTerm }: Props) => {
	const { addToNavigationHistory } = usePrevious();

	const renderSearchResults = () => {
		return (
			<ul>
				{users.map((user) => (
					<Users
						key={user.id}
						username={user.username}
						name={user.name}
						imageUrl={user.imageUrl}
						userId={user.id}
						currentUser={currentUser}
						isOnSearch={true}
						setIsFocused={setIsFocused}
					/>
				))}
			</ul>
		);
	};

	return (
		<section
			className={cn(
				"absolute max-h-[600px] overflow-y-auto top-14 left-0 right-0 bg-black-100 box-shadow rounded-xl w-full",
				!searchTerm && "pb-16",
			)}
		>
			{!searchTerm ? (
				<div className="pt-3">
					<p className="font-normal text-gray-200 text-center">
						Try searching for people
					</p>
				</div>
			) : (
				<div className="flex flex-col justify-start items-start w-full">
					{/* Search for value from searchTerm */}
					<div className="p-3 w-full my-1 hover:bg-black-200 transition-all">
						<Link
							href={{
								pathname: "/search",
								query: {
									q: searchTerm,
								},
							}}
							onClick={() => addToNavigationHistory(getCurrentPath())}
							className="font-normal hover:underline"
						>
							Search for {searchTerm}
						</Link>
					</div>
					{/* Divider */}
					<div className="w-full h-[1px] bg-gray-200" />
					{/* Go To and Render Search Results */}
					<div className="w-full">
						{renderSearchResults()}
						<div className="p-3 my-1 w-full hover:bg-black-200 transition-all">
							<Link
								href={`/${searchTerm}`}
								onClick={() => addToNavigationHistory(getCurrentPath())}
								className="font-normal hover:underline"
							>
								Go to @{searchTerm}
							</Link>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default Focused;
