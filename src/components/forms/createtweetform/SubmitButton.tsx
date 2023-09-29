"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  isMobile: boolean;
  title: string;
  isLoading: boolean;
}

const SubmitButton = ({ isMobile, title, isLoading }: Props) => {
  return (
    <Button
      disabled={isLoading}
      variant="primary"
      className={cn("px-6 py-1.5 w-fit", isMobile && "text-base")}
      type="submit"
    >
      {title}
    </Button>
  )
}

export default SubmitButton