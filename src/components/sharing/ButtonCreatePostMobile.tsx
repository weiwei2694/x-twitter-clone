"use client"

import Image from 'next/image';
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const ButtonCreatePostMobile = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-28 right-6 sm:hidden">
      <Button
        variant="primary"
        className="rounded-full p-2"
        onClick={() => router.push('/compose/tweet')}
      >
        <Image
          src="/assets/create-tweet.png"
          alt="Create Tweet Icon"
          width={40}
          height={40}
          className="object-contain"
        />
      </Button>
    </div>
  )
}

export default ButtonCreatePostMobile