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

		const deletedRoom = await db.room.deleteMany({
			where: {
				id: params.id,
				ownerId: session.user.id,
			},
		});

		if (deletedRoom.count === 0) {
			return NextResponse.json(
				{ error: "Room not found or unauthorized" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error deleting room:", error);
		return NextResponse.json(
			{ error: "Failed to delete room" },
			{ status: 500 }
		);
	}
}
