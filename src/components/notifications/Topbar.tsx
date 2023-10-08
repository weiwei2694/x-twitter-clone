"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const Topbar = () => {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-black/80">
      <div className="px-3 py-4">
        <div className="flex flex-row items-center gap-x-2">
          <Button
            className="rounded-full hover:bg-gray-300/50 transition"
            variant="icon"
            size="icon"
            onClick={() => history.back()}
          >
            <ArrowLeft size="16" />
          </Button>
          <h2 className="font-bold tracking-wide text-xl">
            Notifications
          </h2>
        </div>
      </div>
    </nav>
  )
}

export default Topbar