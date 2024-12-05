import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DeviceGrid from "@/components/devices/DeviceGrid";

interface RoomPageProps {
	params: {
		id: string;
	};
}

export default async function Page({ params }: RoomPageProps) {
	const session = await getAuthSession();
	if (!session) {
		redirect("/");
	}

	const roomId = params.id;
	const devicesForRoom = await db.device.findMany({
		where: {
			roomId,
			room: {
				ownerId: session.user.id,
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className="space-y-8">
			<DeviceGrid roomId={roomId} initialDevices={devicesForRoom} />
		</div>
	);
}
