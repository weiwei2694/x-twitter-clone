import { getUserAction } from "@/actions/user.action";
import EditProfileForm from "@/components/forms/EditProfileForm";
import { currentUser } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Edit profile / X",
};

const Page = async () => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await getUserAction(clerkUser.id);
	if (!user) redirect("/");

	return <EditProfileForm user={user} />;
};

export default Page;
