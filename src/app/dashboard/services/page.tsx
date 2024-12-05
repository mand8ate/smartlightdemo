import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ServiceGrid from "@/components/services/ServiceGrid";

export default async function Page() {
	const session = await getAuthSession();
	if (!session) {
		redirect("/");
	}

	return (
		<div className="space-y-8">
			<ServiceGrid />
		</div>
	);
}
