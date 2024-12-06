import {
	Power,
	Volume2,
	VolumeX,
	ChevronUp,
	ChevronDown,
	Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface DeviceState {
	power: "on" | "off";
}

interface TVControlsProps {
	deviceId: string;
	isLoading: boolean;
	onCommand: (command: string, parameter?: any) => Promise<void>;
}

export function TVControls({
	deviceId,
	isLoading,
	onCommand,
}: TVControlsProps) {
	const [deviceState, setDeviceState] = useState<DeviceState>({
		power: "off",
	});
	const [channelNumber, setChannelNumber] = useState<string>("");

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

	const handleCommand = async (command: string, parameter?: string) => {
		await onCommand(command, parameter);
		if (command === "turnOn" || command === "turnOff") {
			setTimeout(() => fetchDeviceState(), 1000);
		}
	};

	const handleChannelSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (channelNumber) {
			handleCommand("SetChannel", channelNumber);
			setChannelNumber("");
		}
	};

	return (
		<div className="space-y-6">
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
				onClick={() =>
					handleCommand(
						deviceState.power === "on" ? "turnOff" : "turnOn"
					)
				}
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
				{deviceState.power === "on" ? "Turn Off" : "Turn On"}
				{deviceState.power === "on" && (
					<div className="absolute inset-0 bg-green-500/5" />
				)}
			</Button>

			{/* Volume Controls */}
			<div className="grid grid-cols-2 gap-2">
				<Button
					onClick={() => handleCommand("volumeAdd")}
					disabled={isLoading}
					variant="ghost"
					className="w-full bg-slate-800/30 hover:bg-slate-700/50"
				>
					<Volume2 className="w-4 h-4 mr-2" />
					Volume Up
				</Button>
				<Button
					onClick={() => handleCommand("volumeSub")}
					disabled={isLoading}
					variant="ghost"
					className="w-full bg-slate-800/30 hover:bg-slate-700/50"
				>
					<VolumeX className="w-4 h-4 mr-2" />
					Volume Down
				</Button>
			</div>

			{/* Channel Controls */}
			<div className="grid grid-cols-2 gap-2">
				<Button
					onClick={() => handleCommand("channelAdd")}
					disabled={isLoading}
					variant="ghost"
					className="w-full bg-slate-800/30 hover:bg-slate-700/50"
				>
					<ChevronUp className="w-4 h-4 mr-2" />
					Channel Up
				</Button>
				<Button
					onClick={() => handleCommand("channelSub")}
					disabled={isLoading}
					variant="ghost"
					className="w-full bg-slate-800/30 hover:bg-slate-700/50"
				>
					<ChevronDown className="w-4 h-4 mr-2" />
					Channel Down
				</Button>
			</div>

			{/* Channel Number Input */}
			<form onSubmit={handleChannelSubmit} className="flex gap-2">
				<Input
					type="number"
					placeholder="Enter channel number"
					value={channelNumber}
					onChange={(e) => setChannelNumber(e.target.value)}
					className="bg-slate-800/30 border-slate-700 text-white"
				/>
				<Button
					type="submit"
					disabled={isLoading || !channelNumber}
					variant="ghost"
					className="bg-slate-800/30 hover:bg-slate-700/50"
				>
					<Hash className="w-4 h-4 mr-2" />
					Set
				</Button>
			</form>
		</div>
	);
}
