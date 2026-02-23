import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = verifyToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { custom_api_key } = await req.json();

        // Allow clearing the key if they send an empty string
        const updatedUser = await prisma.user.update({
            where: { id: decoded.id },
            data: { custom_api_key: custom_api_key || null }
        });

        return NextResponse.json({ success: true, has_custom_key: !!updatedUser.custom_api_key });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
