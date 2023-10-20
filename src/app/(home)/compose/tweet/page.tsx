import { getUserAction } from "@/actions/user.action";
import ShowCreateTweetForm from "@/components/compose/tweet/ShowCreateTweetForm";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const user = await getUserAction(clerkUser.id);
	if (!user) redirect("/");

	return <ShowCreateTweetForm userId={user.id} imageUrl={user.imageUrl} />;
};

export default Page;
