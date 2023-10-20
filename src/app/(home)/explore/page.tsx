import { getUserAction, getUsersAction } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { isValidPage } from "@/lib/utils";
import Users from "@/components/cards/Users";
import PaginationButtons from "@/components/sharing/PaginationButtons";

interface Props {
	searchParams: {
		page: string;
	};
}

const Page = async ({ searchParams }: Props) => {
	const { page: qPage } = searchParams;
	const page = isValidPage(qPage);

	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await getUserAction(clerkUser.id);
	if (!user) redirect("/");

	const users = await getUsersAction({
		userId: user.id,
		size: 30,
		page,
	});

	return users?.data.length ? (
		<>
			{users.data.map((dataUser) => (
				<Users
					key={dataUser.id}
					username={dataUser.username}
					name={dataUser.name}
					imageUrl={dataUser.imageUrl}
					userId={dataUser.id}
					currentUser={user}
				/>
			))}

			<PaginationButtons
				currentPage={page}
				currentPath={"/explore"}
				hasNext={users.hasNext}
			/>
		</>
	) : (
		<div className="flex justify-center py-4 px-3">
			<div className="flex flex-col items-start">
				<p className="font-normal text-gray-200">
					Try searching for something else
				</p>
			</div>
		</div>
	);
};

export default Page;
