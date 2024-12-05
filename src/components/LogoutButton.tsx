"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
	return (
		<button type="button" onClick={() => signOut()}>
			<div className="flex gap-2 items-center justify-center">
				<LogOut className="w-6 h-6 hover:text-background text-accent/80 transition-colors" />{" "}
				Logout
			</div>
		</button>
	);
}
