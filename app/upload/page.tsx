"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { data } from "framer-motion/m";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");

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
      "http://localhost:8000/api/v1/analyze/full",
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
    <main className="relative min-h-screen overflow-hidden bg-[#F8FBFF] px-6 py-24">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-400/20 blur-[140px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-white px-4 py-2 text-sm text-blue-600 shadow-sm mb-6">
            Resume Analysis
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Upload Your Resume
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Discover your career path, identify skill gaps,
            and receive a personalized learning roadmap
            powered by AI.
          </p>
        </div>

        {/* Upload Card */}
        <div
          className="
            max-w-3xl
            mx-auto
            rounded-[32px]
            border
            border-slate-200/70
            bg-white/90
            backdrop-blur-xl
            p-8 md:p-10
            shadow-[0_18px_50px_rgba(15,23,42,0.06)]
          "
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          {!file ? (
            <div
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="
                cursor-pointer
                rounded-3xl
                border-2
                border-dashed
                border-blue-200
                p-14
                text-center
                transition-all
                hover:border-[#4F80FF]
                hover:bg-blue-50/50
              "
            >
              <Upload
                size={52}
                className="mx-auto mb-4 text-[#4F80FF]"
              />

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Upload Resume
              </h3>

              <p className="text-slate-500">
                Drag & drop your resume or click to browse
              </p>

              <p className="text-sm text-slate-400 mt-2">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-blue-50 border border-blue-100 p-8 text-center">
              <FileText
                size={56}
                className="mx-auto mb-4 text-[#4F80FF]"
              />

              <h3 className="font-semibold text-slate-900">
                Resume Uploaded
              </h3>

              <p className="text-slate-600 mt-2">
                {file.name}
              </p>

              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mt-4 text-sm text-blue-600 font-medium hover:underline"
              >
                Change File
              </button>
            </div>
          )}

          {loading && (
  <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50/80 p-6">
    <div className="flex justify-between mb-3">
      <span className="font-medium text-slate-700">
        {analysisStep}
      </span>

      <span className="font-semibold text-[#4F80FF]">
        {uploadProgress}%
      </span>
    </div>

    <div className="h-3 overflow-hidden rounded-full bg-blue-100">
      <div
        className="
          h-full
          rounded-full
          bg-gradient-to-r
          from-[#4F80FF]
          to-[#60C2FF]
          transition-all
          duration-500
        "
        style={{
          width: `${uploadProgress}%`,
        }}
      />
    </div>

    <div className="mt-5 space-y-3">
      <div className="flex items-center gap-2 text-sm">
        {uploadProgress >= 20 ? (
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
        ) : (
          <div className="h-4 w-4 rounded-full border" />
        )}
        Resume Uploaded
      </div>

      <div className="flex items-center gap-2 text-sm">
        {uploadProgress >= 40 ? (
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
        ) : (
          <div className="h-4 w-4 rounded-full border" />
        )}
        Extracting Skills
      </div>

      <div className="flex items-center gap-2 text-sm">
        {uploadProgress >= 60 ? (
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
        ) : (
          <div className="h-4 w-4 rounded-full border" />
        )}
        Matching Career Paths
      </div>

      <div className="flex items-center gap-2 text-sm">
        {uploadProgress >= 80 ? (
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
        ) : (
          <div className="h-4 w-4 rounded-full border" />
        )}
        Building Learning Path
      </div>

      <div className="flex items-center gap-2 text-sm">
        {uploadProgress >= 100 ? (
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
        ) : (
          <div className="h-4 w-4 rounded-full border" />
        )}
        Finalizing Report
      </div>
    </div>
  </div>
)}
          {/* CTA Button */}
          <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="
            mt-8
            w-full
            rounded-2xl
            py-4
            font-semibold
            text-white
            transition-all
            shadow-lg
            hover:scale-[1.01]
            hover:shadow-xl
            disabled:opacity-60
            disabled:cursor-not-allowed
            bg-gradient-to-r
            from-[#4F80FF]
            to-[#60C2FF]
          "
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2
                size={18}
                className="animate-spin"
              />
              AI is analyzing your resume...
            </div>
          ) : (
            "Analyze Resume"
          )}
        </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white/80 backdrop-blur border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Career Recommendation
            </h3>

            <p className="text-sm text-slate-600">
              Discover career paths that match your
              experience and skills.
            </p>
          </div>

          <div className="rounded-3xl bg-white/80 backdrop-blur border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Skill Gap Analysis
            </h3>

            <p className="text-sm text-slate-600">
              Identify missing skills required to reach
              your target role.
            </p>
          </div>

          <div className="rounded-3xl bg-white/80 backdrop-blur border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Learning Path
            </h3>

            <p className="text-sm text-slate-600">
              Get curated learning resources and
              actionable recommendations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}