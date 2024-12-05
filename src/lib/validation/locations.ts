import { z } from "zod";

export const locationSchema = z.object({
	name: z.string().min(1, "Location name is required"),
});

export type LocationFormData = z.infer<typeof locationSchema>;
