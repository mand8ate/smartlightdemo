import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await getAuthSession();
	if (!session) return redirect("/");

	return (
		<div className="flex flex-col gap-6">
			This will be the dashboard. we build this last i think
		</div>
	);
}
