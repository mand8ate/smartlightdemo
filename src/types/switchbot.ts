import { Device } from "@prisma/client";

export interface SwitchBotDevice {
	body: {
		physicalDevices: Array<{
			deviceId: string;
			deviceName: string;
			deviceType: string;
		}>;
		infraredDevices: Array<{
			deviceId: string;
			deviceName: string;
		}>;
	};
}

interface DeviceMutationResponse extends Device {}
