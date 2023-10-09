import { getNotifications } from "@/actions/notification.action";
import { getUserAction } from "@/actions/user.action";
import PostNotification from "@/components/cards/notifications/PostNotification";
import UserNotification from "@/components/cards/notifications/UserNotification";
import { DataNotification } from "@/interfaces/notification.interface";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { Fragment } from "react";

const Page = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect('/');

  const notifications = await getNotifications(user.id);

  const actionTypeField = (data: DataNotification) => {
    if (!data?.activityType) return;

    const options: any = {
      "User": <UserNotification dataNotification={data} />,
      "Post": <PostNotification dataNotification={data} />,
    }

    return options[data.parentType]
  }

  return (
    <>
      <section className="flex flex-col">
        {!notifications?.length ? null : (
          notifications.map(notification => (
            <Fragment key={notification.id}>
              {actionTypeField(notification)}
            </Fragment>
          ))
        )}
      </section>
    </>
  )
}

export default Page