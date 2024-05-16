import axios from "axios";
import requestHeader from "@/lib/api/switchbot/requestHeader";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session) {
    return new Response("Not authorized", { status: 401 });
  }

  const body = await req.json();
  const deviceId = body?.deviceId;

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

    return new Response(JSON.stringify(response.data));
  } catch (error) {
    return new Response("Could not fetch devices", { status: 500 });
  }
}
