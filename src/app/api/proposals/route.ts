import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = "cm0testuser000000000001";

async function ensureDefaultUser() {
    let user = await prisma.user.findUnique({ where: { id: DEFAULT_USER_ID } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                id: DEFAULT_USER_ID,
                email: "test@example.com",
                password_hash: "hashed",
                company_name: "Test Agency",
            }
        });
    }
    return user;
}

export async function GET() {
    try {
        const proposals = await prisma.proposal.findMany({
            orderBy: { createdAt: "desc" },
            include: { lineItems: true }
        });
        return NextResponse.json(proposals);
    } catch (error) {
        console.error("GET Proposals Error:", error);
        return NextResponse.json({ error: "Failed to fetch proposals." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await ensureDefaultUser();

        const body = await req.json();
        const { client_name, raw_input, refined_markdown, status, total_amount, lineItems } = body;

        const proposal = await prisma.proposal.create({
            data: {
                user_id: DEFAULT_USER_ID,
                client_name: client_name || "New Client",
                raw_input: raw_input || "",
                refined_markdown: refined_markdown || "",
                status: status || "Draft",
                total_amount: total_amount || 0,
                lineItems: {
                    create: lineItems || []
                }
            },
            include: { lineItems: true }
        });

        return NextResponse.json(proposal, { status: 201 });
    } catch (error) {
        console.error("POST Proposal Error:", error);
        return NextResponse.json({ error: "Failed to create proposal." }, { status: 500 });
    }
}
