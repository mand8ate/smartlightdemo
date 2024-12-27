import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await getAuthSession();
	if (session) {
		redirect("/dashboard");
	}

	return (
		<main className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 py-12 sm:py-16 lg:py-20">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
						<span className="text-primary">Cloud Smart IOT</span>{" "}
						<span className="text-muted/40">Demo v0.2</span>
					</h1>
				</div>

				{/* Logo */}
				<div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto">
					<Image
						src="/cloudsmartiot.png"
						alt="cloud smart iot logo"
						fill
						className="object-contain"
						priority
					/>
				</div>

				{/* Sign In Button */}
				<div className="flex justify-center">
					<Button className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg">
						<Link href="/signin" className="w-full">
							Sign In
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
