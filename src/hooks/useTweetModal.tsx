import { DataTweet } from "@/interfaces/tweet.interface";
import { create } from "zustand";

interface State {
    isOpen: boolean;
    parentId: string | undefined;
    dataTweet: DataTweet | undefined;
}

interface Action {
    onOpen: () => void;
    onClose: () => void;
    setParentId: (parentId: string | undefined) => void;
    setDataTweet: (dataTweet: DataTweet | undefined) => void;
}

export const useTweetModal = create<State & Action>(set => ({
    isOpen: false,
    parentId: undefined,
    dataTweet: undefined,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    setParentId: (parentId) => set({ parentId }),
    setDataTweet: (dataTweet) => set({ dataTweet }),
}))
