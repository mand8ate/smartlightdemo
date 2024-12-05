// components/devices/controls/DeviceControls.tsx
import { Device } from "@prisma/client";
import { StripLightControls } from "./StripLightControls";
import { ColorBulbControls } from "./ColorBulbControls";
import { PlugControls } from "./PlugControls";

interface DeviceControlsProps {
	device: Device;
	isLoading: boolean;
	onCommand: (command: string, parameter?: any) => Promise<void>;
}

export function DeviceControls({
	device,
	isLoading,
	onCommand,
}: DeviceControlsProps) {
	switch (device.type) {
		case "Strip Light":
			return (
				<StripLightControls
					deviceId={device.deviceId}
					isLoading={isLoading}
					onCommand={onCommand}
				/>
			);
		case "Color Bulb":
			return (
				<ColorBulbControls
					deviceId={device.deviceId}
					isLoading={isLoading}
					onCommand={onCommand}
				/>
			);
		default:
			// Check if device type contains "Plug"
			if (device?.type?.includes("Plug")) {
				return (
					<PlugControls
						deviceId={device.deviceId}
						isLoading={isLoading}
						onCommand={onCommand}
					/>
				);
			}
			return (
				<div className="text-sm text-gray-400">
					No controls available
				</div>
			);
	}
}
