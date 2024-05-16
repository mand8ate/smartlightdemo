import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-2">
      <h2 className="text-xl">
        404 <span className="font-bold">|</span> Not Found
      </h2>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
      >
        Home
      </Link>
    </div>
  );
}
