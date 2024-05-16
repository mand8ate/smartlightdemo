import { Pen, Trash } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import OnOffSwitcher from "./OnOffSwitcher";

interface DeviceCardProps {
  device: {
    id: string;
    name: string | null;
    type: string | null;
    status: string | null;
    deviceId: string;
  };
}

export default async function DeviceCard({ device }: DeviceCardProps) {
  return (
    <div className="w-[350px] h-[200px] flex flex-col justify-between bg-card-foreground rounded-md text-foreground p-2 border border-background/20 shadow-md">
      <div className="flex justify-between">
        <div className="text-center w-1/2 px-4 py-2 border border-foreground/20 rounded-md bg-primary/30 text-accent font-semibold shadow-md">
          {device.name}
        </div>
        <div className="text-muted">
          <Badge variant="dark">{device.type}</Badge>
        </div>
      </div>
      <div className="flex justify-center ">
        <OnOffSwitcher deviceId={device.deviceId} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="warning" aria-label="edit" disabled>
          <Pen />
        </Button>
        <Button variant="destructive" aria-label="delete">
          <Trash />
        </Button>
      </div>
    </div>
  );
}
