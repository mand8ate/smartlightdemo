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
import { useToast } from "@/components/ui/use-toast";
import { roomSchema } from "@/lib/validation/rooms";
import type { Room } from "@prisma/client";
import { RoomFormData } from "@/lib/validation/rooms";

interface AddRoomModalProps {
	locationId: string;
	isOpen: boolean;
	onClose: () => void;
	onRoomAdded: (newRoom: Room) => void;
}

export default function AddRoomModal({
	locationId,
	isOpen,
	onClose,
	onRoomAdded,
}: AddRoomModalProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<RoomFormData>({
		resolver: zodResolver(roomSchema),
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

	const onSubmit = async (data: RoomFormData) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/rooms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					locationId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create room");
			}

			const createdRoom: Room = await response.json();

			toast({
				title: "Success",
				description: "Room created successfully",
			});

			reset();
			onRoomAdded(createdRoom);
			onClose();
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to create room",
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
						Add New Room
					</DialogTitle>
					<DialogDescription className="text-gray-300">
						Enter the details for the new room below.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label
							htmlFor="name"
							className="text-sm font-medium text-gray-200"
						>
							Room Name
						</Label>
						<Input
							id="name"
							{...register("name")}
							className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
							placeholder="Enter room name"
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
							{isSubmitting ? "Adding..." : "Add Room"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
