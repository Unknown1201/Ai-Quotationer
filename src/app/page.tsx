"use client";

import { useEffect, useState } from "react";
import LiveEditor from "@/components/LiveEditor";
import AuthModal from "@/components/AuthModal";
import SettingsModal from "@/components/SettingsModal";

export default function Home() {
  const [view, setView] = useState<"landing" | "dashboard" | "editor">("landing");
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
        if (view === "landing") setView("dashboard");
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setProposals([]);
    setView("landing");
  };

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
    fetchUser();
  }, []);

  useEffect(() => {
    if (view === "dashboard") fetchProposals();
  }, [view]);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: view === "landing" ? "#f8fafc" : "#ffffff" }}>
      {/* Navigation Header */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: view === "landing" ? "0 1px 3px 0 rgb(0 0 0 / 0.1)" : "none",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }} onClick={() => setView(user ? "dashboard" : "landing")}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #2563eb, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "1.25rem" }}>P</div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", margin: 0, letterSpacing: "-0.025em" }}>Proposal<span style={{ color: "#2563eb" }}>AI</span></h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.875rem", color: "#334155" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#64748b" }}>
                  {(user.company_name || user.email).charAt(0).toUpperCase()}
                </div>
                <strong>{user.company_name || user.email}</strong>
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {view !== "dashboard" && <button onClick={() => setView("dashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "500", color: "#475569" }}>Dashboard</button>}
                <button onClick={() => setShowSettings(true)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "500", color: "#475569" }}>Settings</button>
                <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "500" }}>Logout</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setShowAuth(true)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "600", color: "#475569" }}>Log in</button>
              <button onClick={() => setShowAuth(true)} style={{ padding: "0.5rem 1.25rem", backgroundColor: "#0f172a", color: "white", borderRadius: "9999px", border: "none", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }}>Sign up</button>
            </div>
          )}

          {view !== "editor" && (
            <button
              onClick={() => setView("editor")}
              style={{ padding: "0.5rem 1.25rem", background: "linear-gradient(135deg, #2563eb, #8b5cf6)", color: "white", borderRadius: "9999px", border: "none", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 6px -1px rgb(37 99 235 / 0.3)" }}>
              + New Proposal
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ padding: view === "editor" ? "1rem 2rem" : "2rem", maxWidth: view === "editor" ? "100%" : "1200px", margin: "0 auto" }}>

        {view === "landing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: "4rem", animation: "fadeIn 0.5s ease-out" }}>
            <div style={{ display: "inline-block", padding: "0.25rem 1rem", backgroundColor: "#e0e7ff", color: "#4338ca", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: "600", marginBottom: "1.5rem" }}>
              ✨ Meet Your New Automated Sales Team
            </div>
            <h2 style={{ fontSize: "4rem", fontWeight: "800", color: "#0f172a", lineHeight: "1.1", letterSpacing: "-0.025em", marginBottom: "1.5rem", maxWidth: "800px" }}>
              Win more clients.<br />
              <span style={{ color: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #2563eb, #8b5cf6)" }}>Write zero proposals.</span>
            </h2>
            <p style={{ fontSize: "1.25rem", color: "#64748b", maxWidth: "600px", marginBottom: "2.5rem", lineHeight: "1.6" }}>
              Drop in your messy discovery call notes. We instantly generate a professional, branded PDF proposal with calculated line items.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setView("editor")} style={{ padding: "1rem 2rem", backgroundColor: "#0f172a", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "1.125rem", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}>
                Start Generating for Free
              </button>
              <button onClick={() => setShowAuth(true)} style={{ padding: "1rem 2rem", backgroundColor: "white", color: "#0f172a", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer", fontWeight: "600", fontSize: "1.125rem" }}>
                Create Account
              </button>
            </div>

            {/* Feature preview */}
            <div style={{ marginTop: "5rem", width: "100%", maxWidth: "1000px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "white", padding: "2rem", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", textAlign: "left" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#0f172a" }}>From messy notes...</h3>
                <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", color: "#64748b", fontFamily: "monospace", fontSize: "0.875rem", minHeight: "200px" }}>
                  client wants new website.<br />
                  ecommerce maybe?<br />
                  needs a logo.<br />
                  they have 5k budget.<br />
                  wants it done in 4 wks.
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#0f172a" }}>...To stunning PDFs</h3>
                <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #cbd5e1", color: "#334155", minHeight: "200px" }}>
                  <div style={{ fontWeight: "bold", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>Project Overview</div>
                  <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>We propose a comprehensive eCommerce solution tailored to your rapid 4-week timeline, ensuring maximum engagement...</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: "600", borderTop: "1px solid #e2e8f0", paddingTop: "0.5rem" }}>
                    <span>Estimated Total:</span>
                    <span>$5,000.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "dashboard" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#0f172a" }}>Your Lead Pipeline</h2>
            {isLoading ? (
              <div style={{ color: "#64748b", padding: "2rem", textAlign: "center" }}>Loading proposals...</div>
            ) : proposals.length === 0 ? (
              <div style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "white", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e293b", margin: "0 0 0.5rem 0" }}>No proposals yet</h3>
                <p style={{ color: "#64748b", margin: "0 0 1.5rem 0" }}>Create your first proposal to start closing deals faster.</p>
                <button onClick={() => setView("editor")} style={{ padding: "0.75rem 1.5rem", backgroundColor: "#0f172a", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}>
                  + Create New Proposal
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
                {proposals.map(p => (
                  <div key={p.id} style={{ padding: "1.5rem", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.2s", cursor: "pointer" }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                        <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a", fontWeight: "bold" }}>{p.client_name}</h3>
                        <span style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: "600", backgroundColor: p.status === "Draft" ? "#fef3c7" : p.status === "Sent" ? "#dbeafe" : "#dcfce3", color: p.status === "Draft" ? "#92400e" : p.status === "Sent" ? "#1e40af" : "#166534" }}>
                          {p.status}
                        </span>
                      </div>
                      <p style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0 0 1rem 0", letterSpacing: "-0.025em" }}>${p.total_amount.toFixed(2)}</p>
                      <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5" }}>
                        {p.raw_input || "No notes provided"}
                      </p>
                    </div>
                    <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#94a3b8" }}>
                      <span>Last edited {new Date(p.updatedAt).toLocaleDateString()}</span>
                      <button style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "600", cursor: "pointer", padding: 0 }}>View</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "editor" && (
          <div style={{ animation: "fadeIn 0.3s ease-out" }}>
            <LiveEditor />
          </div>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); fetchUser(); fetchProposals(); }} />}
      {showSettings && user && <SettingsModal onClose={() => setShowSettings(false)} hasCustomKey={user.has_custom_key} generationCount={user.generation_count} initialAverageRate={user.average_rate} onUpdate={fetchUser} />}
    </main>
  );
}
