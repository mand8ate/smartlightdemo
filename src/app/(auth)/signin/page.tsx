import LoginForm from "@/components/LoginForm";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex w-full h-full justify-center items-center flex-col">
      <LoginForm />
      <div className="w-1/2 mt-6">
        <p>
          現在は新規登録が制限され、すでに登録されているユーザーでログインのみが可能です。
        </p>
      </div>
    </div>
  );
}
