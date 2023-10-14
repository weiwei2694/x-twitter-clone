"use client"

import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { usePrevious } from '@/hooks/usePrevious'

const ButtonBack = () => {
  const router = useRouter()
  const { navigationHistory, goBack } = usePrevious()

  const redirectToPreviousPage = () => {
    const len = navigationHistory.length - 1;
    router.push(navigationHistory[len]);
    goBack();
  }

  return (
    <Button
      className="rounded-full hover:bg-gray-300/50 transition"
      variant="icon"
      size="icon"
      onClick={redirectToPreviousPage}
      type="button"
    >
      <ArrowLeft size="16" />
    </Button>
  )
}

export default ButtonBack