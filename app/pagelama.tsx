"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Brain,
  FileText,
  GraduationCap,
  Briefcase,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Upload,
  Zap,
  Target,
  BookOpen,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Animated counter hook                                                 */
/* ------------------------------------------------------------------ */
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

/* ------------------------------------------------------------------ */
/* Typewriter hook                                                        */
/* ------------------------------------------------------------------ */
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplay(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) {
            setTimeout(() => setDeleting(true), pause);
          } else {
            setCharIndex((c) => c + 1);
          }
        } else {
          setDisplay(current.slice(0, charIndex - 1));
          if (charIndex - 1 === 0) {
            setDeleting(false);
            setWordIndex((w) => (w + 1) % words.length);
            setCharIndex(0);
          } else {
            setCharIndex((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return display;
}

/* ------------------------------------------------------------------ */
/* Orbit animation dots (decorative hero background)                    */
/* ------------------------------------------------------------------ */
function FloatingOrb({
  size,
  color,
  top,
  left,
  delay,
}: {
  size: number;
  color: string;
  top: string;
  left: string;
  delay: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        top,
        left,
        filter: "blur(60px)",
        opacity: 0.25,
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: "none",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Skill tag pill                                                         */
/* ------------------------------------------------------------------ */
function SkillPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 14px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        background: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Animated step number                                                  */
/* ------------------------------------------------------------------ */
function StepNumber({ n }: { n: number }) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        background: "linear-gradient(135deg, #4f80ff 0%, #60c2ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        boxShadow: "0 8px 24px rgba(59,110,248,0.35)",
      }}
    >
      {n}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                              */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const jobCount = useCounter(123, 1800, statsVisible);
  const resumeCount = useCounter(2400, 1800, statsVisible);
  const matchRate = useCounter(94, 1400, statsVisible);

  const typeword = useTypewriter(
    ["Data Analyst", "UX Designer", "Cloud Engineer", "Product Manager", "ML Engineer"],
    75,
    2200
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Sora', sans-serif;
          background: #f8fbff;
          color: #0f172a;
          overflow-x: hidden;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-24px) scale(1.04); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        @keyframes pulse-ring {
          0%   { transform: scale(0.94); opacity: 0.8; }
          70%  { transform: scale(1.06); opacity: 0; }
          100% { transform: scale(1.06); opacity: 0; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes giftBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px) scale(1.02); }
        }

        @keyframes ribbonWave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2px); }
        }

        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }

        .gift-sparkle {
          animation: sparkleTwinkle 1.8s ease-in-out infinite;
        }

        .fade-up {
          animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          filter: blur(6px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.7s cubic-bezier(0.22,1,0.36,1);
          will-change: opacity, transform, filter;
        }

        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1;
            transform: none;
            filter: none;
            transition: none;
          }
        }

        .nav-link {
          color: #48658f;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
          letter-spacing: 0.02em;
        }
        .nav-link:hover { color: #0f172a; }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #4f80ff 0%, #60c2ff 100%);
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 8px 28px rgba(79,128,255,0.4);
          letter-spacing: 0.01em;
        }
        .cta-primary:hover { opacity: 0.9; transform: translateY(-2px); }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          background: rgba(15,23,42,0.05);
          color: #0f172a;
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          border: 1px solid rgba(148,163,184,0.18);
          transition: background 0.2s, transform 0.2s;
        }
        .cta-secondary:hover { background: rgba(15,23,42,0.08); transform: translateY(-2px); }

        .feature-card {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(148,163,184,0.18);
          border-radius: 20px;
          padding: 32px 28px;
          transition: border-color 0.3s, transform 0.3s;
          box-shadow: 0 18px 50px rgba(15,23,42,0.06);
        }
        .feature-card:hover {
          border-color: rgba(79,128,255,0.5);
          transform: translateY(-4px);
        }

        .step-card {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(148,163,184,0.18);
          border-radius: 20px;
          padding: 36px 32px;
          transition: border-color 0.3s;
          box-shadow: 0 18px 50px rgba(15,23,42,0.06);
        }
        .step-card:hover { border-color: rgba(96,194,255,0.4); }

        .stat-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(148,163,184,0.16);
          border-radius: 16px;
          padding: 28px 32px;
          box-shadow: 0 14px 40px rgba(15,23,42,0.05);
        }

        .cursor-blink {
          animation: blink 1s step-end infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #4f80ff 50%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(79,128,255,0.1);
          color: #2457c5;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(59,110,248,0.18);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(148,163,184,0.35), transparent);
          margin: 0;
          border: none;
        }
      `}</style>

      <main style={{ minHeight: "100vh" }}>

        {/* ── Navbar ── */}
        <nav style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(148,163,184,0.18)",
          background: "rgba(248,251,255,0.9)",
          backdropFilter: "blur(20px)",
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 28px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="/logo-skillbridge.png"
                alt="SkillBridge logo"
                width={36}
                height={36}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  objectFit: "cover",
                  boxShadow: "0 4px 12px rgba(79,128,255,0.25)",
                }}
              />
              <span style={{ fontWeight: 700, fontSize: 17, color: "#0f172a", letterSpacing: "-0.01em" }}>
                SkillBridge
              </span>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <a href="#how-it-works" className="nav-link">How It Works</a>
              <a href="#features" className="nav-link">Features</a>
              <a href="#stats" className="nav-link">About</a>
            </div>

            <Link href="/upload" className="cta-primary" style={{ padding: "10px 22px", fontSize: 14 }}>
              Upload CV
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section style={{ position: "relative", overflow: "hidden", paddingBottom: 80 }}>
          {/* Background orbs */}
          <FloatingOrb size={600} color="#4f80ff" top="-10%" left="-15%" delay={0} />
          <FloatingOrb size={500} color="#60c2ff" top="10%" left="55%" delay={2} />
          <FloatingOrb size={400} color="#4dd0ff" top="50%" left="30%" delay={4} />

          {/* Grid pattern overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(180deg, transparent, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 70%, transparent)",
          }} />

          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "96px 28px 64px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
            position: "relative",
          }}>
            {/* Left copy */}
            <div className="fade-up" data-reveal>
              <div className="section-label" style={{ marginBottom: 24 }}>
                <Sparkles size={13} />
                AI-Powered Career Intelligence
              </div>

              <h1 style={{
                fontSize: 58,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                  color: "#0f172a",
                marginBottom: 20,
              }}>
                Bridge Your Skills<br />
                To Your<br />
                <span className="gradient-text">
                  {typeword || "\u00A0"}
                  <span className="cursor-blink" style={{ color: "#60c2ff" }}>|</span>
                </span>
              </h1>

              <p style={{
                fontSize: 17,
                  color: "#48658f",
                lineHeight: 1.7,
                maxWidth: 460,
                marginBottom: 36,
              }}>
                Upload your CV and receive personalized career recommendations,
                skill gap analysis, and tailored learning paths — powered by AI.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
                <Link href="/upload" className="cta-primary">
                  <Upload size={17} />
                  Upload CV — It&apos;s Free
                </Link>
              </div>

              {/* Inline trust signals */}
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", gap: -8 }}>
                  {["#4f80ff","#60c2ff","#4dd0ff","#5dd6ff"].map((c, i) => (
                    <div key={i} style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: c,
                      border: "2px solid #f8fbff",
                      marginLeft: i === 0 ? 0 : -10,
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "#48658f" }}>
                  <span style={{ color: "#0f172a", fontWeight: 600 }}>2,400+</span> professionals matched this month
                </p>
              </div>
            </div>

            {/* Right — Empty Space */}
            <div className="fade-up" style={{ animationDelay: "0.15s" }}></div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" style={{ padding: "100px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }} data-reveal>
              <div className="section-label" style={{ marginBottom: 16, display: "inline-flex" }}>
                <Zap size={13} />
                Simple 3-Step Process
              </div>
              <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.1 }}>
                How It Works
              </h2>
              <p style={{ marginTop: 14, color: "#48658f", fontSize: 16, maxWidth: 480, margin: "14px auto 0" }}>
                From resume to roadmap in minutes. No account required.
              </p>
            </div>

            {/* Steps — vertical + horizontal connector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, position: "relative" }}>
              {/* Connector line */}
              <div style={{
                position: "absolute",
                top: 60,
                left: "calc(16.66% + 24px)",
                right: "calc(16.66% + 24px)",
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(79,128,255,0.4) 20%, rgba(96,194,255,0.4) 80%, transparent)",
              }} />

              {[
                {
                  n: 1,
                  icon: <Upload size={26} color="#60a5fa" />,
                  title: "Upload Your CV",
                  desc: "Drop in your PDF or DOCX resume. We support all formats and parse instantly.",
                },
                {
                  n: 2,
                  icon: <Brain size={26} color="#93c8ff" />,
                  title: "AI Analyzes Skills",
                  desc: "Our NLP engine extracts your skills, experience, and education from the document.",
                },
                {
                  n: 3,
                  icon: <GraduationCap size={26} color="#5dd6ff" />,
                  title: "Get Your Roadmap",
                  desc: "Receive career matches, skill gap reports, and a personalized learning plan.",
                },
              ].map(({ n, icon, title, desc }) => (
                <div key={n} className="step-card" data-reveal style={{ animationDelay: `${(n - 1) * 120}ms` }}>
                  <StepNumber n={n} />
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "rgba(248,251,255,0.9)",
                    border: "1px solid rgba(148,163,184,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "20px 0 16px",
                  }}>
                    {icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 10, letterSpacing: "-0.01em" }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#48658f", lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider-line" />

        {/* ── Features ── */}
        <section id="features" style={{ padding: "100px 0" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ marginBottom: 64 }} data-reveal>
              <div className="section-label" style={{ marginBottom: 16 }}>
                <Sparkles size={13} />
                Core Capabilities
              </div>
              <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", lineHeight: 1.1, maxWidth: 480 }}>
                Everything You Need to Level Up
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              {[
                {
                  icon: <Brain size={24} color="#60a5fa" />,
                  color: "#60a5fa",
                  title: "Resume Parser",
                  desc: "Extracts skills, education, and experience automatically using state-of-the-art NLP models.",
                  bullets: ["PDF & DOCX support", "Multi-language parsing", "Experience timeline"],
                },
                {
                  icon: <Briefcase size={24} color="#93c8ff" />,
                  color: "#93c8ff",
                  title: "Career Matching",
                  desc: "Matches your profile against thousands of active job market roles with a percentage fit score.",
                  bullets: ["Real-time job data", "Industry-specific roles", "Salary benchmarks"],
                },
                {
                  icon: <Target size={24} color="#57b6ff" />,
                  color: "#57b6ff",
                  title: "Skill Gap Analysis",
                  desc: "Pinpoints exactly which skills are missing for your target role, ranked by market demand.",
                  bullets: ["In-demand skills map", "Priority ranking", "Certifications guide"],
                },
                {
                  icon: <BookOpen size={24} color="#5dd6ff" />,
                  color: "#5dd6ff",
                  title: "Learning Path",
                  desc: "Curated step-by-step course recommendations from top platforms to fill your gaps fast.",
                  bullets: ["Coursera & Udemy links", "Time estimates", "Free resources first"],
                },
              ].map(({ icon, color, title, desc, bullets }) => (
                <div key={title} className="feature-card" data-reveal style={{ animationDelay: `${bullets.length * 30}ms` }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}>
                    {icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 10, letterSpacing: "-0.01em" }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#48658f", lineHeight: 1.65, marginBottom: 18 }}>
                    {desc}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {bullets.map((b) => (
                      <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle2 size={14} color={color} />
                        <span style={{ fontSize: 13, color: "#48658f" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={{ padding: "60px 28px 100px" }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            borderRadius: 28,
              background: "linear-gradient(135deg, #eef5ff 0%, #f8fbff 50%, #eaf4ff 100%)",
            border: "1px solid rgba(79,128,255,0.25)",
            padding: "72px 64px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Glow blobs inside CTA */}
            <div style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "#4f80ff",
              filter: "blur(100px)",
              opacity: 0.15,
              top: "50%",
              left: "20%",
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "#60c2ff",
              filter: "blur(80px)",
              opacity: 0.15,
              top: "50%",
              right: "15%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative" }} data-reveal>
              <div className="section-label" style={{ marginBottom: 20, display: "inline-flex" }}>
                <Sparkles size={13} />
                Start For Free
              </div>
              <h2 style={{
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#0f172a",
                lineHeight: 1.1,
                marginBottom: 16,
              }}>
                Ready to Discover<br />
                <span className="gradient-text">Your Career Path?</span>
              </h2>
              <p style={{ fontSize: 16, color: "#48658f", marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
                Upload your CV today and let AI map your fastest route to the career you deserve.
              </p>
              <Link href="/upload" className="cta-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
                <Upload size={18} />
                Analyze My CV — Free
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: "1px solid rgba(148,163,184,0.18)",
          padding: "32px 28px",
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }} data-reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src="/logo-skillbridge.png"
                alt="SkillBridge logo"
                width={28}
                height={28}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  objectFit: "cover",
                  boxShadow: "0 4px 10px rgba(79,128,255,0.2)",
                }}
              />
              <span style={{ fontWeight: 600, fontSize: 14, color: "#48658f" }}>SkillBridge</span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              © 2026 SkillBridge — AI-Driven Career Path & Gap Analysis.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy","Terms","Contact"].map((l) => (
                <a key={l} href="#" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}