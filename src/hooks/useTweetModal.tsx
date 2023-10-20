import { create } from "zustand";

interface State {
	isOpen: boolean;
}

interface Action {
	onOpen: () => void;
	onClose: () => void;
}

export const useTweetModal = create<State & Action>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
