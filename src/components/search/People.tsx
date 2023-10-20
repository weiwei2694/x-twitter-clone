"use client";

import { UserWithFollowers } from "@/interfaces/user.interface";
import UsersTwo from "../cards/UsersTwo";
import NotFound from "../sharing/NotFound";
import PaginationButtons from "../sharing/PaginationButtons";
import { GetUsersActionType } from "@/types/user.type";

interface Props {
	currentUser: UserWithFollowers;
	people: GetUsersActionType;
	queryQ: string;
	page: number;
}

const People = ({ currentUser, people, queryQ, page }: Props) => {
	const path = `/search?q=${queryQ}&f=people`;

	return people?.data.length ? (
		<>
			{people.data.map((user) => (
				<UsersTwo
					key={user.id}
					userId={user.id}
					username={user.username}
					name={user.name}
					imageUrl={user.imageUrl}
					bio={user.bio}
					currentUser={currentUser}
				/>
			))}

			<PaginationButtons
				currentPage={page}
				currentPath={path}
				hasNext={people.hasNext}
			/>
		</>
	) : (
		<NotFound
			title={`No results for users "${queryQ}"`}
			description="Try searching for something else"
		/>
	);
};

export default People;
