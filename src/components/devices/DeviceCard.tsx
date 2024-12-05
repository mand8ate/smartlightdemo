// components/devices/DeviceCard.tsx
"use client";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DeviceControls } from "./controls";
import type { Device } from "@prisma/client";
import { useDeviceCommands } from "@/hooks/use-device-commands";

interface DeviceCardProps {
	device: Device;
	onDeviceDeleted?: (deviceId: string) => void;
}

export function DeviceCard({ device, onDeviceDeleted }: DeviceCardProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { toast } = useToast();
	const { isLoading, sendCommand } = useDeviceCommands({
		vendor: "switchbot",
		deviceId: device.deviceId,
	});

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch(`/api/devices/${device.id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to delete device");
			}
			toast({
				title: "Success",
				description: "Device deleted successfully",
			});
			onDeviceDeleted?.(device.id);
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to delete device",
				variant: "destructive",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="bg-slate-800/30 backdrop-blur-sm relative flex flex-col items-center justify-center text-white hover:bg-slate-700/20 transition-colors border-[0.5px] border-white/10 p-4">
			<div className="absolute top-4 right-4 flex gap-2">
				<Button
					variant="ghost"
					size="icon"
					className="hover:bg-slate-700/50"
				>
					<Pencil className="w-4 h-4 text-white/70" />
				</Button>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="hover:bg-slate-700/50"
						>
							<Trash2 className="w-4 h-4 text-white/70" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="bg-slate-800/95 backdrop-blur-sm text-white border-white/10">
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription className="text-gray-300">
								This will permanently delete the device &quot;
								{device.name}&quot;. This action cannot be
								undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="bg-transparent border-slate-600 text-gray-200 hover:bg-slate-700/50">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDelete}
								className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
								disabled={isDeleting}
							>
								{isDeleting ? "Deleting..." : "Delete"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			<div className="w-full space-y-4">
				<div className="text-center">
					<h2 className="text-3xl font-bold mb-4">{device.name}</h2>
					<p className="text-sm text-gray-400">
						Type: {device.type || "Not specified"}
					</p>
				</div>

				<div className="flex justify-center">
					<DeviceControls
						device={device}
						isLoading={isLoading}
						onCommand={sendCommand}
					/>
				</div>
			</div>
		</div>
	);
}
