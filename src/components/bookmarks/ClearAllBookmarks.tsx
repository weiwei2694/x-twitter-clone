"use client"

import { Dispatch, SetStateAction, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { deleteBookmarksAction } from '@/actions/tweet.action';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { toastOptions } from '@/lib/utils';

interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
}

const ClearAllBookmarks = ({ isDialogOpen, setIsDialogOpen, userId }: Props) => {
  const [isPending, startTransition] = useTransition()
  const path = usePathname()

  const clearAllBookmarks = () => {
    startTransition(() => {
      deleteBookmarksAction(userId, path);
      setIsDialogOpen(false);

      toast("Deleted SuccesfullyAll bookmarks have been deleted", {
        ...toastOptions,
        duration: 5000
      });
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="!w-[320px] !outline-none !border-none bg-black-100 select-none p-8 rounded-xl">
        <div className="flex flex-col space-y-7">
          <DialogHeader className="flex flex-col space-y-2">
            <DialogTitle className="font-extrabold tracking-wide text-xl">Clear all Bookmarks?</DialogTitle>
            <DialogDescription className="font-normal text-gray-200 leading-5">
              This can’t be undone and you’ll remove all posts you’ve added to your Bookmarks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="w-full">
            <div className="flex flex-col space-y-3 w-full">
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-600/90 rounded-full font-extrabold text-sm"
                onClick={clearAllBookmarks}
                disabled={isPending}
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                className="bg-transparent hover:bg-gray-300/30 hover:text-white border border-gray-200 rounded-full font-extrabold text-sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ClearAllBookmarks