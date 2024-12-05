import { NextResponse } from "next/server";
import { z } from "zod";
import { locationSchema } from "@/lib/validation/locations";
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
		const validatedFields = locationSchema.parse(body);

		const newLocation = await db.location.create({
			data: {
				name: validatedFields.name,
				ownerId: session.user.id,
			},
		});

		return NextResponse.json(newLocation, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.flatten().fieldErrors },
				{ status: 400 }
			);
		}
		console.error("Error creating location:", error);
		return NextResponse.json(
			{ error: "Failed to create location" },
			{ status: 500 }
		);
	}
}
