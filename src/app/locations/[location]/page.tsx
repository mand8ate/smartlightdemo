import DeviceCard from "@/components/DeviceCard";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    location: string;
  };
}

export default async function Page({ params }: PageProps) {
  const session = await getAuthSession();

  if (!session) redirect("/signin");

  const locationParam = params.location.split("_");
  const paramId = locationParam[locationParam.length - 1];

  const room = await db.room.findUnique({
    where: {
      id: paramId,
    },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (room?.owner.email !== session!.user?.email) {
    return notFound();
  }

  const devices = await db.device.findMany({
    where: {
      room: {
        id: paramId,
      },
    },
  });

  return (
    <div className="text-background flex flex-col justify-between h-full items-center">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl text-primary font-semibold">
            {room?.name ? room?.name : "ロケーション"}{" "}
            <span className="text-lg text-accent font-normal">
              - {devices.length} 接続済みデバイス
            </span>
          </h1>
          <p className="text-sm text-muted/60">
            アクセスしたいデバイスをお選びび下さい。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        className="text-accent rounded-full bg-foreground border-border/30 hover:bg-foreground/70 hover:text-primary hover:border-primary/40"
        disabled
      >
        デバイスを追加
      </Button>
    </div>
  );
}
