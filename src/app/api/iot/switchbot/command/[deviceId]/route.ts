// app/api/iot/switchbot/command/[deviceId]/route.ts
import axios from "axios";
import requestHeader from "@/lib/api/switchbot/requestHeader";
import { getAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
	req: Request,
	{ params }: { params: { deviceId: string } }
) {
	const session = await getAuthSession();
	if (!session) {
		return new Response("Not authorized", { status: 401 });
	}

	const body = await req.json();
	const { command, parameter } = body;
	const deviceId = params.deviceId;
	const headers = requestHeader();

	try {
		const payload = {
			command,
			parameter: parameter || "default",
			commandType: "command",
		};

		const response = await axios.post(
			`https://api.switch-bot.com/v1.1/devices/${deviceId}/commands`,
			payload,
			{
				headers: {
					Authorization: headers.token,
					sign: headers.sign,
					nonce: headers.nonce,
					t: headers.t,
					"Content-Type": "application/json",
					"Content-Length": JSON.stringify(payload).length,
				},
			}
		);

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error sending command:", error);
		return NextResponse.json(
			{ error: "Could not send command" },
			{ status: 500 }
		);
	}
}
