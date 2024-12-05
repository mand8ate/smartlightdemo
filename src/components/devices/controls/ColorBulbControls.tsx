import { Lightbulb, Plus, Minus, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface DeviceState {
	power: "on" | "off";
	brightness: number;
	color: string;
	version?: string;
}

interface ColorBulbControlsProps {
	deviceId: string;
	isLoading: boolean;
	onCommand: (command: string, parameter?: any) => Promise<void>;
}

export function ColorBulbControls({
	deviceId,
	isLoading,
	onCommand,
}: ColorBulbControlsProps) {
	const [deviceState, setDeviceState] = useState<DeviceState>({
		power: "off",
		brightness: 0,
		color: "126:255:211",
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
				brightness: data.brightness,
				color: data.color,
			});
		} catch (error) {
			console.error("Error fetching device state:", error);
		}
	};

	useEffect(() => {
		fetchDeviceState();
	}, [deviceId]);

	const handleCommand = async (command: string, parameter?: any) => {
		await onCommand(command, parameter);
		setTimeout(() => fetchDeviceState(), 1000);
	};

	const getRGBColor = (colorString: string) => {
		const [r, g, b] = colorString.split(":").map(Number);
		return `rgb(${r}, ${g}, ${b})`;
	};

	return (
		<div className="space-y-4">
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

			{/* Controls */}
			<div className="space-y-4">
				{/* Power Control */}
				<Button
					onClick={() =>
						handleCommand(
							deviceState.power === "on" ? "turnOff" : "turnOn"
						)
					}
					disabled={isLoading}
					variant="ghost"
					className={`w-full relative overflow-hidden group hover:bg-slate-700/50 
            ${
				deviceState.power === "on"
					? "bg-slate-700/30"
					: "bg-slate-800/30"
			}`}
				>
					<Lightbulb
						className={`w-4 h-4 mr-2 transition-colors
            ${deviceState.power === "on" ? "text-green-400" : "text-white/70"}`}
					/>
					<span>
						{deviceState.power === "on" ? "Turn Off" : "Turn On"}
					</span>
					{deviceState.power === "on" && (
						<div
							className="absolute inset-0 opacity-10"
							style={{
								backgroundColor: getRGBColor(deviceState.color),
							}}
						/>
					)}
				</Button>

				{/* Brightness Controls */}
				<div className="space-y-2">
					<div className="flex items-center justify-between px-2">
						<span className="text-sm text-gray-400">
							Brightness
						</span>
						<span className="text-sm text-gray-300">
							{deviceState.brightness}%
						</span>
					</div>
					<div className="flex gap-2 items-center">
						<Button
							onClick={() =>
								handleCommand("setBrightness", {
									brightness: Math.max(
										0,
										deviceState.brightness - 10
									),
								})
							}
							disabled={isLoading || deviceState.brightness <= 0}
							variant="ghost"
							size="icon"
							className="hover:bg-slate-700/50"
						>
							<Minus className="w-4 h-4 text-white/70" />
						</Button>
						<div className="flex-1 h-2 bg-slate-700/30 rounded-full overflow-hidden">
							<div
								className="h-full transition-all duration-200"
								style={{
									width: `${deviceState.brightness}%`,
									backgroundColor: getRGBColor(
										deviceState.color
									),
								}}
							/>
						</div>
						<Button
							onClick={() =>
								handleCommand("setBrightness", {
									brightness: Math.min(
										100,
										deviceState.brightness + 10
									),
								})
							}
							disabled={
								isLoading || deviceState.brightness >= 100
							}
							variant="ghost"
							size="icon"
							className="hover:bg-slate-700/50"
						>
							<Plus className="w-4 h-4 text-white/70" />
						</Button>
					</div>
				</div>

				{/* Color Controls */}
				<div className="space-y-2">
					<div className="flex items-center justify-between px-2">
						<span className="text-sm text-gray-400">Color</span>
						<div
							className="w-4 h-4 rounded-full border border-white/10"
							style={{
								backgroundColor: getRGBColor(deviceState.color),
							}}
						/>
					</div>
					<Button
						onClick={() => handleCommand("setColor")}
						disabled={isLoading}
						variant="ghost"
						className="w-full hover:bg-slate-700/50 relative overflow-hidden group"
					>
						<Palette className="w-4 h-4 mr-2 text-white/70" />
						Change Color
						<div
							className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10"
							style={{
								backgroundColor: getRGBColor(deviceState.color),
							}}
						/>
					</Button>
				</div>
			</div>
		</div>
	);
}
