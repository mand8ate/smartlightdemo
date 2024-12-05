import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import RoomGrid from "@/components/RoomGrid";

export default async function Page() {
	const session = await getAuthSession();
	if (!session) {
		redirect("/");
	}

	return (
		<div className="space-y-8">
			<RoomGrid />
		</div>
	);
}
