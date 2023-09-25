import { getUserAction } from "@/actions/user.action";
import Logout from "@/components/Logout";
import OnBoarding from "@/components/OnBoarding"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import Image from "next/image"

const Page = async () => {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const mapUser = {
        id: clerkUser.id,
        imageUrl: clerkUser.imageUrl,
        name: "",
        username: clerkUser.username!.toLowerCase(),
        email: clerkUser.emailAddresses[0].emailAddress,
        bio: ""
    }

    const user = await getUserAction(clerkUser.id);
    if (user && "isCompleted" in user) {
        const isCompleted = user.isCompleted;

        if (isCompleted) redirect('/home');
    }

    return (
        <section className="w-full h-full flex lg:flex-row max-lg:flex-col">
            <div className="max-lg:flex lg:hidden py-7 max-lg:px-10 border-b border-b-gray-300 items-center justify-between">
                <Image
                    src="/assets/small-x-logo.png"
                    alt="X Logo"
                    width={20}
                    height={20}
                    className="object-contain"
                />
                <Logout>Sign Out</Logout>
            </div>
            <div className="max-lg:hidden lg:flex flex-col justify-evenly items-center min-w-fit p-20 border-r border-r-gray-300">
                <Image
                    src="/assets/large-x-logo.png"
                    alt="X Logo"
                    width={215}
                    height={215}
                    className="object-contain"
                />
                <Logout>Sign Out</Logout>
            </div>
            <div className="max-lg:p-10 p-20 w-full flex flex-col justify-center">
                <h1 className="text-6xl font-extrabold tracking-wider">Let's complete your profile</h1>
                <div className="max-xl:w-full w-[600px] mt-10 p-5 rounded-xl bg-zinc-900">
                    <OnBoarding initialValue={mapUser} />
                </div>
            </div>
        </section>
    )
}

export default Page