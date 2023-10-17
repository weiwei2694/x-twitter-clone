"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";

interface Props {
  currentPath: string;
  currentPage: number;
  hasNext: boolean;
}

const PaginationButtons = ({ currentPath, currentPage, hasNext }: Props) => {
  const [isMount, setIsMount] = useState(false)
  const [isPendingPrev, startTransitionPrev] = useTransition();
  const [isPendingNext, startTransitionNext] = useTransition();
  const router = useRouter();

  const nextHandler = () => {
    if (!hasNext || isPendingNext) return;
    router.push(`${currentPath}?page=${currentPage + 1}`)
  }

  const prevHandler = () => {
    if (currentPage <= 0 || isPendingPrev) return;
    router.push(`${currentPath}?page=${currentPage - 1}`)
  }

  useEffect(() => {
    setIsMount(true)
  }, [])

  if (!isMount) return null;

  return (
    <section className="flex justify-center items-center py-10 gap-x-5">
      <Button
        onClick={prevHandler}
        disabled={isPendingPrev || currentPage <= 0}
      >
        Prev
      </Button>
      <p>{isPendingNext || currentPage + 1}</p>
      <Button
        onClick={nextHandler}
        disabled={!hasNext}
      >
        Next
      </Button>
    </section>
  )
}

export default PaginationButtons