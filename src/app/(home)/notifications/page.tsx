import { getNotificationsAction } from "@/actions/notification.action";
import { getUserAction } from "@/actions/user.action";
import PostNotification from "@/components/cards/notifications/PostNotification";
import UserNotification from "@/components/cards/notifications/UserNotification";
import PaginationButtons from "@/components/sharing/PaginationButtons";
import { DataNotification } from "@/interfaces/notification.interface";
import { isValidPage } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { Fragment } from "react";

interface Props {
  searchParams: {
    page: string;
  }
}

const Page = async ({ searchParams }: Props) => {
  const { page: qPage } = searchParams;
  const page = isValidPage(qPage);

  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect('/');

  const notifications = await getNotificationsAction({
    userId: user.id,
    page
  });

  const actionTypeField = (data: DataNotification): JSX.Element | null => {
    if (!data?.activityType) return null;

    const options: any = {
      "User": <UserNotification dataNotification={data} />,
      "Post": <PostNotification currentUsername={user.username} dataNotification={data} />,
    }

    return options[data.parentType]
  }

  return (
    notifications?.data.length ? (
      <>
        {notifications.data.map(notification => (
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
      <section className="flex justify-center mt-6">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-extrabold tracking-wide">Nothing to see here — yet</h1>
          <p className="font-normal text-gray-200">All notifications will be here, starting from likes, comments, replies and others</p>
        </div>
      </section>
    )
  )
}

export default Page