// hooks/use-available-devices.ts
import { useQuery } from "@tanstack/react-query";
import { SwitchBotDevice } from "@/types/switchbot";

async function fetchAvailableDevices(): Promise<SwitchBotDevice[]> {
	const response = await fetch("/api/iot/switchbot/devices");
	if (!response.ok) {
		throw new Error("Failed to fetch available devices");
	}
	return response.json();
}

export function useAvailableDevices() {
	return useQuery<SwitchBotDevice>({
		queryKey: ["available-devices"],
		queryFn: async () => {
			const response = await fetch("/api/iot/switchbot/devices");
			if (!response.ok) {
				throw new Error("Failed to fetch available devices");
			}
			return response.json();
		},
	});
}
