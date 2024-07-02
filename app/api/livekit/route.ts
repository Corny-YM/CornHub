import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { AccessToken } from "livekit-server-sdk";

import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    const url = new URL(req.url);
    const room = url.searchParams.get("room") as string;
    const username = url.searchParams.get("username") as string;

    if (!room) {
      return NextResponse.json(
        { error: 'Missing "room" query parameter' },
        { status: 400 }
      );
    } else if (!username) {
      return NextResponse.json(
        { error: 'Missing "username" query parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LK_SERVER_URL;

    if (!apiKey || !apiSecret || !wsUrl)
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );

    const at = new AccessToken(apiKey, apiSecret, { identity: username });

    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    return NextResponse.json({ token: await at.toJwt() });
  } catch (err) {
    console.log("[LIVEKIT_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
