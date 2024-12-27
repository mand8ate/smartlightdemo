import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface DeviceState {
	power: "on" | "off";
}

interface TVControlsProps {
	deviceId: string;
	isLoading: boolean;
	onCommand: (
		command: string,
		parameter?: any,
		commandType?: string
	) => Promise<void>;
}

export function TVControls({
	deviceId,
	isLoading,
	onCommand,
}: TVControlsProps) {
	const [deviceState, setDeviceState] = useState<DeviceState>({
		power: "off",
	});

	const fetchDeviceState = async () => {
		try {
			const response = await fetch(
				`/api/iot/switchbot/status/${deviceId}`
			);
			if (!response.ok) throw new Error("Failed to fetch device status");
			const data = await response.json();
			setDeviceState({
				power: data.power.toLowerCase(),
			});
		} catch (error) {
			console.error("Error fetching device state:", error);
		}
	};

	useEffect(() => {
		fetchDeviceState();
	}, [deviceId]);

	const handleCommand = async () => {
		await onCommand("turnOn", undefined, "command");
		// Wait a second before refreshing the state
		setTimeout(() => fetchDeviceState(), 1000);
	};

	return (
		<div className="space-y-6 p-4">
			{/* Status Bar */}
			<div className="flex items-center justify-between px-2">
				<span className="text-sm text-gray-400">Status</span>
				<div className="flex items-center gap-2">
					<div
						className={`w-2 h-2 rounded-full ${
							deviceState.power === "on"
								? "bg-green-500"
								: "bg-red-500"
						}`}
					/>
					<span className="text-sm text-gray-300">
						{deviceState.power.toUpperCase()}
					</span>
				</div>
			</div>

			{/* Power Control */}
			<Button
				onClick={handleCommand}
				disabled={isLoading}
				variant="ghost"
				className={`w-full relative group hover:bg-slate-700/50 
          ${
				deviceState.power === "on"
					? "bg-slate-700/30"
					: "bg-slate-800/30"
			}`}
			>
				<Power
					className={`w-4 h-4 mr-2 transition-colors
          ${deviceState.power === "on" ? "text-green-400" : "text-white/70"}`}
				/>
				Power
				{deviceState.power === "on" && (
					<div className="absolute inset-0 bg-green-500/5" />
				)}
			</Button>
		</div>
	);
}
