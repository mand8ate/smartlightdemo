// app/api/iot/switchbot/devices/[deviceId]/status/route.ts
import axios from "axios";
import requestHeader from "@/lib/api/switchbot/requestHeader";
import { getAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { deviceId: string } }
) {
	const session = await getAuthSession();
	if (!session) {
		return new Response("Not authorized", { status: 401 });
	}

	const deviceId = params.deviceId;
	const headers = requestHeader();

	try {
		const response = await axios.get(
			`https://api.switch-bot.com/v1.1/devices/${deviceId}/status`,
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

		return NextResponse.json(response.data.body);
	} catch (error) {
		console.error("SwitchBot API Error:", error);
		return NextResponse.json(
			{ error: "Could not fetch device status" },
			{ status: 500 }
		);
	}
}
