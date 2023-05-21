import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { IncomingHttpHeaders } from "http";
import { NextRequest, NextResponse } from "next/server";
import { UserJSON } from "@clerk/nextjs/dist/server";
import prisma from "@/lib/prisma";

const WebhookSecret = process.env.WEBHOOK_SECRET || ""

type EventType = "user.created" | "user.updated" | "user.deleted"

type Event = {
    data: UserJSON
    object: "event"
    type: EventType
}

async function handler(
    request: NextRequest,
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
        console.error((e as Error).message)
        return NextResponse.json({}, {status: 400})
    }


    const eventType: EventType = evt.type

    if (eventType === "user.created" || eventType === "user.updated") {
        const {id, first_name, last_name} = evt.data
        const email_address = evt.data.email_addresses[0].email_address

        await prisma.user.upsert({
            where: {id: id as string},
            create: {
                id: id as string,
                firstName: first_name as string,
                lastName: last_name as string,
                email: email_address as string
                
            },
            update: {
                firstName: first_name as string,
                lastName: last_name as string,
            }
        })
    } else if (eventType === "user.deleted") {
        console.log("User deleted")
    }

    return NextResponse.json({})
}   

export const GET = handler
export const POST = handler
export const PUT = handler
