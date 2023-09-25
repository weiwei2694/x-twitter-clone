import './globals.css'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

import { Lato } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from 'react-hot-toast'
const font = Lato({ subsets: ['latin'], weight: ["300", "400", "700", "900"] })

export const metadata: Metadata = {
  title: 'X Twitter',
  description: 'Create your own thread',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("bg-black-100 text-white", font.className)}>
          <Toaster position="bottom-center" />
          <main className="h-full">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
