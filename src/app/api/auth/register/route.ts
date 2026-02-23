import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword, generateToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, password, company_name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const password_hash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password_hash,
                company_name
            }
        });

        const token = generateToken({ id: user.id, email: user.email });

        const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
