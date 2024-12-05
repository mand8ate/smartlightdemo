// app/api/devices/[id]/route.ts
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

		const device = await db.device.findFirst({
			where: {
				id: params.id,
				room: {
					ownerId: session.user.id,
				},
			},
		});

		if (!device) {
			return NextResponse.json(
				{ error: "Device not found or unauthorized" },
				{ status: 404 }
			);
		}

		const deletedDevice = await db.device.delete({
			where: {
				id: params.id,
			},
		});

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error deleting device:", error);
		return NextResponse.json(
			{ error: "Failed to delete device" },
			{ status: 500 }
		);
	}
}
