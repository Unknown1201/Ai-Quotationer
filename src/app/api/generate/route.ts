import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const { rawNotes, tone } = await req.json();

        if (!rawNotes) {
            return NextResponse.json({ error: "rawNotes are required." }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // As per PRD
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

        return NextResponse.json({
            markdown: parsed.markdown?.trim() || "",
            lineItems: parsed.lineItems || []
        });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate proposal." }, { status: 500 });
    }
}
