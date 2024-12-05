import React from "react";
import { ChevronRight } from "lucide-react";

export default function RoomGrid() {
	const rooms = [
		{ name: "CONFERENCE A", devices: 12, location: "MAIN BUILDING" },
		{ name: "MEETING ROOM 1", devices: 8, location: "WEST WING" },
		{ name: "OFFICE 205", devices: 6, location: "EAST WING" },
		{ name: "LOBBY", devices: 15, location: "MAIN BUILDING" },
		{ name: "LAB 101", devices: 20, location: "RESEARCH LAB" },
		{ name: "TRAINING HALL", devices: 10, location: "TRAINING CENTER" },
		{ name: "BREAKOUT ROOM", devices: 5, location: "INNOVATION HUB" },
		{ name: "EXECUTIVE SUITE", devices: 14, location: "ADMIN BLOCK" },
	];

	return (
		<div className="h-full w-full grid grid-rows-2 gap-0.5">
			<div className="grid grid-cols-4 gap-0.5">
				{rooms.slice(0, 4).map((room, index) => (
					<div
						key={index}
						className="bg-slate-800/60 backdrop-blur-sm relative
                     flex flex-col items-center justify-center
                     text-white hover:bg-slate-700/60 transition-colors cursor-pointer
                     border-[0.5px] border-white/10"
					>
						<ChevronRight className="absolute top-4 right-4 w-6 h-6 text-white/70" />
						<div className="text-center px-4">
							<h2 className="text-3xl font-bold mb-4 text-center">
								{room.name}
							</h2>
							<div className="text-gray-300 space-y-2">
								<p className="text-lg">
									{room.devices} devices
								</p>
								<p className="text-sm text-gray-400">
									{room.location}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="grid grid-cols-4 gap-0.5">
				{rooms.slice(4, 8).map((room, index) => (
					<div
						key={index}
						className="bg-slate-800/60 backdrop-blur-sm relative
                     flex flex-col items-center justify-center
                     text-white hover:bg-slate-700/60 transition-colors cursor-pointer
                     border-[0.5px] border-white/10"
					>
						<ChevronRight className="absolute top-4 right-4 w-6 h-6 text-white/70" />
						<div className="text-center px-4">
							<h2 className="text-3xl font-bold mb-4 text-center">
								{room.name}
							</h2>
							<div className="text-gray-300 space-y-2">
								<p className="text-lg">
									{room.devices} devices
								</p>
								<p className="text-sm text-gray-400">
									{room.location}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
