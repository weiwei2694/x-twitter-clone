import { linksMobile } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'

const Bottombar = () => {
    return (
        <div className="max-sm:flex sm:hidden fixed bottom-0 py-7 left-0 right-0 border-t border-t-gray-300 backdrop-blur bg-black/80 rounded-t-2xl">
            <ul className="flex items-center justify-evenly w-full">
                {linksMobile.map(link => (
                    <li
                        key={link.title}
                    >
                        <Link href={link.href} className="flex flex-col items-center space-y-2 text-xl">
                            <Image src={link.icon} alt={link.title} width={30} height={30} className="object-contain w-[30px] h-[30px]" />
                        </Link>
                    </li>
                )
                )}
            </ul>
        </div>
    )
}

export default Bottombar