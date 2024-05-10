import { User } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user }: { user: User } = body;

    if (!user || !user.email) {
      return new NextResponse("User email is required", { status: 400 });
    }

    const { last_sign_in } = user;

    const data = await prisma.user.upsert({
      where: { email: user.email },
      // Update the user if it exists
      update: { last_sign_in },
      // Create a new user if it doesn't exist
      create: user,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.log("[USERS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
