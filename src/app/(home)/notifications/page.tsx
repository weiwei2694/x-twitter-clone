import { getNotifications } from "@/actions/notification.action";
import { getUserAction } from "@/actions/user.action";
import ShowNotificationsData from "@/components/notifications/ShowNotificationsData";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

const Page = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect('/');

  const notifications = await getNotifications({
    userId: user.id
  });

  return <ShowNotificationsData currentUsername={user.username} initialDataNotifications={notifications!} userId={user.id} />
}

export default Page