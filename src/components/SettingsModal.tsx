import React, { useState } from "react";

interface SettingsModalProps {
    onClose: () => void;
    hasCustomKey: boolean;
    generationCount: number;
    onUpdate: () => void;
}

export default function SettingsModal({ onClose, hasCustomKey, generationCount, onUpdate, initialAverageRate }: SettingsModalProps & { initialAverageRate?: number | null }) {
    const [apiKey, setApiKey] = useState("");
    const [averageRate, setAverageRate] = useState(initialAverageRate?.toString() || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/auth/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ custom_api_key: apiKey, average_rate: averageRate })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage("Settings updated successfully!");
                onUpdate();
                setTimeout(() => onClose(), 1500);
            } else {
                setMessage(data.error || "Failed to save settings");
            }
        } catch (err) {
            setMessage("Network error");
        }
        setLoading(false);
    };

    return (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px", position: "relative", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}>
                <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}>&times;</button>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#0f172a" }}>Account Settings</h2>

                <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "#334155" }}>Usage Stats</h3>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem" }}>
                        Generations used: <strong style={{ color: "#0f172a" }}>{generationCount} / 3</strong>
                        {!hasCustomKey && generationCount >= 3 && (
                            <span style={{ color: "#b91c1c", marginLeft: "0.5rem" }}>(Limit Reached)</span>
                        )}
                    </p>
                </div>

                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#334155", marginBottom: "0.5rem" }}>
                            Custom Gemini API Key
                        </label>
                        <input
                            type="password"
                            placeholder={hasCustomKey ? "••••••••••••••••••••••••" : "Enter a custom API key for unlimited generation"}
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        />
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.5rem" }}>
                            Your API key is stored securely in our database and used strictly for your generations. Leave blank to remove your custom key.
                        </p>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#334155", marginBottom: "0.5rem" }}>
                            Default Average Hourly Rate ($)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g. 50"
                            value={averageRate}
                            onChange={e => setAverageRate(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        />
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.5rem" }}>
                            This tells the AI exactly how to price your time when generating the proposal's Estimated Investment.
                        </p>
                    </div>

                    {message && <div style={{ padding: "0.75rem", backgroundColor: message.includes("success") ? "#dcfce3" : "#fef2f2", color: message.includes("success") ? "#166534" : "#991b1b", borderRadius: "6px", fontSize: "0.875rem" }}>{message}</div>}

                    <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem", backgroundColor: "#0f172a", color: "white", borderRadius: "6px", border: "none", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginTop: "1rem" }}>
                        {loading ? "Saving..." : "Save Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
}
