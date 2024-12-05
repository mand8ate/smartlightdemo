import React from "react";
import { ChevronRight } from "lucide-react";

export default function ServiceGrid() {
	const services = [
		{
			name: "LIGHTS",
			devices: 45,
			description: "Control brightness and color",
		},
		{
			name: "CLIMATE",
			devices: 32,
			description: "Temperature and humidity control",
		},
		{ name: "AUDIO", devices: 28, description: "Sound system management" },
		{
			name: "VIDEO",
			devices: 15,
			description: "Display and projection systems",
		},
		{
			name: "SECURITY",
			devices: 24,
			description: "Access and surveillance",
		},
		{ name: "SHADES", devices: 36, description: "Window shade automation" },
		{ name: "ACCESS", devices: 18, description: "Door and gate control" },
		{
			name: "SENSORS",
			devices: 56,
			description: "Environmental monitoring",
		},
	];

	return (
		<div className="h-full w-full grid grid-rows-2 gap-0.5">
			<div className="grid grid-cols-4 gap-0.5">
				{services.slice(0, 4).map((service, index) => (
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
								{service.name}
							</h2>
							<div className="text-gray-300 space-y-2">
								<p className="text-lg">
									{service.devices} devices
								</p>
								<p className="text-sm text-gray-400">
									{service.description}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="grid grid-cols-4 gap-0.5">
				{services.slice(4, 8).map((service, index) => (
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
								{service.name}
							</h2>
							<div className="text-gray-300 space-y-2">
								<p className="text-lg">
									{service.devices} devices
								</p>
								<p className="text-sm text-gray-400">
									{service.description}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
