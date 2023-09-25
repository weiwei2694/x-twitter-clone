import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// generate by chatGPT
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

// generate by chatGPT
export const formatDateTime = (Date: Date) => {
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

// reference ByteGrad: https://youtu.be/-bmNkTqvYfQ?si=uPFCCGmaVlcmDsmv
export const getErrorMessage = (error: unknown): string => {
	let message: string;

	if (error instanceof Error) {
		message = error.message;
	} else if (error && typeof error === "object" && "message" in error) {
		message = String(error.message);
	} else {
		message = "Something went wrong."
	}

	return message;
}

// toast option
export const toastOptions = {
	duration: 2000,
	style: {
		color: "#fff",
		backgroundColor: "#1D9BF0",
	},
}

// generate by chatGPT
export const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];
