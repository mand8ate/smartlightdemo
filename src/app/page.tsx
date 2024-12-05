import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await getAuthSession();
	console.log(session);

	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="w-full h-full flex flex-col gap-8 justify-center pt-8">
			<h1 className="text-2xl font-bold">
				<span className="text-primary">Cloud Smart IOT</span>{" "}
				<span className="text-muted/40">Demo v0.2</span>
			</h1>
			<Image
				src="/cloudsmartiot.png"
				alt="cloud smart iot logo"
				width={250}
				height={250}
				className="mx-auto"
			/>
			<div className="mx-auto">
				<Button>
					<Link href="/signin">Signin</Link>
				</Button>
			</div>
		</div>
	);
}
