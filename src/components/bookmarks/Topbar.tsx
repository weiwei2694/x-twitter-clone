"use client"

import { BookX, MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { deleteBookmarksAction } from '@/actions/tweet.action';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { toastOptions } from '@/lib/utils';
import { Button } from '../ui/button';
import ClearAllBookmarks from './ClearAllBookmarks';

interface Props {
  userId: string;
  username: string;
  isBookmarksEmpty: boolean;
}

const Topbar = ({ userId, username, isBookmarksEmpty }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-10 backdrop-blur bg-black/80 px-3 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col item-start justify-start">
            <h2 className="font-bold tracking-wide text-xl">
              Bookmarks
            </h2>
            <p className="text-sm font-normal text-gray-200">@{username}</p>
          </div>
          {!isBookmarksEmpty && 
            <DropdownMenu>
              <DropdownMenuTrigger className="!outline-none rounded-full hover:bg-gray-300/30 p-2">
                <MoreHorizontal size={30} />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setIsDialogOpen(prev => !prev)}
                >
                  <BookX size={16} />
                  Clear All Bookmarks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        </div>
      </nav>

      <ClearAllBookmarks
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        userId={userId}
      />
    </>
  )
}

export default Topbar