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
  CheckCircle2,
} from "lucide-react";

/* ── Category colors ─────────────────────────────────────────── */
const CAT_COLORS: Record<string, string> = {
  programming: "#60a5fa",
  data:        "#34d399",
  cloud:       "#5dd6ff",
  tools:       "#a78bfa",
  soft_skills: "#f472b6",
  default:     "#93c8ff",
};

/* ── Pill ────────────────────────────────────────────────────── */
function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 999,
      fontSize: 13, fontWeight: 500,
      background: `${color}18`, color, border: `1px solid ${color}35`,
    }}>
      {label}
    </span>
  );
}

/* ── Section badge ───────────────────────────────────────────── */
function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "6px 14px", borderRadius: 999,
      background: "rgba(79,128,255,0.1)", color: "#2457c5",
      fontSize: 12, fontWeight: 600,
      border: "1px solid rgba(59,110,248,0.18)",
      letterSpacing: "0.05em", textTransform: "uppercase",
      marginBottom: 16,
    }}>
      {icon}{children}
    </div>
  );
}

/* ── Glass card ──────────────────────────────────────────────── */
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(148,163,184,0.18)",
      borderRadius: 20,
      boxShadow: "0 18px 50px rgba(15,23,42,0.06)",
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
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "#64748b" }}>{subtitle}</div>}
      </div>
      {badge && (
        <span style={{
          marginLeft: "auto", padding: "3px 10px", borderRadius: 999,
          background: "rgba(79,128,255,0.1)", color: "#2457c5",
          fontSize: 12, fontWeight: 600, border: "1px solid rgba(59,110,248,0.15)",
          whiteSpace: "nowrap",
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function AnalysisPage() {
  const [result, setResult]       = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("analysisResult");
    if (data) {
      const parsed = JSON.parse(data);
      setResult(parsed);
    }
  }, []);

  /* ── Empty ── */
  if (!result || !result.data) return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: "#f8fbff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <p style={{ color: "#48658f", marginBottom: 24 }}>Tidak ada data analisis ditemukan.</p>
          <Link href="/upload" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 12,
            background: "linear-gradient(135deg,#4f80ff,#60c2ff)",
            color: "#fff", fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(79,128,255,0.35)",
          }}>
            <ArrowLeft size={16} /> Upload CV dulu
          </Link>
        </div>
      </div>
    </>
  );

  const apiData = result?.data ?? result;

const {
  resume_parse,
  job_matches,
  gap_analysis,
  learning_recommendations,
} = apiData;

  const userSkills: string[]                       = resume_parse?.extracted_skills ?? [];
  const skillsByCategory: Record<string, string[]> = resume_parse?.skills_by_category ?? {};
  const missingSkills: string[]                    = gap_analysis?.missing_skills ?? [];
  const jobs                                       = job_matches?.matches ?? [];
  const recommendations                            = learning_recommendations?.recommendations ?? [];
  const skillsNotCovered: string[]                 = learning_recommendations?.skills_not_covered ?? [];
  const hasCats = Object.values(skillsByCategory).some((v: any) => v.length > 0);

  const getCareerTitle = (job: any) => {
    const rawTitle = typeof job?.job_title === "string" ? job.job_title.trim() : "";
    if (!rawTitle) return "Recommended Career";

    const normalized = rawTitle.toLowerCase();
    const looksNumericPlaceholder =
      /^\d+$/.test(normalized) ||
      /^job\s*#?\d+$/.test(normalized) ||
      /^career\s*#?\d+$/.test(normalized);

    if (looksNumericPlaceholder) return "Recommended Career";

    return rawTitle;
  };

  const learningItems = [
    ...recommendations,
    ...skillsNotCovered.map((skill: string) => ({
      skill,
      resources: [],
    })),
  ];

  return (
    <>
      <GlobalStyles />

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(148,163,184,0.18)",
        background: "rgba(248,251,255,0.92)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo-skillbridge.png" alt="SkillBridge" width={34} height={34}
              style={{ borderRadius: 10, boxShadow: "0 4px 12px rgba(79,128,255,0.25)", objectFit: "cover" }} />
            <span style={{ fontWeight: 700, fontSize: 17, color: "#0f172a", letterSpacing: "-0.01em" }}>SkillBridge</span>
          </div>
          <Link href="/upload" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "9px 20px", borderRadius: 12,
            border: "1px solid rgba(148,163,184,0.25)",
            background: "rgba(15,23,42,0.04)",
            color: "#0f172a", fontSize: 14, fontWeight: 500, textDecoration: "none",
          }}>
            <ArrowLeft size={15} /> Upload CV baru
          </Link>
        </div>
      </nav>

      <main style={{ minHeight: "100vh", background: "#f8fbff", fontFamily: "Sora,sans-serif" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 28px 64px" }}>

          {/* ── Page header ── */}
          <div style={{ marginBottom: 28 }}>
            <Badge icon={<Sparkles size={13} />}>Hasil Analisis</Badge>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 8 }}>
              Resume Analysis
            </h1>
          </div>

          {/* ── Split layout ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

            {/* ══════════════════════════
                LEFT — Skills + Job matches
            ══════════════════════════ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Skills dari CV */}
              <Card style={{ padding: "26px 26px 22px" }}>
                <CardHeader
                  icon={<Target size={18} color="#60a5fa" />}
                  color="#60a5fa"
                  title="Skill Kamu"
                  subtitle={`${userSkills.length} skill terdeteksi dari CV`}
                  badge={`${userSkills.length} skill`}
                />
                {hasCats ? (
                  Object.entries(skillsByCategory).map(([cat, skills]: [string, any]) => {
                    if (!skills.length) return null;
                    const col = CAT_COLORS[cat] ?? CAT_COLORS.default;
                    return (
                      <div key={cat} style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
                          {cat.replace(/_/g, " ")}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {skills.map((sk: string) => <Pill key={sk} label={sk} color={col} />)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {userSkills.map((sk: string) => <Pill key={sk} label={sk} color="#60a5fa" />)}
                  </div>
                )}
              </Card>

              {/* Job matches */}
              {jobs.length > 0 && (
                <Card style={{ padding: "26px 26px 22px" }}>
                  <CardHeader
                    icon={<Briefcase size={18} color="#a78bfa" />}
                    color="#a78bfa"
                    title="Career Recommendations"
                    subtitle="Recommended careers based on your CV"
                    badge={`${jobs.length} careers`}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {jobs.slice(0, 5).map((job: any, i: number) => {
                      const pct = Math.round(
                        (job.combined_score ??
                          job.match_score_tfidf ??
                          0) * 100
                      );

                      const barColor =
                        pct >= 70
                          ? "#34d399"
                          : pct >= 50
                          ? "#60a5fa"
                          : "#f59e0b";

                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "16px",
                            borderRadius: 16,
                            background: "#fff",
                            border:
                              "1px solid rgba(148,163,184,0.14)",
                            transition: "all .2s ease",
                          }}
                        >
                          {/* Score */}
                          <div
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: 14,
                              flexShrink: 0,
                              background: `${barColor}18`,
                              border: `1px solid ${barColor}30`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 700,
                              color: barColor,
                            }}
                          >
                            {pct}%
                          </div>

                          {/* Career Info */}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#0f172a",
                                marginBottom: 4,
                              }}
                            >
                              {getCareerTitle(job)}
                            </div>

                            <div
                              style={{
                                fontSize: 13,
                                color: "#64748b",
                                marginBottom: 10,
                              }}
                            >
                              Recommended based on your
                              skills profile
                            </div>

                            <div
                              style={{
                                width: "100%",
                                height: 6,
                                background:
                                  "rgba(148,163,184,0.15)",
                                borderRadius: 999,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: "100%",
                                  background: barColor,
                                  borderRadius: 999,
                                }}
                              />
                            </div>
                          </div>

                          {/* Match Label */}
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: barColor,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Match
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>

            {/* ══════════════════════════
                RIGHT — Skill gap + Learning path
            ══════════════════════════ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Skill gap */}
              {missingSkills.length > 0 && (
                <Card style={{ padding: "26px 26px 22px", background: "linear-gradient(135deg,rgba(251,191,36,0.05) 0%,rgba(255,255,255,0.95) 100%)", border: "1px solid rgba(251,191,36,0.22)" }}>
                  <CardHeader
                    icon={<AlertTriangle size={18} color="#f59e0b" />}
                    color="#f59e0b"
                    title="Skill yang Perlu Dipelajari"
                    subtitle="Skill yang belum ada di CV kamu"
                    badge={`${missingSkills.length} skill`}
                  />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {missingSkills.map((sk: string) => <Pill key={sk} label={sk} color="#f59e0b" />)}
                  </div>
                </Card>
              )}

              {/* Learning path */}
              {learningItems.length > 0 && (
                <Card style={{ padding: "26px 26px 22px" }}>
                  <CardHeader
                    icon={<BookOpen size={18} color="#5dd6ff" />}
                    color="#5dd6ff"
                    title="Learning Path"
                    subtitle="Rekomendasi kursus dari IBM SkillsBuild"
                    badge={`${learningItems.length} skill`}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {learningItems.map((item: any, i: number) => (
                      <div key={i} style={{
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid rgba(148,163,184,0.16)",
                        background: "rgba(248,251,255,0.65)",
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                          {item.skill}
                        </div>
                      </div>
                    ))}
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

/* ── Global styles ───────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Sora', sans-serif; background: #f8fbff; color: #0f172a; overflow-x: hidden; }
    `}</style>
  );
}
