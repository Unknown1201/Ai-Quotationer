import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const decoded: any = verifyToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                company_name: true,
                logo_url: true,
                custom_api_key: true,
                generation_count: true,
                average_rate: true
            }
        });

        if (!user) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
                company_name: user.company_name,
                logo_url: user.logo_url,
                has_custom_key: !!user.custom_api_key,
                generation_count: user.generation_count,
                average_rate: user.average_rate
            }
        });
    } catch (error) {
        return NextResponse.json({ authenticated: false, error: "Server error" }, { status: 500 });
    }
}
