"use client"
import Logout from './Logout';
import Lists from './Lists';

interface LeftSidebarProps {
    username: string;
    name: string;
    imageUrl: string;
    totalNotifications: number;
}

const LeftSidebar = ({ username, name, imageUrl, totalNotifications }: LeftSidebarProps) => {
    return (
        <aside className="w-fit max-w-[300px] h-screen p-3 max-sm:hidden sm:flex">
            <section className="overflow-y-auto space-y-20 flex flex-col justify-between">
                <Lists totalNotifications={totalNotifications} username={username} />
                <Logout
                    imageUrl={imageUrl}
                    name={name}
                    username={username}
                />
            </section>
        </aside>
    )
}

export default LeftSidebar