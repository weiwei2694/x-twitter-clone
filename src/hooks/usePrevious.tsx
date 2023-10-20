import { create } from "zustand";

interface State {
	navigationHistory: string[];
}

interface Action {
	addToNavigationHistory: (url: string) => void;
	goBack: () => void;
	clearNavigationHistory: () => void;
}

export const usePrevious = create<State & Action>((set) => ({
	navigationHistory: [],
	addToNavigationHistory: (url) =>
		set((state) => {
			const len = state.navigationHistory.length - 1;
			const leadingValue = state.navigationHistory[len];

			if (leadingValue === url)
				return { navigationHistory: [...state.navigationHistory] };

			return { navigationHistory: [...state.navigationHistory, url] };
		}),
	goBack: () =>
		set((state) => ({
			navigationHistory: state.navigationHistory.slice(0, -1),
		})),
	clearNavigationHistory: () => set({ navigationHistory: [] }),
}));
