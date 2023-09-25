import { toggleFollowUserAction } from "@/actions/user.action";
import { toggleFollowUserProps } from "@/interfaces/user.interface";
import { toastOptions } from "./utils";

export const toggleFollowUser = ({
  isPending,
  startTransition,
  toast,
  path,
  username,
  followed,
  userId,
  currentUserId
}: toggleFollowUserProps) => {
  if (isPending) return;

  startTransition(() => {
    if (followed) {
      toggleFollowUserAction({
        id: followed.id,
        path
      })
      toast(`You unfollowed ${username}`, toastOptions)
    } else {
      toggleFollowUserAction({ userId, currentUserId, path })
      toast(`You followed ${username}`, toastOptions)
    }
  });
}