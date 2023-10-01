import { getUserAction } from "@/actions/user.action";
import EditProfileForm from "@/components/forms/EditProfileForm";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

const Page = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser) return null;

  const user = await getUserAction(clerkUser.id)
  if (!user) redirect('/')
  
  return <EditProfileForm user={user} />
}

export default Page