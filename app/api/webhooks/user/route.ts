import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { NextApiResponse } from "next";

const WebhookSecret = process.env.WEBHOOK_SECRET


export default async function handler(
    req: NextApiRequestWithSvixRequiredHeaders,
    res: NextApiResponse
) {

}   

