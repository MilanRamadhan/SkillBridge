"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Target,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Award,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle,
} from "lucide-react";

/* ── Category colors ─────────────────────────────────────────── */
const CAT_COLORS: Record<string, string> = {
  programming: "#3b82f6",
  data:        "#10b981",
  cloud:       "#06b6d4",
  tools:       "#8b5cf6",
  soft_skills: "#ec4899",
  default:     "#3b82f6",
};

/* ── Kamus Data Edukasi Dinamis (Fail-safe Peningkat Kualitas Konten) ── */
const SKILL_EDUCATION_MAP: Record<string, {
  description: string;
  duration: string;
  level: string;
  topics: string[];
}> = {
  scrum: {
    description: "Metodologi manajemen proyek agile untuk membantu tim berkolaborasi secara adaptif, melakukan iterasi cepat (sprint), dan menghasilkan produk berkualitas tinggi.",
    duration: "4 - 6 Jam",
    level: "Pemula sampai Menengah",
    topics: ["Prinsip Dasar Agile & Scrum Framework", "Peran Scrum Master, Product Owner, & Tim", "Manajemen Sprint & Backlog Refinement", "Daily Standup & Retrospective"],
  },
  python: {
    description: "Bahasa pemrograman serbaguna yang sangat populer untuk kebutuhan data science, otomatisasi sistem, hingga pengembangan kecerdasan buatan.",
    duration: "12 - 15 Jam",
    level: "Pemula",
    topics: ["Sintaksis & Struktur Data Dasar", "Pemrograman Berorientasi Objek (OOP)", "Manipulasi Data menggunakan Pandas & NumPy", "Integrasi API Eksternal"],
  },
  "machine learning": {
    description: "Cabang kecerdasan buatan yang berfokus pada pengembangan sistem yang mampu belajar secara mandiri dari data tanpa pemrograman eksplisit.",
    duration: "20+ Jam",
    level: "Lanjutan",
    topics: ["Supervised vs Unsupervised Learning", "Regresi Linier & Klasifikasi Data", "Evaluasi Model & Tuning Hyperparameter", "Deployment Model Menggunakan Flask/FastAPI"],
  },
  default: {
    description: "Kompetensi industri terintegrasi yang sangat direkomendasikan untuk menunjang performa karier serta menutup kesenjangan keahlian target profesi Anda.",
    duration: "3 - 5 Jam",
    level: "Semua Tingkat",
    topics: ["Konsep Dasar Komprehensif", "Studi Kasus & Implementasi Industri", "Praktik Terbaik (Best Practices)", "Evaluasi & Pengujian Kemampuan"],
  },
};

/* ── Pill ────────────────────────────────────────────────────── */
function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 500,
      background: `${color}10`,
      color: color,
      border: `1px solid ${color}25`,
    }}>
      {label}
    </span>
  );
}

/* ── Section badge ───────────────────────────────────────────── */
function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 14px",
      borderRadius: 999,
      background: "rgba(59, 130, 246, 0.08)",
      color: "#1e40af",
      fontSize: 12,
      fontWeight: 600,
      border: "1px solid rgba(59, 130, 246, 0.15)",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      marginBottom: 16,
    }}>
      {icon}{children}
    </div>
  );
}

/* ── Elegant Card ────────────────────────────────────────────── */
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 24,
      boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.04)",
      padding: 32,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Card header ─────────────────────────────────────────────── */
function CardHeader({ icon, color, title, subtitle, badge }: {
  icon: React.ReactNode; color: string;
  title: string; subtitle?: string; badge?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: `${color}12`, border: `1px solid ${color}25`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", letterSpacing: "-0.01em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {badge && (
        <span style={{
          marginLeft: "auto", padding: "4px 12px", borderRadius: 999,
          background: "#f1f5f9", color: "#475569", fontSize: 12, fontWeight: 600,
          border: "1px solid #e2e8f0", whiteSpace: "nowrap",
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function AnalysisPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("analysisResult");
    if (data) {
      setResult(JSON.parse(data));
    }
  }, []);

  if (!result || !result.data) return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: "#f8fbff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <p style={{ color: "#48658f", marginBottom: 24, fontWeight: 500 }}>Tidak ada data analisis ditemukan.</p>
          <Link href="/upload" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14,
            background: "linear-gradient(135deg, #3b82f6, #60a5fa)", color: "#fff", fontWeight: 600, textDecoration: "none",
            boxShadow: "0 10px 25px rgba(59,130,246,0.25)",
          }}>
            <ArrowLeft size={16} /> Upload CV Kembali
          </Link>
        </div>
      </div>
    </>
  );

  const apiData = result.data;
  const { resume_parse, job_matches, gap_analysis, learning_recommendations } = apiData;

  const userSkills: string[] = resume_parse?.extracted_skills ?? [];
  const skillsByCategory: Record<string, string[]> = resume_parse?.skills_by_category ?? {};
  const missingSkills: string[] = gap_analysis?.missing_skills ?? [];
  const jobs = job_matches?.matches ?? [];
  const recommendations = learning_recommendations?.recommendations ?? [];
  const skillsNotCovered: string[] = learning_recommendations?.skills_not_covered ?? [];
  const hasCats = Object.values(skillsByCategory).some((v: any) => v.length > 0);

  const getCareerTitle = (job: any) => {
    const rawTitle = typeof job?.job_title === "string" ? job.job_title.trim() : "";
    if (!rawTitle || /^\d+$/.test(rawTitle) || /^job\s*#?\d+$/i.test(rawTitle)) return "Recommended Career";
    return rawTitle;
  };

  const learningItems = [
    ...recommendations,
    ...skillsNotCovered.map((skill: string) => ({ skill, resources: [] }))
  ];

  const topMatch = jobs.length > 0 ? Math.round((jobs[0].combined_score ?? jobs[0].match_score_tfidf ?? 0) * 100) : 0;

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
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }} className="btn-secondary">
            <ArrowLeft size={15} /> Upload CV baru
          </Link>
        </div>
      </nav>

      <main style={{ minHeight: "100vh", background: "#f8fbff", paddingBottom: 80 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 0" }}>

          {/* ── Page Header ── */}
          <div style={{ marginBottom: 36 }}>
            <Badge icon={<Sparkles size={13} />}>AI Intelligence Report</Badge>
            <h1 style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Resume Analysis
            </h1>
            <p style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>Berikut adalah peta kekuatan skill Anda dan peluang karir berdasarkan analisis kecerdasan buatan.</p>
          </div>

          {/* ── TOP STATS ROW ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}><Target size={22} /></div>
              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Total Skill Terdeteksi</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>{userSkills.length} Skills</div>
              </div>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}><TrendingUp size={22} /></div>
              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Kecocokan Kerja Tertinggi</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981", marginTop: 2 }}>{topMatch}% Match</div>
              </div>
            </div>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "24px", borderRadius: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}><AlertTriangle size={22} /></div>
              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Skill yang Perlu Dikejar</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b", marginTop: 2 }}>{missingSkills.length} Gaps</div>
              </div>
            </div>
          </div>

          {/* ── SPLIT LAYOUT ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24, alignItems: "start" }}>

            {/* KOLOM KIRI: Fokus ke Kekuatan Skill Internal Anda */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <Card>
                <CardHeader
                  icon={<Award size={20} color="#3b82f6" />}
                  color="#3b82f6"
                  title="Skillset Profil Anda"
                  subtitle="Daftar kompetensi yang berhasil diekstrak dari dokumen resume Anda."
                  badge={`${userSkills.length} Terdeteksi`}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {hasCats ? (
                    Object.entries(skillsByCategory).map(([cat, skills]: [string, any]) => {
                      if (!skills.length) return null;
                      const col = CAT_COLORS[cat] ?? CAT_COLORS.default;
                      return (
                        <div key={cat} style={{ background: "#f8fafc", padding: "20px", borderRadius: 16, border: "1px solid #f1f5f9" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: col }}></span>
                            {cat.replace(/_/g, " ")}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {skills.map((sk: string) => <Pill key={sk} label={sk} color={col} />)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {userSkills.map((sk: string) => <Pill key={sk} label={sk} color="#3b82f6" />)}
                    </div>
                  )}
                </div>
              </Card>

              {/* Card Skill Gap */}
              {missingSkills.length > 0 && (
                <Card style={{ background: "linear-gradient(180deg, #ffffff 0%, #fffbeb 100%)", border: "1px solid #fde68a" }}>
                  <CardHeader
                    icon={<AlertTriangle size={20} color="#d97706" />}
                    color="#d97706"
                    title="Analisis Kesenjangan (Skill Gap)"
                    subtitle="Kompetensi krusial industri yang belum terdeteksi di CV Anda."
                    badge={`${missingSkills.length} Perlu Dipelajari`}
                  />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {missingSkills.map((sk: string) => <Pill key={sk} label={sk} color="#d97706" />)}
                  </div>
                </Card>
              )}
            </div>

            {/* KOLOM KANAN: Rekomendasi Karir & Jalur Pembelajaran Berwujud Silabus */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Career Recommendations */}
              {jobs.length > 0 && (
                <Card>
                  <CardHeader
                    icon={<Briefcase size={20} color="#8b5cf6" />}
                    color="#8b5cf6"
                    title="Rekomendasi Karir Teratas"
                    subtitle="Peluang profesi yang paling cocok dengan profil Anda saat ini."
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {jobs.slice(0, 5).map((job: any, i: number) => {
                      const pct = Math.round((job.combined_score ?? job.match_score_tfidf ?? 0) * 100);
                      const barColor = pct >= 60 ? "#10b981" : pct >= 40 ? "#3b82f6" : "#f59e0b";
                      return (
                        <div key={i} className="job-item" style={{
                          padding: "18px", borderRadius: 16, background: "#ffffff", border: "1px solid #e2e8f0",
                          display: "flex", flexDirection: "column", gap: 12, transition: "all 0.2s ease"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{getCareerTitle(job)}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: barColor, background: `${barColor}10`, padding: "4px 10px", borderRadius: 8 }}>{pct}% Match</div>
                          </div>
                          <div style={{ width: "100%" }}>
                            <div style={{ width: "100%", height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 999 }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* SILABUS KURIKULUM PEMBELAJARAN ELEGAN */}
              {learningItems.length > 0 && (
                <Card>
                  <CardHeader
                    icon={<BookOpen size={20} color="#06b6d4" />}
                    color="#06b6d4"
                    title="Kurikulum Pembelajaran"
                    subtitle="Rekomendasi silabus komprehensif untuk meningkatkan daya tawar CV."
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {learningItems.map((item: any, i: number) => {
                      const normalizedSkill = item.skill.toLowerCase().trim();
                      const eduInfo = SKILL_EDUCATION_MAP[normalizedSkill] || SKILL_EDUCATION_MAP.default;

                      return (
                        <div key={i} style={{
                          padding: "24px",
                          borderRadius: 18,
                          border: "1px solid #e2e8f0",
                          background: "#ffffff",
                          boxShadow: "0 4px 12px rgba(15,23,42,0.02)",
                        }}>
                          {/* Nama Judul Modul Utama */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", textTransform: "capitalize" }}>
                              📚 Kompetensi: {item.skill}
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#06b6d4", background: "rgba(6,182,212,0.08)", padding: "4px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                                <Clock size={12} /> {eduInfo.duration}
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#6366f1", background: "rgba(99,102,241,0.08)", padding: "4px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                                <Layers size={12} /> {eduInfo.level}
                              </span>
                            </div>
                          </div>

                          {/* Deskripsi Pembelajaran Panjang */}
                          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 16, background: "#f8fafc", padding: "12px 16px", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                            {eduInfo.description}
                          </p>

                          {/* Pokok Bahasan / Materi Utama */}
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>
                              Materi Utama Pembelajaran:
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {eduInfo.topics.map((topic, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                  <CheckCircle size={14} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
                                  <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.4 }}>{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ── Global Styles ───────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { 
        font-family: 'Sora', sans-serif; 
        background: #f8fbff; 
        color: #0f172a; 
        overflow-x: hidden; 
        -webkit-font-smoothing: antialiased;
      }
      .job-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 20px -8px rgba(0,0,0,0.05);
        border-color: #cbd5e1 !important;
      }
      .btn-secondary:hover {
        background: #f1f5f9 !important;
        border-color: #94a3b8 !important;
      }
    `}</style>
  );
}