import React, { useState } from "react";

interface AuthModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
        const body = mode === "login" ? { email, password } : { email, password, company_name: companyName };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "An error occurred");
            } else {
                onSuccess();
            }
        } catch (err) {
            setError("Network error");
        }
        setLoading(false);
    };

    return (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
            <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "400px", position: "relative", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}>
                <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}>&times;</button>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#0f172a" }}>
                    {mode === "login" ? "Sign In" : "Create Account"}
                </h2>

                {error && <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "6px", fontSize: "0.875rem" }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {mode === "register" && (
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#334155", marginBottom: "0.25rem" }}>Company Name (Optional)</label>
                            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                        </div>
                    )}
                    <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#334155", marginBottom: "0.25rem" }}>Email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#334155", marginBottom: "0.25rem" }}>Password</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                    </div>
                    <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem", backgroundColor: "#2563eb", color: "white", borderRadius: "6px", border: "none", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
                        {loading ? "Please wait..." : (mode === "login" ? "Sign In" : "Register")}
                    </button>
                </form>

                <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "600", cursor: "pointer", padding: 0 }}>
                        {mode === "login" ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </div>
        </div>
    );
}
