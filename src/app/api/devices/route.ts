import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { deviceWithIdSchema } from "@/lib/validation/devices";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const validatedFields = deviceWithIdSchema.parse(body);

		const room = await db.room.findFirst({
			where: {
				id: validatedFields.roomId,
				ownerId: session.user.id,
			},
		});

		if (!room) {
			return NextResponse.json(
				{ error: "Room not found or unauthorized" },
				{ status: 404 }
			);
		}

		const newDevice = await db.device.create({
			data: {
				name: validatedFields.name,
				deviceId: validatedFields.deviceId,
				type: validatedFields.type,
				roomId: validatedFields.roomId,
			},
		});

		return NextResponse.json(newDevice, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.flatten().fieldErrors },
				{ status: 400 }
			);
		}

		console.error("Error creating device:", error);
		return NextResponse.json(
			{ error: "Failed to create device" },
			{ status: 500 }
		);
	}
}
