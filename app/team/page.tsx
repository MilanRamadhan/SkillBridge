"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, FolderGit2 } from "lucide-react";

// Data Anggota bersih hanya Nama, ID Pijak, dan Foto
const TEAM_MEMBERS = [
  {
    id: "APC322D6X0041",
    name: "Shafa Disya Aulia",
    image: "/images/shafa.jpeg",
  },
  {
    id: "APC322D6Y0042",
    name: "Muhammad Milan Ramadhan Mulizar",
    image: "/images/milan.jpeg",
  },
  {
    id: "APC322D6X0408",
    name: "Bunga Rasikhah Haya",
    image: "/images/bunga.jpeg",
  },
  {
    id: "APC322D6X0427",
    name: "Maulizar",
    image: "/images/maulizar.jpeg",
  },
];

export default function TeamPage() {
  const router = useRouter();

  return (
    <>
      <GlobalStyles />
      
      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid #e2e8f0", background: "rgba(248,251,255,0.9)", backdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo-skillbridge.png" alt="SkillBridge" width={36} height={36} style={{ borderRadius: 10, objectFit: "cover" }} />
            <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", letterSpacing: "-0.02em" }}>SkillBridge</span>
          </div>
          <Link href="/upload" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12,
            border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155", fontSize: 14, fontWeight: 600, textDecoration: "none",
          }} className="btn-secondary">
            Mulai Analisis CV
          </Link>
        </div>
      </nav>

      <main style={{ minHeight: "100vh", background: "#f8fbff", padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          
          {/* Tombol Kembali */}
          <button
            onClick={() => router.back()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12,
              border: "1px solid #e2e8f0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600,
              cursor: "pointer", marginBottom: 32
            }}
            className="btn-back"
          >
            <ArrowLeft size={15} /> Kembali
          </button>

          {/* Header ID Tim Capstone */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999,
              background: "rgba(59, 130, 246, 0.08)", color: "#1e40af", fontSize: 12, fontWeight: 600,
              border: "1px solid rgba(59, 130, 246, 0.15)", marginBottom: 16
            }}>
              <Users size={13} /> Profil Anggota Tim
            </div>
            
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 24 }}>
              Daftar Anggota Capstone Project
            </h1>

            {/* ID TIM CAPSTONE */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 28px", borderRadius: 20,
              background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#ffffff", border: "1px solid #334155",
            }}>
              <FolderGit2 size={20} style={{ color: "#3b82f6" }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", color: "#94a3b8", fontWeight: 600 }}>ID Tim Capstone Project</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", letterSpacing: "0.03em" }}>PJK-GM071</div>
              </div>
            </div>
          </div>

          {/* Grid Foto, Nama, ID Pijak */}
          <div style={{
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
            gap: 28, 
            marginTop: 40 
          }}>
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="team-card" style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 24,
                padding: "36px 24px",
                textAlign: "center",
                position: "relative"
              }}>
                {/* ID Pijak */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#3b82f6",
                    background: "rgba(59, 130, 246, 0.06)", padding: "6px 14px", borderRadius: 10,
                    border: "1px solid rgba(59, 130, 246, 0.1)"
                  }}>
                    {member.id}
                  </span>
                </div>

                {/* Foto Anggota */}
                <div style={{
                  width: 140, height: 140, borderRadius: "50%",
                  margin: "0 auto 20px", padding: 4,
                  background: "#e2e8f0"
                }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      // Cadangan visual instan berupa inisial huruf jika foto belum ditaruh di folder public/images
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=3b82f6`;
                    }}
                    style={{
                      width: "100%", height: "100%", borderRadius: "50%",
                      objectFit: "cover", background: "#ffffff"
                    }} 
                  />
                </div>

                {/* Nama Anggota */}
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", lineHeight: 1.4 }}>
                  {member.name}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}

/* ── Style CSS Minimalis ── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { 
        font-family: 'Sora', sans-serif; 
        background: #f8fbff; 
        color: #0f172a;
      }
      .team-card {
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .team-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(15,23,42,0.05);
      }
      .btn-back:hover {
        background: #f8fafc !important;
      }
      .btn-secondary:hover {
        background: #f1f5f9 !important;
      }
    `}</style>
  );
}