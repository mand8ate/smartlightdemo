// app/locations/page.tsx
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LocationGrid from "@/components/locations/LocationGrid";
import { db } from "@/lib/db";

export default async function Page() {
	const session = await getAuthSession();

	if (!session) {
		redirect("/");
	}

	const locations = await db.location.findMany({
		where: {
			ownerId: session.user.id,
		},
		include: {
			rooms: {
				include: {
					devices: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className="space-y-8">
			<LocationGrid initialLocations={locations} />
		</div>
	);
}
