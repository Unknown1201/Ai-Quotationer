import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const proposal = await prisma.proposal.findUnique({
            where: { id },
            include: { lineItems: true }
        });

        if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(proposal);
    } catch (error) {
        console.error("GET Proposal Error:", error);
        return NextResponse.json({ error: "Failed to fetch proposal." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updatedData: any = { ...body };
        const lineItemsArray = updatedData.lineItems;
        delete updatedData.lineItems;
        delete updatedData.id;
        delete updatedData.createdAt;
        delete updatedData.updatedAt;
        delete updatedData.user_id;

        if (lineItemsArray) {
            await prisma.lineItem.deleteMany({ where: { proposal_id: id } });
            updatedData.lineItems = {
                create: lineItemsArray.map(({ id: _id, proposal_id, createdAt, updatedAt, ...rest }: any) => rest)
            };
        }

        const proposal = await prisma.proposal.update({
            where: { id },
            data: updatedData,
            include: { lineItems: true }
        });

        return NextResponse.json(proposal);
    } catch (error) {
        console.error("PUT Proposal Error:", error);
        return NextResponse.json({ error: "Failed to update proposal." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.proposal.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE Proposal Error:", error);
        return NextResponse.json({ error: "Failed to delete proposal." }, { status: 500 });
    }
}
