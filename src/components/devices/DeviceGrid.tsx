// components/devices/DeviceGrid.tsx
"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { DeviceCard } from "@/components/devices/DeviceCard";
import AddDeviceModal from "@/components/devices/AddDeviceModal";
import type { Device } from "@prisma/client";

interface DeviceGridProps {
	roomId: string;
	initialDevices: Device[];
}

export default function DeviceGrid({
	roomId,
	initialDevices,
}: DeviceGridProps) {
	const [devices, setDevices] = useState<Device[]>(initialDevices);
	const [currentPage, setCurrentPage] = useState(1);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const devicesPerPage = 6;
	const totalPages = Math.ceil(devices.length / devicesPerPage);

	const getCurrentDevices = () => {
		const start = (currentPage - 1) * devicesPerPage;
		return devices.slice(start, start + devicesPerPage);
	};

	const handleDeviceAdded = (newDevice: Device) => {
		setDevices((prev) => [...prev, newDevice]);
		const newTotalPages = Math.ceil((devices.length + 1) / devicesPerPage);
		if (newTotalPages > totalPages) {
			setCurrentPage(newTotalPages);
		}
	};

	const handleDeviceDeleted = (deletedId: string) => {
		setDevices((prevDevices) =>
			prevDevices.filter((device) => device.id !== deletedId)
		);

		const newTotalPages = Math.ceil((devices.length - 1) / devicesPerPage);
		if (currentPage > newTotalPages && newTotalPages > 0) {
			setCurrentPage(newTotalPages);
		}
	};

	return (
		<div className="h-full w-full grid grid-cols-4 gap-4">
			<div className="col-span-3 flex flex-col">
				{devices.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
						<p className="text-xl mb-2">No devices added yet</p>
						<p className="text-sm">
							Add your first device in the configuration panel
						</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-4 flex-grow">
						{getCurrentDevices().map((device) => (
							<DeviceCard
								key={device.id}
								device={device}
								onDeviceDeleted={handleDeviceDeleted}
							/>
						))}
					</div>
				)}

				{totalPages > 1 && (
					<div className="mt-6">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											setCurrentPage((prev) =>
												Math.max(1, prev - 1)
											)
										}
										className={`text-gray-300 hover:text-white hover:bg-slate-700/50 border-slate-700 ${
											currentPage === 1
												? "pointer-events-none opacity-50"
												: ""
										}`}
									/>
								</PaginationItem>

								{[...Array(totalPages)].map((_, i) => (
									<PaginationItem key={i + 1}>
										<PaginationLink
											onClick={() =>
												setCurrentPage(i + 1)
											}
											className={
												currentPage === i + 1
													? "bg-slate-700/50 text-white hover:bg-slate-700/70 border-slate-700"
													: "text-gray-300 hover:text-white hover:bg-slate-700/50 border-slate-700"
											}
										>
											{i + 1}
										</PaginationLink>
									</PaginationItem>
								))}

								<PaginationItem>
									<PaginationNext
										onClick={() =>
											setCurrentPage((prev) =>
												Math.min(totalPages, prev + 1)
											)
										}
										className={`text-gray-300 hover:text-white hover:bg-slate-700/50 border-slate-700 ${
											currentPage === totalPages
												? "pointer-events-none opacity-50"
												: ""
										}`}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</div>

			<div className="col-span-1">
				<Card className="h-full bg-slate-800/30 backdrop-blur-sm text-white border-white/10">
					<div className="p-6 flex flex-col h-full">
						<h2 className="text-xl font-semibold mb-6">
							Configuration
						</h2>

						<Button
							className="w-full bg-slate-700/50 hover:bg-slate-700/70 text-white mb-6"
							size="lg"
							onClick={() => setIsAddModalOpen(true)}
						>
							<Plus className="mr-2 h-5 w-5" />
							Add Device
						</Button>

						<div className="space-y-4">
							<div className="p-4 bg-slate-700/20">
								<h3 className="text-sm font-medium mb-3">
									Statistics
								</h3>
								<div className="space-y-2">
									<p className="text-sm text-gray-300">
										Total Devices: {devices.length}
									</p>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<AddDeviceModal
				roomId={roomId}
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onDeviceAdded={handleDeviceAdded}
			/>
		</div>
	);
}
