import { getAuthSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const session = await getAuthSession();

  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center pt-8">
      <h1 className="text-2xl font-bold">
        <span className="text-primary">Cloud Smart IOT</span>{" "}
        <span className="text-muted/40">Demo v0.1</span>
      </h1>
      <Image
        src="/cloudsmartiot.png"
        alt="cloud smart iot logo"
        width={250}
        height={250}
        className="mx-auto"
      />
      {!session ? (
        <p className="text-sm mx-auto text-center w-1/2">
          使用するためにログインする必要があります。
          <br />
          <Link href="/signin" className="text-primary">
            ログイン
          </Link>
          はこちらです。
        </p>
      ) : (
        <p className="text-sm mx-auto text-center w-1/2">
          お帰りなさい、{session?.user?.name}
          <br />
          <Link href="/dashboard" className="text-primary">
            ダッシュボード
          </Link>
          を使用下さい。
        </p>
      )}
    </div>
  );
}
