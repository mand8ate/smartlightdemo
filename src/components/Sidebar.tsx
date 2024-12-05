"use client";

import React from "react";
import { Home, MapPin, Grid, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
	icon: React.ReactNode;
	label: string;
	href: string;
}

export const SideNav = () => {
	const pathname = usePathname();

	const navItems: NavItem[] = [
		{ icon: <Home size={24} />, label: "Home", href: "/dashboard" },
		{
			icon: <MapPin size={24} />,
			label: "Locations",
			href: "/dashboard/locations",
		},
		{ icon: <Grid size={24} />, label: "Rooms", href: "/dashboard/rooms" },
		{
			icon: <Settings size={24} />,
			label: "Services",
			href: "/dashboard/services",
		},
	];

	return (
		<nav className="w-20 bg-black flex flex-col items-center py-6 justify-center">
			{navItems.map((item, index) => (
				<Link
					key={index}
					href={item.href}
					className={cn(
						"w-full p-4 flex flex-col items-center gap-1",
						"text-gray-400 hover:text-white transition-colors",
						pathname === item.href &&
							"text-white border-l-2 border-blue-500"
					)}
				>
					{item.icon}
					<span className="text-xs">{item.label}</span>
				</Link>
			))}
		</nav>
	);
};
