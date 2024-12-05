import LocationRoomGrid from "@/components/locations/LocationRoomGrid";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface LocationPageProps {
	params: {
		id: string;
		locationId: string;
	};
}

export default async function Page({ params }: LocationPageProps) {
	const session = await getAuthSession();
	if (!session) {
		redirect("/");
	}

	const locationId = params.id;

	const roomsForLocation = await db.room.findMany({
		where: {
			locationId,
			ownerId: session.user.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className="space-y-8">
			<LocationRoomGrid
				locationId={locationId}
				initialRooms={roomsForLocation}
			/>
		</div>
	);
}
