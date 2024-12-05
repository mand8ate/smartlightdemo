"use client";
import { useState, useEffect } from "react";
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAvailableDevices } from "@/hooks/use-available-devices";
import type { DeviceFormData } from "@/lib/validation/devices";
import { deviceSchema } from "@/lib/validation/devices";
import type { Device } from "@prisma/client";

interface AddDeviceModalProps {
	roomId: string;
	isOpen: boolean;
	onClose: () => void;
	onDeviceAdded: (newDevice: Device) => void;
}

export default function AddDeviceModal({
	roomId,
	isOpen,
	onClose,
	onDeviceAdded,
}: AddDeviceModalProps) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const { data: availableDevices, isLoading: devicesLoading } =
		useAvailableDevices();
	const [isIRDevice, setIsIRDevice] = useState(false);

	const form = useForm<DeviceFormData>({
		resolver: zodResolver(deviceSchema),
		defaultValues: {
			name: "",
			deviceId: "",
			type: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = form;

	const selectedDeviceId = watch("deviceId");

	useEffect(() => {
		if (!selectedDeviceId || !availableDevices) return;

		const physicalDevice = availableDevices.body.physicalDevices.find(
			(d: any) => d.deviceId === selectedDeviceId
		);

		if (physicalDevice) {
			setIsIRDevice(false);
			setValue("type", physicalDevice.deviceType);
		} else {
			setIsIRDevice(true);
			setValue("type", "");
		}
	}, [selectedDeviceId, availableDevices, setValue]);

	const createDeviceMutation = useMutation<Device, Error, DeviceFormData>({
		mutationFn: async (data: DeviceFormData) => {
			const response = await fetch("/api/devices", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: data.name,
					deviceId: data.deviceId,
					type: data.type,
					roomId,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create device");
			}

			return response.json();
		},
		onSuccess: (newDevice) => {
			queryClient.invalidateQueries({
				queryKey: ["available-devices"],
			});
			onDeviceAdded(newDevice);
			toast({
				title: "Success",
				description: "Device added successfully",
			});
			reset();
			onClose();
		},
		onError: (error) => {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to add device",
				variant: "destructive",
			});
		},
	});
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
						Add New Device
					</DialogTitle>
					<DialogDescription className="text-gray-300">
						Select a device and give it a name.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit((data) =>
						createDeviceMutation.mutate(data)
					)}
					className="space-y-4"
				>
					<div className="space-y-2">
						<Label
							htmlFor="deviceId"
							className="text-sm font-medium text-gray-200"
						>
							Select Device
						</Label>
						<Select
							onValueChange={(value) =>
								setValue("deviceId", value)
							}
							defaultValue=""
						>
							<SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
								<SelectValue placeholder="Select a device" />
							</SelectTrigger>
							<SelectContent className="bg-slate-800 border-slate-700 text-white">
								{(() => {
									const physicalDevices =
										availableDevices?.body
											?.physicalDevices ?? [];
									const infraredDevices =
										availableDevices?.body
											?.infraredDevices ?? [];
									const hasPhysicalDevices =
										physicalDevices.length > 0;
									const hasInfraredDevices =
										infraredDevices.length > 0;

									if (devicesLoading) {
										return (
											<SelectItem
												value="loading"
												disabled
											>
												Loading devices...
											</SelectItem>
										);
									}

									if (
										!hasPhysicalDevices &&
										!hasInfraredDevices
									) {
										return (
											<SelectItem
												value="no-devices"
												disabled
											>
												No devices available
											</SelectItem>
										);
									}

									return (
										<>
											{hasPhysicalDevices && (
												<SelectGroup>
													<SelectLabel>
														<p className="text-muted/50">
															Physical Devices
														</p>
													</SelectLabel>
													{physicalDevices.map(
														(device: any) => (
															<SelectItem
																key={
																	device.deviceId
																}
																value={
																	device.deviceId
																}
															>
																{
																	device.deviceName
																}{" "}
																(
																{
																	device.deviceType
																}
																)
															</SelectItem>
														)
													)}
												</SelectGroup>
											)}
											{hasInfraredDevices && (
												<SelectGroup>
													<SelectLabel>
														<p className="text-muted/50">
															Infrared Devices
														</p>
													</SelectLabel>
													{infraredDevices.map(
														(device: any) => (
															<SelectItem
																key={
																	device.deviceId
																}
																value={
																	device.deviceId
																}
															>
																{
																	device.deviceName
																}
															</SelectItem>
														)
													)}
												</SelectGroup>
											)}
										</>
									);
								})()}
							</SelectContent>
						</Select>
						{errors.deviceId && (
							<span className="text-sm text-red-400">
								{errors.deviceId.message}
							</span>
						)}
					</div>

					{isIRDevice && selectedDeviceId && (
						<div className="space-y-2">
							<Label
								htmlFor="type"
								className="text-sm font-medium text-gray-200"
							>
								Device Type
							</Label>
							<Select
								onValueChange={(value) =>
									setValue("type", value)
								}
								defaultValue=""
							>
								<SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
									<SelectValue placeholder="Select device type" />
								</SelectTrigger>
								<SelectContent className="bg-slate-800 border-slate-700 text-white">
									<SelectGroup>
										<SelectLabel>
											IR Device Types
										</SelectLabel>
										<SelectItem value="IR_TV">
											TV
										</SelectItem>
										<SelectItem value="IR_LIGHT">
											Light
										</SelectItem>
										<SelectItem value="IR_AC">
											Air Conditioner
										</SelectItem>
										<SelectItem value="IR_FAN">
											Fan
										</SelectItem>
										<SelectItem value="IR_OTHERS">
											Other
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							{errors.type && (
								<span className="text-sm text-red-400">
									{errors.type.message}
								</span>
							)}
						</div>
					)}

					<div className="space-y-2">
						<Label
							htmlFor="name"
							className="text-sm font-medium text-gray-200"
						>
							Device Name
						</Label>
						<Input
							id="name"
							{...register("name")}
							className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
							placeholder="Enter device name"
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
							disabled={createDeviceMutation.isPending}
							className="bg-slate-700/50 hover:bg-slate-700/70 text-white"
						>
							{createDeviceMutation.isPending
								? "Adding..."
								: "Add Device"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
