"use client";
import React, { useState, useEffect } from "react";

export default function TimeDate() {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="text-white">
			<div className="text-2xl font-bold">
				{currentTime.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</div>
			<div className="text-sm text-gray-400">
				{currentTime.toLocaleDateString([], {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</div>
		</div>
	);
}
