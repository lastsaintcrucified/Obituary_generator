import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Obituary Generator",
	description:
		"Create thoughtful, personalized obituaries to honor your loved ones",
	generator: "Towhid",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<ThemeProvider>
					{/* <ThemeToggle /> */}
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
