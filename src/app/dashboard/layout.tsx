import React from "react";
import { SideNav } from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-full w-full bg-gray-900 flex">
			<SideNav />

			<div className="relative flex flex-1 flex-col">
				<div
					className="absolute inset-0 bg-cover bg-center z-0"
					style={{
						backgroundImage: "url('/background.jpg')",
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>

				<div className="relative z-10 flex flex-col h-full">
					<Topbar />
					<div className="flex flex-1 p-8 bg-gray-900/10 backdrop-blur-xl rounded-lg">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
