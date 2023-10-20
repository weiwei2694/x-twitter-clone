import { create } from "zustand";

interface State {
	status: string;
}

interface Action {
	setStatus: (status: string) => void;
}

export const useTabsPosts = create<State & Action>((set) => ({
	status: "For You",
	setStatus: (status) => set({ status }),
}));
