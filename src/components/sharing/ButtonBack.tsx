"use client"
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'

const ButtonBack = () => {
  return (
    <Button
      className="rounded-full hover:bg-gray-300/50 transition"
      variant="icon"
      size="icon"
      onClick={() => history.back()}
      type="button"
    >
      <ArrowLeft size="16" />
    </Button>
  )
}

export default ButtonBack