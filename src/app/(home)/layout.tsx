import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import { currentUser } from '@clerk/nextjs'
import React from 'react'

const layout = async ({ children }: { children: React.ReactNode }) => {
    const user = await currentUser();

    if (!user) return null;

    return (
        <main className="h-full max-w-7xl mx-auto flex">
            <LeftSidebar username={user.username!} />
            {children}
            <RightSidebar />
        </main>
    )
}

export default layout