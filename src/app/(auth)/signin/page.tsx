import LoginForm from "@/components/LoginForm";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await getAuthSession();
	if (session) {
		redirect("/dashboard");
	}

	return (
		<div className="flex w-full h-full justify-center items-center flex-col px-4 sm:px-6 md:px-8">
			<div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
				<LoginForm />
			</div>

			<div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mt-6 text-center">
				<p className="text-sm sm:text-base">
					現在は新規登録が制限され、すでに登録されているユーザーでログインのみが可能です。
				</p>
			</div>
		</div>
	);
}
