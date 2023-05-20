import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { NextApiResponse } from "next";
import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const WebhookSecret = process.env.WEBHOOK_SECRET || ""

type EventType = "user.created" | "user.updated" | "user.deleted"

type Event = {
    data: Record<string, string>
    object: "event"
    type: EventType
}

export default async function handler(
    request: Request
) {
    const payload = await request.json()
    const headersList = headers()
    const heads = {
        "svix-id": headersList.get("svix-id"),
        "svix-timestamp": headersList.get("svix-timestamp"),
        "svix-signature": headersList.get("svix-signature"),
    }
    
    const wh = new Webhook(WebhookSecret)
    let evt: Event | null = null

    try {
        evt = wh.verify(JSON.stringify(payload), heads as IncomingHttpHeaders & WebhookRequiredHeaders) as Event
    } catch (e) {
        console.log(e)
        return NextResponse.json({}, {status: 400})
    }


    const eventType: EventType = evt.type

    if (eventType === "user.created" || eventType === "user.updated") {
        const {id, email, firstName, lastName} = evt.data

        await prisma.user.upsert({
            where: {id: id},
            create: {
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
            },
            update: {
                email: email,
                firstName: firstName,
                lastName: lastName,
            }
        })
    }
}   

export const GET = handler
export const POST = handler
export const PUT = handler
