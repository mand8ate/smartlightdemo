"use client";

import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import axios from "axios";
import { useToast } from "./ui/use-toast";

interface OnOffSwitchProps {
  deviceId: string;
}

export default function OnOffSwitch({ deviceId }: OnOffSwitchProps) {
  const [checked, setChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`/api/iot/switchbot/status`, {
          deviceId,
        });
        const powered = response.data.body.power === "on"!!;
        setChecked(powered);
      } catch (error) {
        toast({
          title: "エラー",
          description: "デバイスの状態を取得できませんでした。",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [deviceId]);

  const handleToggle = async () => {
    const newChecked = !checked;

    try {
      setIsLoading(true);

      const response = await axios.post("/api/iot/switchbot/control", {
        deviceId,
        command: newChecked ? "turnOn" : "turnOff",
      });
      console.log(response.data);
      setChecked(!checked);
    } catch (error) {
      toast({
        title: "エラー",
        description: "デバイスの状態を変更できませんでした。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch checked={checked} onClick={handleToggle} disabled={isLoading} />
  );
}
