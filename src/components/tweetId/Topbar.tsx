"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { usePrevious } from "@/hooks/usePrevious";
import { useTransition } from "react";

const Topbar = () => {
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
  };
  
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
          <h2 className="font-bold tracking-wide text-xl">
            Post
          </h2>
        </div>
      </div>
    </nav>
  )
}

export default Topbar