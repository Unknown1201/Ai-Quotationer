import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { rawNotes, tone } = await req.json();

        if (!rawNotes) {
            return NextResponse.json({ error: "rawNotes are required." }, { status: 400 });
        }

        let apiKeyToUse = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
        let isAnon = true;
        let userId = null;

        const token = req.cookies.get("auth_token")?.value;
        if (token) {
            const decoded: any = verifyToken(token);
            if (decoded && decoded.id) {
                isAnon = false;
                userId = decoded.id;
            }
        }

        if (isAnon) {
            let anonCount = parseInt(req.cookies.get("anon_count")?.value || "0");
            if (anonCount >= 3) {
                return NextResponse.json({ error: "Free limit reached. Please log in or create an account to get 3 more!" }, { status: 403 });
            }
        } else {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (user?.custom_api_key) {
                apiKeyToUse = user.custom_api_key;
            } else {
                if (user && user.generation_count >= 3) {
                    return NextResponse.json({ error: "Usage limit reached. Please add your own Gemini API key in settings for unlimited access." }, { status: 403 });
                }
                if (user) {
                    await prisma.user.update({
                        where: { id: userId },
                        data: { generation_count: { increment: 1 } }
                    });
                }
            }
        }

        const genAI = new GoogleGenerativeAI(apiKeyToUse);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a professional business consultant. Take the following raw notes and format them into a structured business proposal. Follow these rules strictly:
        1. Use ${tone || "Professional"} tone.
        2. Generate a structured JSON response containing TWO keys: "markdown" and "lineItems".
        3. The "markdown" key should contain the proposal string formatted in valid Markdown with sections: Executive Summary, Detailed Scope, and Technical Stack. Do not include pricing in the markdown.
        4. The "lineItems" key should contain an array of objects, where each object has "description" (string), "quantity" (number), and "unit_price" (number). Extract any measurable costs or features from the notes. If none exist, provide a sensible default line item for the service described.

    Raw Notes:
    ${rawNotes}`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const response = await result.response;
        let text = response.text();

        let parsed = { markdown: "", lineItems: [] };
        try {
            parsed = JSON.parse(text);
        } catch (e) {
            console.error("JSON parse error from Gemini", e);
            return NextResponse.json({ error: "Failed to parse AI output." }, { status: 500 });
        }

        const responseJson = NextResponse.json({
            markdown: parsed.markdown?.trim() || "",
            lineItems: parsed.lineItems || []
        });

        if (isAnon) {
            let anonCount = parseInt(req.cookies.get("anon_count")?.value || "0");
            responseJson.cookies.set("anon_count", (anonCount + 1).toString(), { maxAge: 60 * 60 * 24 * 365, path: "/" });
        }

        return responseJson;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate proposal or Invalid API Key." }, { status: 500 });
    }
}
