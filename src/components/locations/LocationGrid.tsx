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
import { LocationCard } from "@/components/locations/LocationCard";
import AddLocationModal from "@/components/locations/AddLocationModal";
import type { Location, Room } from "@prisma/client";

type LocationWithRooms = Location & {
	rooms: Room[];
};

interface LocationGridProps {
	initialLocations: LocationWithRooms[];
}

export default function LocationGrid({ initialLocations }: LocationGridProps) {
	const [locations, setLocations] =
		useState<LocationWithRooms[]>(initialLocations);
	const [currentPage, setCurrentPage] = useState(1);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const locationsPerPage = 6;
	const totalPages = Math.ceil(locations.length / locationsPerPage);

	const getCurrentLocations = () => {
		const start = (currentPage - 1) * locationsPerPage;
		return locations.slice(start, start + locationsPerPage);
	};

	const handleLocationAdded = (newLocation: LocationWithRooms) => {
		setLocations((prev) => [...prev, newLocation]);
		const newTotalPages = Math.ceil(
			(locations.length + 1) / locationsPerPage
		);
		if (newTotalPages > totalPages) {
			setCurrentPage(newTotalPages);
		}
	};

	const handleLocationDeleted = (deletedId: string) => {
		setLocations((prevLocations) =>
			prevLocations.filter((location) => location.id !== deletedId)
		);

		const newTotalPages = Math.ceil(
			(locations.length - 1) / locationsPerPage
		);
		if (currentPage > newTotalPages && newTotalPages > 0) {
			setCurrentPage(newTotalPages);
		}
	};

	return (
		<div className="h-full w-full grid grid-cols-4 gap-4">
			<div className="col-span-3 flex flex-col">
				{locations.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
						<p className="text-xl mb-2">No locations added yet</p>
						<p className="text-sm">
							Add your first location in the configuration panel
						</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-4 flex-grow">
						{getCurrentLocations().map((location) => (
							<LocationCard
								key={location.id}
								location={location}
								onLocationDeleted={handleLocationDeleted}
							/>
						))}
					</div>
				)}

				{totalPages > 1 ? (
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
										className={`text-gray-300 hover:text-white hover:bg-slate-700/50 border-slate-700
                                            ${
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
										className={`text-gray-300 hover:text-white hover:bg-slate-700/50 border-slate-700
                                            ${
												currentPage === totalPages
													? "pointer-events-none opacity-50"
													: ""
											}`}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				) : null}
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
							Add Location
						</Button>

						<div className="space-y-4">
							<div className="p-4 bg-slate-700/20">
								<h3 className="text-sm font-medium mb-3">
									Statistics
								</h3>
								<div className="space-y-2">
									<p className="text-sm text-gray-300">
										Total Locations: {locations.length}
									</p>
									<p className="text-sm text-gray-300">
										Total Rooms:{" "}
										{locations.reduce(
											(sum, loc) =>
												sum + loc.rooms.length,
											0
										)}
									</p>
									<p className="text-sm text-gray-300">
										Total Devices:{" "}
										{locations.reduce(
											(sum, loc) =>
												sum + loc.rooms.length,
											0
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<AddLocationModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onLocationAdded={handleLocationAdded}
			/>
		</div>
	);
}
