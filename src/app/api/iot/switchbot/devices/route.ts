import axios from "axios";
import requestHeader from "@/lib/api/switchbot/requestHeader";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const session = await getAuthSession();
	if (!session) {
		return new Response("Not authorized", { status: 401 });
	}

	try {
		const registeredDevices = await db.device.findMany({
			select: {
				deviceId: true,
			},
		});
		const registeredDeviceIds = new Set(
			registeredDevices.map((d) => d.deviceId)
		);

		const headers = requestHeader();

		const response = await axios.get(
			"https://api.switch-bot.com/v1.1/devices",
			{
				headers: {
					Authorization: headers.token,
					sign: headers.sign,
					nonce: headers.nonce,
					t: headers.t,
					"Content-Type": "application/json",
				},
			}
		);

		const physicalDevices = (response.data.body.deviceList || []).filter(
			(device: any) =>
				device.deviceType !== "Hub Mini" &&
				!registeredDeviceIds.has(device.deviceId)
		);

		const infraredDevices = (
			response.data.body.infraredRemoteList || []
		).filter((device: any) => !registeredDeviceIds.has(device.deviceId));

		console.log("phys", physicalDevices);
		console.log("infr", infraredDevices);

		return NextResponse.json({
			statusCode: 200,
			body: {
				physicalDevices,
				infraredDevices,
			},
		});
	} catch (error) {
		console.error("Error fetching devices:", error);
		return NextResponse.json(
			{ error: "Could not fetch devices" },
			{ status: 500 }
		);
	}
}
