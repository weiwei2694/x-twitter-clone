import { ConvertToHttpsType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Converts a given timestamp into a custom date format.
 *
 * @param {number} timestamp - The timestamp to convert.
 * @return {string} The custom date format.
 */
export function customDatePost(timestamp: number): string {
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

/**
 * Formats a given Date object into a string representing the time and date.
 *
 * @param {Date} Date - The Date object to be formatted.
 * @return {string} The formatted string representing the time and date.
 */
export const formatDateTime = (Date: Date): string => {
	const formattedTime = Date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	const formattedDate = Date.toLocaleDateString([], {
		month: "short",
		day: "numeric",
		year: "numeric",
	});

	return `${formattedTime} · ${formattedDate}`;
};

export const toastOptions = {
	duration: 2000,
	style: {
		color: "#fff",
		backgroundColor: "#1D9BF0",
	},
};

export const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

/**
 * Converts a given URL to HTTPS.
 *
 * @param {string} url - The URL to be converted.
 * @return {{ href: string, title: string } | undefined} - The converted URL object with href and title.
 */
export function convertToHttps(url: string): ConvertToHttpsType {
	if (!url) return;

	if (url.startsWith("https://")) {
		return {
			href: url,
			title: url.slice(8),
		};
	} else if (url.startsWith("http://")) {
		return {
			href: "https://" + url.slice(7),
			title: url.slice(7),
		};
	} else {
		return {
			href: "https://" + url,
			title: url,
		};
	}
}

/**
 * Gets the current path and search parameters of the window location.
 *
 * @return {string} The current path and search parameters.
 */
export const getCurrentPath = (): string => {
	const path = window.location.pathname;
	const searchParams = window.location.search;

	return `${path}${searchParams}`;
};

/**
 * Checks if the given page value is valid and returns it.
 *
 * @param {string} qPage - The page value to be validated.
 * @return {number} The valid page value.
 */
export const isValidPage = (qPage: string): number => {
	const page = parseInt(qPage);

	if (page < 0 || isNaN(page)) return 0;
	return page;
};
