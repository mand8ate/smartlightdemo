import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UseDeviceCommandsProps {
	vendor: "switchbot"; // can be extended with other vendors
	deviceId: string;
}

export function useDeviceCommands({
	vendor,
	deviceId,
}: UseDeviceCommandsProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const sendCommand = async (command: string, parameter?: any) => {
		setIsLoading(true);
		try {
			// Different vendors will have different API endpoints
			const endpoint =
				vendor === "switchbot"
					? `/api/iot/switchbot/command/${deviceId}`
					: "";

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ command, parameter }),
			});

			if (!response.ok) {
				throw new Error("Failed to send command");
			}

			const data = await response.json();
			if (data.statusCode !== 100) {
				throw new Error(data.message || "Command failed");
			}

			toast({
				title: "Success",
				description: `Command ${command} sent successfully`,
			});

			return data;
		} catch (error) {
			console.error("Command error:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to send command",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		sendCommand,
	};
}
