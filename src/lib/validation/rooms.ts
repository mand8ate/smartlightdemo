import { z } from "zod";

export const roomSchema = z.object({
	name: z.string().min(1, "Room name is required"),
});

export const roomWithLocationSchema = roomSchema.extend({
	locationId: z.string().min(1, "Location ID is required"),
});

export type RoomFormData = z.infer<typeof roomSchema>;
export type RoomWithLocationData = z.infer<typeof roomWithLocationSchema>;
