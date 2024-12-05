import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Smart Device Integration Demo",
	description:
		"This is a simple demo of our future smart device integration application. Users have locations they are subscribed to and can access specific rooms at their location. These rooms contain specific smart devices that only the user with the correct access data can control.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"bg-foreground text-background flex min-h-screen justify-center items-center",
					inter.className
				)}
			>
				<div className="border border-background/20 rounded-md flex">
					<main className="w-[1200px] h-[800px] min rounded-r-md p-2 bg-background/10">
						<Providers>{children}</Providers>
					</main>
					<Toaster />
				</div>
			</body>
		</html>
	);
}
