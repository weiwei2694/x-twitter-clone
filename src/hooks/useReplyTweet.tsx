import { create } from "zustand";
import { DataTweet } from "@/interfaces/tweet.interface";

interface State {
	dataTweet: DataTweet | null;
}

interface Action {
	setDataTweet: (dataTweet: DataTweet | null) => void;
}

export const useReplyTweet = create<State & Action>((set) => ({
	dataTweet: null,
	setDataTweet: (dataTweet) => set({ dataTweet }),
}));
