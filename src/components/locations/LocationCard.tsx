"use client";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import type { Location, Room } from "@prisma/client";

type LocationWithRooms = Location & {
	rooms: Room[];
};

interface LocationCardProps {
	location: LocationWithRooms;
	onLocationDeleted?: (locationId: string) => void;
}

export function LocationCard({
	location,
	onLocationDeleted,
}: LocationCardProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { toast } = useToast();

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch(`/api/locations/${location.id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to delete location");
			}
			toast({
				title: "Success",
				description: "Location deleted successfully",
			});
			onLocationDeleted?.(location.id);
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to delete location",
				variant: "destructive",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
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
								<AlertDialogTitle>
									Are you sure?
								</AlertDialogTitle>
								<AlertDialogDescription className="text-gray-300">
									This will permanently delete the location
									&quot;
									{location.name}&quot; and all its rooms.
									This action cannot be undone.
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
				<Link href={`/dashboard/locations/${location.id}`}>
					<div className="text-center px-4">
						<h2 className="text-3xl font-bold mb-4 text-center">
							{location.name}
						</h2>
						<div className="text-gray-300 space-y-2">
							<p className="text-lg">
								{location.rooms.length} rooms
							</p>
							<p className="text-sm text-gray-400">
								{location.rooms.length} devices
							</p>
						</div>
					</div>
				</Link>
			</div>
		</>
	);
}
