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
  const command = body?.command;

  console.log(command);

  const headers = requestHeader();

  try {
    const payload = {
      command,
      parameter: "default",
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

    return new Response(JSON.stringify(response.data));
  } catch (error) {
    return new Response("Could not fetch devices", { status: 500 });
  }
}
