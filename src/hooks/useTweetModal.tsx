import { create } from "zustand";

interface State {
    isOpen: boolean;
    imageUrl: string | null;
    userId: string | null;
}

interface Action {
    setImageUrl: (imageUrl: string) => void;
    setUserId: (userId: string) => void;
    onOpen: () => void;
    onClose: () => void;
}

export const useTweetModal = create<State & Action>(set => ({
    isOpen: false,
    imageUrl: null,
    userId: null,
    setUserId: (userId) => set({ userId }),
    setImageUrl: (imageUrl) => set({ imageUrl }),
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))
