"use client"

import { Dispatch, SetStateAction, useTransition } from 'react';
import { Button } from '../ui/button';
import { deleteBookmarksAction } from '@/actions/tweet.action';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { toastOptions } from '@/lib/utils';
import DeleteModal from '../modals/DeleteModal';

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

      toast("Deleted Succesfully All bookmarks have been deleted", {
        ...toastOptions,
        duration: 5000
      });
    })
  }

  return (
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
  )
}

export default ClearAllBookmarks