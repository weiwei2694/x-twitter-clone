"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { usePrevious } from "@/hooks/usePrevious";

interface Props {
  name: string;
  username: string;
  totalTweets: number;
  totalReplies: number;
  totalLikes: number;
}

const Topbar = ({ name, username, totalTweets, totalReplies, totalLikes }: Props) => {
  const { navigationHistory, goBack } = usePrevious()
  const [isPending, startTransition] = useTransition();
  
  const path = usePathname()
  const router = useRouter()

  const redirectToPreviousPage = () => {
    if (isPending) return;
    const len = navigationHistory.length - 1;
    router.push(navigationHistory[len] ?? "/home");

    startTransition(() => {
      goBack()
    })
  }

  const showTotals = (currentPath: string): string | null => {
    const variants = {
      [`/${username}`]: `${totalTweets} posts`,
      [`/${username}/with_replies`]: `${totalReplies} replies`,
      [`/${username}/likes`]: `${totalLikes} likes`
    }

    return variants[currentPath];
  }

  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-black/80">
      <div className="px-3 py-4">
        <div className="flex flex-row items-center gap-x-2">
          <Button
            className="rounded-full hover:bg-gray-300/50 transition"
            variant="icon"
            size="icon"
            onClick={redirectToPreviousPage}
          >
            <ArrowLeft size="16" />
          </Button>
          <div className="flex flex-col item-start justify-start">
            <h2 className="font-bold tracking-wide text-xl">
              {name}
            </h2>
            <p className="text-sm font-normal text-gray-200">{showTotals(path)}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Topbar