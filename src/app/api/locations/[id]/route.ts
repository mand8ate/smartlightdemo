// app/api/locations/[id]/route.ts
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getAuthSession();
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const deletedLocation = await db.location.deleteMany({
			where: {
				id: params.id,
				ownerId: session.user.id,
			},
		});

		if (deletedLocation.count === 0) {
			return NextResponse.json(
				{ error: "Location not found or unauthorized" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error deleting location:", error);
		return NextResponse.json(
			{ error: "Failed to delete location" },
			{ status: 500 }
		);
	}
}
