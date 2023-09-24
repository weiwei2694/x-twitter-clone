import { toggleFollowUserAction } from "@/actions/user.action";
import { toggleFollowUserProps } from "@/interfaces/user.interface";

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

      toast({
        title: `You unfollowed ${username}`,
        duration: 2000,
        variant: "primary"
      })
    } else {
      toggleFollowUserAction({ userId, currentUserId, path })

      toast({
        title: `You followed ${username}`,
        duration: 2000,
        variant: "primary"
      })
    }
  });
}