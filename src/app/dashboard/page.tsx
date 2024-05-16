import DeviceCard from "@/components/DeviceCard";
import LocationCard from "@/components/LocationCard";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getAuthSession();
  if (!session) return redirect("/signin");

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
    take: 2,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg text-primary">最近使用したロケーション</h1>
        <div className="flex gap-2">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg text-primary">最近追加したデバイス</h1>
        {/* <DeviceCard /> */}
      </div>
    </div>
  );
}
