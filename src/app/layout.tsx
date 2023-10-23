import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: {
		default: "X",
		template: "%s / X",
	},
	metadataBase: new URL(process.env.NEXT_PUBLIC_NEXT_URL!),
	themeColor: "black",
	openGraph: {
		title: {
			default: "X",
			template: "%s / X",
		},
		siteName: "X (formerly Twitter)",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className="bg-black-100 text-white font-lato">
					<Toaster position="bottom-center" />
					<main className="h-full">{children}</main>
				</body>
			</html>
		</ClerkProvider>
	);
}
