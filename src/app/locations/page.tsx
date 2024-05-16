import LocationCard from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getAuthSession();
  console.log(session);

  if (!session) redirect("/signin");

  const locations = await db.room.findMany({
    where: {
      owner: {
        email: session!.user?.email,
      },
    },
    include: {
      _count: {
        select: {
          devices: true,
        },
      },
    },
  });

  return (
    <div className="text-background flex flex-col justify-between h-full items-center">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl text-primary font-semibold">ロケーション</h1>
          <p className="text-sm text-muted/60">
            アクセスしたいロケーションをお選び下さい。
          </p>
        </div>
        <div className="flex gap-2">
          {" "}
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        className="text-accent rounded-full bg-foreground border-border/30 hover:bg-foreground/70 hover:text-primary hover:border-primary/40"
        disabled
      >
        ロケーション作成
      </Button>
    </div>
  );
}
