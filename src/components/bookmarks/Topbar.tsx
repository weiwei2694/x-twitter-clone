"use client";

import { BookX, MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { deleteBookmarksAction } from "@/actions/tweet.action";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { toastOptions } from "@/lib/utils";
import DeleteModal from "../modals/DeleteModal";
import { Button } from "../ui/button";

interface Props {
	userId: string;
	username: string;
	isBookmarksEmpty: boolean;
}

const Topbar = ({ userId, username, isBookmarksEmpty }: Props) => {
	const path = usePathname();
	const [isPending, startTransition] = useTransition();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const clearAllBookmarks = () => {
		startTransition(() => {
			deleteBookmarksAction(userId, path);
			setIsDialogOpen(false);

			toast("Deleted Succesfully All bookmarks have been deleted", {
				...toastOptions,
				duration: 5000,
			});
		});
	};

	return (
		<>
			<nav className="sticky top-0 z-10 backdrop-blur bg-black/80 px-3 py-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col item-start justify-start">
						<h2 className="font-bold tracking-wide text-xl">Bookmarks</h2>
						<p className="text-sm font-normal text-gray-200">@{username}</p>
					</div>
					{!isBookmarksEmpty && (
						<DropdownMenu>
							<DropdownMenuTrigger className="!outline-none rounded-full hover:bg-gray-300/30 p-2">
								<MoreHorizontal size={30} />
							</DropdownMenuTrigger>
							<DropdownMenuContent side="bottom" align="end">
								<DropdownMenuItem
									className="text-red-600"
									onClick={() => setIsDialogOpen((prev) => !prev)}
								>
									<BookX size={16} />
									Clear All Bookmarks
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</nav>

			<DeleteModal
				title="Clear all Bookmarks?"
				description="This can’t be undone and you’ll remove all posts you’ve added to your Bookmarks."
				setIsDialogOpen={setIsDialogOpen}
				isDialogOpen={isDialogOpen}
				ButtonAction={
					<Button
						variant="primary"
						className="bg-red-600 hover:bg-red-600/90 rounded-full font-extrabold text-sm"
						onClick={clearAllBookmarks}
						disabled={isPending}
					>
						Clear
					</Button>
				}
			/>
		</>
	);
};

export default Topbar;
