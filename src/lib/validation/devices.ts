import { z } from "zod";

export const deviceSchema = z.object({
	name: z.string().min(1, "Device name is required"),
	deviceId: z.string().min(1, "Device selection is required"),
	type: z.string().optional(),
});

export const deviceWithIdSchema = deviceSchema.extend({
	roomId: z.string().min(1, "Room ID is required"),
});

export type DeviceFormData = z.infer<typeof deviceSchema>;
