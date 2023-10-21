import { getNotificationsAction } from "@/actions/notification.action";
import { getUserAction } from "@/actions/user.action";
import PostNotification from "@/components/cards/notifications/PostNotification";
import UserNotification from "@/components/cards/notifications/UserNotification";
import NotFound from "@/components/sharing/NotFound";
import PaginationButtons from "@/components/sharing/PaginationButtons";
import { DataNotification } from "@/interfaces/notification.interface";
import { isValidPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Fragment } from "react";

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

	const notifications = await getNotificationsAction({
		userId: user.id,
		page,
	});

	const actionTypeField = (data: DataNotification): JSX.Element => {
		const options: any = {
			User: <UserNotification dataNotification={data} />,
			Post: (
				<PostNotification
					currentUsername={user.username}
					dataNotification={data}
				/>
			),
		};

		return options[data.parentType];
	};

	return notifications?.data.length ? (
		<>
			{notifications.data.map((notification) => (
				<Fragment key={notification.id}>
					{actionTypeField(notification)}
				</Fragment>
			))}

			<PaginationButtons
				currentPage={page}
				currentPath="/notifications"
				hasNext={notifications.hasNext}
			/>
		</>
	) : (
		<NotFound
			title="Nothing to see here — yet"
			description="All notifications will be here, starting from likes, comments, replies and others"
		/>
	);
};

export default Page;
