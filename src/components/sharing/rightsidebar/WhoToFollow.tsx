import Users from "@/components/cards/Users";
import { UserWithFollowers } from "@/interfaces/user.interface";
import { User } from "@prisma/client";

interface Props {
	users: User[] | null;
	currentUser: UserWithFollowers;
}

const WhoToFollow = ({ users, currentUser }: Props) => {
	const showUsersList = () => {
		if (!users?.length) {
			return (
				<p className="text-gray-200 font-normal">
					there are no users to follow
				</p>
			);
		}

		return users.map((user) => (
			<Users
				key={user.id}
				username={user.username}
				name={user.name}
				imageUrl={user.imageUrl}
				userId={user.id}
				currentUser={currentUser}
				isOnSearch={false}
			/>
		));
	};

	return (
		<section className="p-3 bg-gray-400 rounded-xl flex flex-col space-y-6">
			<h3 className="text-xl text-gray-100 font-bold tracking-wide">
				Who To Follow
			</h3>
			<ul>{showUsersList()}</ul>
		</section>
	);
};

export default WhoToFollow;
