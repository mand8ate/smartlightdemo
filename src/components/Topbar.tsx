"use client";
import React, { useState } from "react";
import { User } from "lucide-react";
import TimeDate from "@/components/TimeDate";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import LogoutButton from "@/components/LogoutButton";

export default function TopBar() {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const closePopoverWithDelay = () => {
		setTimeout(() => setIsOpen(false), 100);
	};

	return (
		<div className="h-20 px-8 flex items-center justify-between bg-gray-900/10 backdrop-blur-xl relative z-10">
			<TimeDate />
			<div className="text-white text-xl font-semibold">Example room</div>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<div
						className="text-gray-400 hover:text-white cursor-pointer transition-colors"
						onMouseEnter={() => setIsOpen(true)}
					>
						<User size={24} />
					</div>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					className="bg-gray-900 border-background/30 w-40 p-4 text-gray-400 hover:text-white"
					onMouseLeave={closePopoverWithDelay}
				>
					<LogoutButton />
				</PopoverContent>
			</Popover>
		</div>
	);
}
