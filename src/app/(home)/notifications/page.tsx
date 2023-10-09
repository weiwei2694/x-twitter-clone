import { getNotifications } from "@/actions/notification.action";
import { getUserAction } from "@/actions/user.action";
import CommentNotification from "@/components/cards/notifications/CommentNotification";
import FollowNotification from "@/components/cards/notifications/FollowNotification";
import LikeNotification from "@/components/cards/notifications/LikeNotification";
import ReplyNotification from "@/components/cards/notifications/ReplyNotification";
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
      "Follow": <FollowNotification dataNotification={data} />,
      "Like": <LikeNotification dataNotification={data} />,
      "Comment": <CommentNotification dataNotification={data} />,
      "Reply": <ReplyNotification dataNotification={data} />,
    }

    return options[data.activityType]
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