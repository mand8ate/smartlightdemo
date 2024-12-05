"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { locationSchema } from "@/lib/validation/locations";
import type { LocationFormData } from "@/lib/validation/locations";
import type { Location, Room } from "@prisma/client";
import { useToast } from "../ui/use-toast";

type LocationWithRooms = Location & {
	rooms: Room[];
};

interface AddLocationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onLocationAdded: (newLocation: LocationWithRooms) => void;
}

export default function AddLocationModal({
	isOpen,
	onClose,
	onLocationAdded,
}: AddLocationModalProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<LocationFormData>({
		resolver: zodResolver(locationSchema),
		defaultValues: {
			name: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = form;

	const onSubmit = async (data: LocationFormData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/locations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create location");
			}

			const createdLocation: Location = await response.json();

			const locationWithRooms: LocationWithRooms = {
				...createdLocation,
				rooms: [],
			};

			reset();
			onLocationAdded(locationWithRooms);
			onClose();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to create location",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					reset();
					onClose();
				}
			}}
		>
			<DialogContent className="sm:max-w-[425px] bg-slate-800/95 backdrop-blur-sm text-white border-white/10">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Add New Location
					</DialogTitle>
					<DialogDescription className="text-gray-300">
						Enter the details for the new location below.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label
							htmlFor="name"
							className="text-sm font-medium text-gray-200"
						>
							Location Name
						</Label>
						<Input
							id="name"
							{...register("name")}
							className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
							placeholder="Enter location name"
						/>
						{errors.name && (
							<span className="text-sm text-red-400">
								{errors.name.message}
							</span>
						)}
					</div>
					<div className="flex justify-end space-x-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								reset();
								onClose();
							}}
							className="bg-transparent border-slate-600 text-gray-200 hover:bg-slate-700/50"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-slate-700/50 hover:bg-slate-700/70 text-white"
						>
							{isSubmitting ? "Adding..." : "Add Location"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
