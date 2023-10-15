"use client";

import Searchbar from "../sharing/searchbar/Searchbar";
import { UserWithFollowers } from "@/interfaces/user.interface";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { usePrevious } from "@/hooks/usePrevious";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  user: UserWithFollowers;
}

const Topbar = ({ user }: Props) => {
  const router = useRouter();
  const { navigationHistory, goBack } = usePrevious();
  const [isPending, startTransition] = useTransition();

  const redirectToPreviousPage = () => {
    if (isPending) return;

    const len = navigationHistory.length - 1;
    router.push(navigationHistory[len] ?? "/home");
    startTransition(() => {
      goBack();
    })
  }

  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-black/80 py-4 px-3 flex justify-between items-center gap-x-3">
      <Button
        className="rounded-full hover:bg-gray-300/50 transition"
        variant="icon"
        size="icon"
        onClick={redirectToPreviousPage}
      >
        <ArrowLeft size="16" />
      </Button>
      <Searchbar currentUser={user} />
    </nav>
  )
}

export default Topbar