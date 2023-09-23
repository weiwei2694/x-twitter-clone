import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function customDatePost(timestamp: number) {
	const now = Date.now();
	const timeDiff = now - timestamp;

	switch (true) {
		case timeDiff < 60000:
			const seconds = Math.floor(timeDiff / 1000);
			return seconds + "s";
		case timeDiff < 3600000:
			const minutes = Math.floor(timeDiff / 60000);
			return minutes + "m";
		case timeDiff < 86400000:
			const hours = Math.floor(timeDiff / 3600000);
			return hours + "h";
		case timeDiff < 604800000:
			const days = Math.floor(timeDiff / 86400000);
			return days + "d";
		case timeDiff < 31536000000:
			const weeks = Math.floor(timeDiff / 604800000);
			return weeks + "w";
		default:
			const years = Math.floor(timeDiff / 31536000000);
			return years + "y";
	}
}

export const renderText = (text: string) => {
	const textWithoutEmptyLines = text.replace(/^\s*$/gm, '');
	const textWithSingleLineBreaks = textWithoutEmptyLines.replace(/\n+/g, '\n\n');
	return textWithSingleLineBreaks
}
