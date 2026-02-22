"use client";

import { useEffect, useState } from "react";
import LiveEditor from "@/components/LiveEditor";

export default function Home() {
  const [view, setView] = useState<"dashboard" | "editor">("dashboard");
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/proposals");
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (view === "dashboard") fetchProposals();
  }, [view]);

  return (
    <main style={{ padding: "2rem", maxWidth: "1600px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid #e2e8f0" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a", margin: 0 }}>AI Proposal Generator</h1>
          <p style={{ color: "#64748b", margin: "0.25rem 0 0 0" }}>Convert messy notes to polished bids in seconds.</p>
        </div>
        <button
          onClick={() => setView(view === "dashboard" ? "editor" : "dashboard")}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#0f172a", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
          {view === "dashboard" ? "+ Create New Proposal" : "← Back to Dashboard"}
        </button>
      </header>

      {view === "dashboard" ? (
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Recent Proposals (Lead Status)</h2>
          {isLoading ? (
            <div style={{ color: "#64748b" }}>Loading proposals...</div>
          ) : proposals.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", backgroundColor: "white", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
              <p style={{ color: "#64748b" }}>No proposals yet. Create your first one!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {proposals.map(p => (
                <div key={p.id} style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#1e293b", fontWeight: "600" }}>{p.client_name}</h3>
                      <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", borderRadius: "9999px", fontWeight: "600", backgroundColor: p.status === "Draft" ? "#fef3c7" : p.status === "Sent" ? "#dbeafe" : "#dcfce3", color: p.status === "Draft" ? "#92400e" : p.status === "Sent" ? "#1e40af" : "#166534" }}>
                        {p.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a", margin: "0 0 1rem 0" }}>${p.total_amount.toFixed(2)}</p>
                    <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.raw_input || "No notes provided"}
                    </p>
                  </div>
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#94a3b8" }}>
                    Last updated: {new Date(p.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <LiveEditor />
      )}
    </main>
  );
}
