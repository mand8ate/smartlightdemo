// app/api/rooms/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { roomWithLocationSchema } from "@/lib/validation/rooms";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

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
		const validatedFields = roomWithLocationSchema.parse(body);

		const location = await db.location.findFirst({
			where: {
				id: validatedFields.locationId,
				ownerId: session.user.id,
			},
		});

		if (!location) {
			return NextResponse.json(
				{ error: "Location not found or unauthorized" },
				{ status: 404 }
			);
		}

		const newRoom = await db.room.create({
			data: {
				name: validatedFields.name,
				ownerId: session.user.id,
				locationId: validatedFields.locationId,
			},
		});

		return NextResponse.json(newRoom, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.flatten().fieldErrors },
				{ status: 400 }
			);
		}

		console.error("Error creating room:", error);
		return NextResponse.json(
			{ error: "Failed to create room" },
			{ status: 500 }
		);
	}
}
