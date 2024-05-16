import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export default function requestHeader() {
  const token = process.env.SWITCHBOT_TOKEN;
  const secret = process.env.SWITCHBOT_SECRET;
  const t = Date.now();
  const nonce = uuidv4();
  const data = token! + t + nonce;
  const signTerm = crypto
    .createHmac("sha256", secret!)
    .update(Buffer.from(data, "utf-8"))
    .digest();
  const sign = signTerm.toString("base64");

  const requestHeaders = {
    token,
    secret,
    t,
    nonce,
    sign,
  };

  return requestHeaders;
}
