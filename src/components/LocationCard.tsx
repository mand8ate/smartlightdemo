import Link from "next/link";
import { Button } from "./ui/button";
import { Pen, Trash } from "lucide-react";

interface LocationCardProps {
  location: {
    id: string;
    name: string | null;
    ownerId: string;
    _count: {
      devices: number;
    };
  };
}

export default function LocationCard({ location }: LocationCardProps) {
  const {
    id,
    name,
    _count: { devices: deviceCount },
  } = location;

  return (
    <div className="w-[350px] h-[200px] flex flex-col justify-between bg-card-foreground rounded-md text-foreground p-2 border border-background/20 shadow-md">
      <div className="flex flex-col gap-2 w-full">
        <div className="text-center w-3/4 px-4 py-2 border border-foreground/20 rounded-md bg-primary/30 text-accent font-semibold shadow-md">
          {name}
        </div>
        <p className="text-sm text-muted/80">
          <span className="font-bold text-muted">{deviceCount}</span>{" "}
          の接続デバイス
        </p>
      </div>
      <div className="flex justify-between">
        <Button className="w-1/2 px-4 py-2 border border-foreground/20 rounded-md bg-primary text-accent font-semibold shadow-md">
          <Link
            href={`/locations/${name
              ?.split(" ")
              .join("-")
              .toLowerCase()}_${id}`}
          >
            アクセス
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="warning" aria-label="edit" disabled>
            <Pen />
          </Button>
          <Button variant="destructive" aria-label="delete">
            <Trash />
          </Button>
        </div>
      </div>
    </div>
  );
}
