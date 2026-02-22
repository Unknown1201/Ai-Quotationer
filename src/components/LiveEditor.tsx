"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import LineItemCalculator, { LineItem } from "./LineItemCalculator";
import { ThemeType } from "./PDFPreview";

// Dynamically import PDFViewer to avoid SSR issues
const PDFPreview = dynamic(() => import("./PDFPreview"), {
    ssr: false,
    loading: () => <div style={{ height: "600px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", borderRadius: "8px" }}>Loading PDF Preview...</div>
});

const THEMES: { label: string; value: ThemeType }[] = [
    { label: "Corporate", value: "corporate" },
    { label: "Creative", value: "creative" },
    { label: "Minimal", value: "minimal" }
];

export default function LiveEditor() {
    const [clientName, setClientName] = useState("");
    const [rawNotes, setRawNotes] = useState("");
    const [markdown, setMarkdown] = useState("*Proposal content will appear here...*");
    const [theme, setTheme] = useState<ThemeType>("corporate");
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [status, setStatus] = useState("Draft");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savedProposalId, setSavedProposalId] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!rawNotes.trim()) return alert("Please enter client notes first.");
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rawNotes, tone: theme })
            });
            const data = await res.json();
            if (data.markdown) {
                setMarkdown(data.markdown);
                if (data.lineItems && Array.isArray(data.lineItems) && data.lineItems.length > 0) {
                    setLineItems(data.lineItems);
                    const total = data.lineItems.reduce((sum: number, item: LineItem) => sum + (item.quantity * item.unit_price), 0);
                    setTotalAmount(total);
                }
            } else {
                alert(data.error || "Failed to generate");
            }
        } catch (err) {
            alert("Error generating proposal");
        }
        setIsGenerating(false);
    };

    const handleSave = async (newStatus?: string) => {
        setIsSaving(true);
        const saveStatus = newStatus || status;
        setStatus(saveStatus);

        const payload = {
            client_name: clientName || "Untitled Client",
            raw_input: rawNotes,
            refined_markdown: markdown,
            status: saveStatus,
            total_amount: totalAmount,
            lineItems: lineItems
        };

        try {
            let res;
            if (savedProposalId) {
                res = await fetch(`/api/proposals/${savedProposalId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch("/api/proposals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.id) setSavedProposalId(data.id);
            }

            if (!res.ok) throw new Error("API returned an error");
        } catch (err) {
            alert("Failed to save proposal.");
        }
        setIsSaving(false);
    };

    return (
        <div style={{ display: "flex", gap: "2rem", flexDirection: "row", height: "calc(100vh - 100px)" }}>

            {/* Left Column: Editor & Controls */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem", overflowY: "auto", paddingRight: "1rem" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem", color: "#475569" }}>Client Name</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="E.g., Acme Corp..."
                            style={{ padding: "0.5rem", width: "300px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: "600", color: status === "Draft" ? "#ca8a04" : status === "Sent" ? "#2563eb" : "#16a34a" }}>
                            Status: {status}
                        </span>
                        <button disabled={isSaving} onClick={() => handleSave()} style={{ padding: "0.5rem 1rem", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: isSaving ? "not-allowed" : "pointer", fontWeight: "500" }}>
                            {isSaving ? "Saving..." : "Save Draft"}
                        </button>
                        <button onClick={() => handleSave("Sent")} style={{ padding: "0.5rem 1rem", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>
                            Mark as Sent
                        </button>
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem", color: "#475569" }}>
                        1. Messy Client Notes
                    </label>
                    <textarea
                        value={rawNotes}
                        onChange={(e) => setRawNotes(e.target.value)}
                        placeholder="Paste your raw discovery call notes here..."
                        style={{ width: "100%", height: "120px", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "vertical", fontFamily: "inherit" }}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !rawNotes}
                        style={{ marginTop: "0.5rem", padding: "0.75rem 1.5rem", backgroundColor: "#10b981", color: "white", borderRadius: "6px", border: "none", cursor: (isGenerating || !rawNotes) ? "not-allowed" : "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", opacity: (isGenerating || !rawNotes) ? 0.7 : 1 }}>
                        {isGenerating ? "✨ Generating with AI..." : "✨ Generate Proposal"}
                    </button>
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem", color: "#475569" }}>
                        2. Edit Markdown (Live Preview)
                    </label>
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        style={{ width: "100%", height: "250px", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", resize: "vertical", fontFamily: "monospace", fontSize: "0.875rem" }}
                    />
                </div>

                <LineItemCalculator
                    items={lineItems.length > 0 ? lineItems : [{ description: "", quantity: 1, unit_price: 0 }]}
                    onItemsChange={(items, total) => {
                        setLineItems(items);
                        setTotalAmount(total);
                    }}
                />

                <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#475569" }}>
                        3. Brand Template
                    </label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        {THEMES.map((t) => (
                            <label key={t.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.5rem 1rem", border: "1px solid", borderColor: theme === t.value ? "#3b82f6" : "#cbd5e1", borderRadius: "6px", backgroundColor: theme === t.value ? "#eff6ff" : "white" }}>
                                <input
                                    type="radio"
                                    name="theme"
                                    value={t.value}
                                    checked={theme === t.value}
                                    onChange={() => setTheme(t.value as ThemeType)}
                                />
                                <span style={{ fontWeight: theme === t.value ? "600" : "400", color: theme === t.value ? "#1d4ed8" : "#334155" }}>{t.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: PDF Preview */}
            <div style={{ flex: 1, position: "sticky", top: "1rem", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem", color: "#1e293b" }}>PDF Preview</h3>
                <PDFPreview
                    theme={theme}
                    clientName={clientName}
                    markdown={markdown}
                    lineItems={lineItems}
                    totalAmount={totalAmount}
                />
            </div>

        </div>
    );
}
