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
import { RoomCard } from "@/components/rooms/RoomCard"; // Assuming you have a RoomCard component
import AddRoomModal from "@/components/rooms/AddRoomModal"; // Assuming you have an AddRoomModal component
import type { Room } from "@prisma/client";

interface RoomGridProps {
	locationId: string;
	initialRooms: Room[];
}

export default function RoomGrid({ locationId, initialRooms }: RoomGridProps) {
	const [rooms, setRooms] = useState<Room[]>(initialRooms);
	const [currentPage, setCurrentPage] = useState(1);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const roomsPerPage = 6;
	const totalPages = Math.ceil(rooms.length / roomsPerPage);

	const getCurrentRooms = () => {
		const start = (currentPage - 1) * roomsPerPage;
		return rooms.slice(start, start + roomsPerPage);
	};

	const handleRoomAdded = (newRoom: Room) => {
		setRooms((prev) => [...prev, newRoom]);
		const newTotalPages = Math.ceil((rooms.length + 1) / roomsPerPage);
		if (newTotalPages > totalPages) {
			setCurrentPage(newTotalPages);
		}
	};

	const handleRoomDeleted = (deletedId: string) => {
		setRooms((prevRooms) =>
			prevRooms.filter((room) => room.id !== deletedId)
		);

		const newTotalPages = Math.ceil((rooms.length - 1) / roomsPerPage);
		if (currentPage > newTotalPages && newTotalPages > 0) {
			setCurrentPage(newTotalPages);
		}
	};

	return (
		<div className="h-full w-full grid grid-cols-4 gap-4">
			<div className="col-span-3 flex flex-col">
				{rooms.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
						<p className="text-xl mb-2">No rooms added yet</p>
						<p className="text-sm">
							Add your first room in the configuration panel
						</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-4 flex-grow">
						{getCurrentRooms().map((room) => (
							<RoomCard
								key={room.id}
								room={room}
								onRoomDeleted={handleRoomDeleted}
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
							Add Room
						</Button>

						<div className="space-y-4">
							<div className="p-4 bg-slate-700/20">
								<h3 className="text-sm font-medium mb-3">
									Statistics
								</h3>
								<div className="space-y-2">
									<p className="text-sm text-gray-300">
										Total Rooms: {rooms.length}
									</p>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<AddRoomModal
				locationId={locationId}
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onRoomAdded={handleRoomAdded}
			/>
		</div>
	);
}
