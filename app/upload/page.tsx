"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (
      droppedFile.type === "application/pdf" || 
      droppedFile.name.endsWith(".doc") || 
      droppedFile.name.endsWith(".docx")
    )) {
      setFile(droppedFile);
    } else {
      alert("Format file tidak didukung. Sediakan file PDF, DOC, atau DOCX.");
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload your resume first");
      return;
    }

    try {
      setLoading(true);
      setAnalysisStep("Uploading Resume");
      setUploadProgress(10);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) return prev;
          return prev + 5;
        });
      }, 250);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/analyze/full`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      setAnalysisStep("Extracting Skills");
      setUploadProgress(90);
      
      const responseData = await response.json();

      setAnalysisStep("Generating Learning Path");
      setUploadProgress(95);

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      setAnalysisStep("Analysis Complete");
      setUploadProgress(100);

      clearInterval(progressInterval);

      sessionStorage.setItem(
        "analysisResult",
        JSON.stringify(responseData)
      );

      setTimeout(() => {
        router.push("/analysis");
      }, 1200);

    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FBFF] px-6 py-20 font-sans">
      {/* Background Glow Premium */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-blue-300/20 to-indigo-300/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-300/20 to-blue-300/10 blur-[150px] pointer-events-none" />

      {/* Floating Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </button>

      <div className="relative z-10 max-w-6xl mx-auto mt-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-blue-600 shadow-sm tracking-wide uppercase mb-5">
            <Sparkles size={12} className="text-blue-500 animate-pulse" />
            AI Intelligence Report
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
            Upload Your Resume
          </h1>

          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Temukan peta jalur karir optimal, identifikasi kesenjangan keahlian teknis, dan dapatkan kurikulum rekomendasi belajar instan bertenaga AI.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="max-w-2xl mx-auto rounded-[32px] border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {/* Area Drop Zone Component */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                isDragging 
                  ? "border-blue-500 bg-blue-50/70 scale-[0.99]" 
                  : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/30"
              }`}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                <Upload size={28} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Pilih atau Seret Dokumen CV
              </h3>

              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
                Klik untuk menelusuri berkas dari komputer Anda atau jatuhkan file langsung di sini.
              </p>

              <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                Mendukung: PDF, DOC, DOCX
              </span>
            </div>
          ) : (
            /* Uploaded State Card */
            <div className="rounded-2xl bg-gradient-to-b from-blue-50/50 to-blue-50/10 border border-blue-100 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/20">
                <FileText size={26} />
              </div>

              <h3 className="font-bold text-slate-800 text-base">
                Resume Berhasil Diunggah
              </h3>

              <p className="text-sm font-medium text-blue-600 mt-1 truncate max-w-md mx-auto bg-white border border-blue-100/50 px-3 py-1 rounded-full shadow-sm">
                {file.name}
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="mt-4 text-xs text-slate-400 font-semibold uppercase tracking-wider hover:text-blue-600 hover:underline transition-colors disabled:opacity-50"
              >
                Ganti Dokumen File
              </button>
            </div>
          )}

          {/* Loading Progress Section */}
          {loading && (
            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/40 p-5 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  {analysisStep}...
                </span>
                <span className="text-sm font-extrabold text-blue-600">
                  {uploadProgress}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="h-2.5 w-100% overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              {/* Dynamic Checkpoints Indicator */}
              <div className="mt-5 pt-4 border-t border-blue-100/40 space-y-2.5">
                {[
                  { label: "Resume Uploaded", target: 20 },
                  { label: "Extracting Skills", target: 40 },
                  { label: "Matching Career Paths", target: 60 },
                  { label: "Building Learning Path", target: 80 },
                  { label: "Finalizing AI Report", target: 100 }
                ].map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-2.5 text-xs font-medium transition-colors ${
                    uploadProgress >= step.target ? "text-slate-800" : "text-slate-400"
                  }`}>
                    {uploadProgress >= step.target ? (
                      <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-slate-200 bg-white flex-shrink-0" />
                    )}
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit CTA Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="mt-6 w-full rounded-2xl py-4 font-bold text-sm tracking-wide text-white shadow-md transition-all duration-200 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-blue-400 hover:shadow-lg hover:shadow-blue-500/15 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Memproses Analisis CV Anda...
              </div>
            ) : (
              "Mulai Analisis Sekarang"
            )}
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-16 max-w-4xl mx-auto">
          {[
            { title: "Career Recommendation", desc: "Temukan alternatif jalur karir paling relevan dengan profil latar belakang pengalaman Anda." },
            { title: "Skill Gap Analysis", desc: "Identifikasi langsung kekurangan indikator skill teknis untuk mencapai standar posisi target." },
            { title: "Personalized Learning Path", desc: "Dapatkan penyusunan silabus pembelajaran terarah beserta pelengkap materi referensinya." }
          ].map((item, index) => (
            <div key={index} className="rounded-2xl bg-white border border-slate-200/60 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.01)] hover:border-slate-300 transition-colors">
              <h3 className="font-bold text-slate-800 text-sm mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}