import { useLocation, useNavigate, useParams } from "react-router-dom";
import ResumeAnalysisResult from "../components/ResumeAnalysisResult";
import { useEffect } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import SkeletonLoader from "../../../components/SkeletonLoader";
import { ArrowLeft, FileSearch, Sparkles, AlertCircle } from "lucide-react";
 
/* ─── STYLES (mirrored from Home + ResumeChecker) ───────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
 
  @keyframes drift {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(35px,-25px) scale(1.05); }
    66%  { transform: translate(-20px,35px) scale(.97); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position: 700px 0; }
  }
  @keyframes pulseRing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.15); }
    50%       { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
  }
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
 
  .a1 { animation: fadeUp .55s .05s ease both; }
  .a2 { animation: fadeUp .55s .14s ease both; }
  .a3 { animation: fadeUp .55s .24s ease both; }
 
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
 
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080706; }
  ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.3); border-radius: 10px; }
 
  .pulse-icon { animation: pulseRing 2.8s ease-in-out infinite; }
 
  /* skeleton shimmer bars */
  .skeleton-bar {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(245,158,11,0.07) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 700px 100%;
    animation: shimmer 1.8s infinite linear;
    border-radius: 8px;
  }
 
  /* dark-theme override for child analysis result component */
  .dark-result-override {
    color: #fef3c7;
  }
  .dark-result-override h1,
  .dark-result-override h2,
  .dark-result-override h3,
  .dark-result-override h4 {
    color: #fef3c7 !important;
  }
  .dark-result-override p,
  .dark-result-override li,
  .dark-result-override span {
    color: #a8a29e;
  }
  .dark-result-override .bg-white,
  .dark-result-override [class*="bg-gray"],
  .dark-result-override [class*="bg-slate"] {
    background-color: #100e0c !important;
    border-color: rgba(180,83,9,0.2) !important;
  }
  .dark-result-override [class*="border-gray"],
  .dark-result-override [class*="border-slate"] {
    border-color: rgba(180,83,9,0.2) !important;
  }
  .dark-result-override [class*="text-gray-900"],
  .dark-result-override [class*="text-slate-900"] {
    color: #fef3c7 !important;
  }
  .dark-result-override [class*="text-gray-600"],
  .dark-result-override [class*="text-gray-500"],
  .dark-result-override [class*="text-slate-500"],
  .dark-result-override [class*="text-slate-600"] {
    color: #78716c !important;
  }
`;
 
/* ─── DARK SKELETON ─────────────────────────────────────────────────────── */
const DarkSkeletonLoader = () => (
  <div className="a1 space-y-5">
    {/* header skeleton */}
    <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
      <div className="skeleton-bar mb-3 h-3 w-24 rounded" />
      <div className="skeleton-bar mb-4 h-8 w-64 rounded" />
      <div className="skeleton-bar h-4 w-full max-w-md rounded" />
      <div className="skeleton-bar mt-2 h-4 w-3/4 max-w-sm rounded" />
    </div>
 
    {/* content skeleton cards */}
    <div className="grid gap-5 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6">
          <div className="skeleton-bar mb-3 h-3 w-16 rounded" />
          <div className="skeleton-bar mb-2 h-6 w-3/4 rounded" />
          <div className="skeleton-bar h-4 w-full rounded" />
          <div className="skeleton-bar mt-2 h-4 w-5/6 rounded" />
          <div className="skeleton-bar mt-2 h-4 w-2/3 rounded" />
        </div>
      ))}
    </div>
 
    <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6">
      <div className="skeleton-bar mb-3 h-3 w-20 rounded" />
      <div className="skeleton-bar mb-4 h-6 w-48 rounded" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-bar mb-3 h-4 w-full rounded" />
      ))}
    </div>
  </div>
);
 
/* ─── EMPTY STATE ───────────────────────────────────────────────────────── */
const EmptyState = ({ onBack }) => (
  <div className="a2 flex flex-col items-center justify-center rounded-2xl border border-amber-700/20 bg-[#100e0c] px-8 py-20 text-center">
    <div className="pulse-icon mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-700/30 bg-amber-500/[0.08] text-amber-400/70">
      <AlertCircle size={28} />
    </div>
    <div className="jakarta mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400/60">
      <span className="inline-block h-px w-5 bg-amber-400/60" />
      Result not found
    </div>
    <h2 className="fraunces mt-2 text-2xl font-black tracking-tight text-amber-100">
      No analysis <em className="font-light italic text-amber-400">data found.</em>
    </h2>
    <p className="jakarta mt-3 max-w-sm text-sm font-light leading-6 text-stone-500">
      The analysis you're looking for may have expired or the link is no longer valid.
      Head back and run a fresh check.
    </p>
    <button
      onClick={onBack}
      className="jakarta group mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-[#080706] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_10px_28px_rgba(245,158,11,0.28)]"
    >
      <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" />
      Return to Resume Checker
    </button>
  </div>
);
 
/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function ResumeCheckerResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { resumeAnalysis, loading, handleGetResumeAnalysisById } =
    useResumeAnalysis();
  const analysis = location.state?.analysis || resumeAnalysis || null;
 
  /* — logic unchanged — */
  useEffect(() => {
    if (id && !analysis) {
      const fetchAnalysis = async () => {
        try {
          await handleGetResumeAnalysisById(id);
        } catch (err) {
          console.error("Failed to fetch analysis:", err);
        }
      };
      fetchAnalysis();
    }
  }, [id, analysis, handleGetResumeAnalysisById]);
 
  const handleBack = () => {
    navigate("/resume-checker");
  };
 
  /* ── LOADING STATE ─────────────────────────────────────────────────── */
  if (loading && !analysis) {
    return (
      <>
        <style>{globalCss}</style>
        <div className="relative min-h-screen overflow-hidden bg-[#080706] text-amber-50">
          {/* blobs */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div
              className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-700 opacity-[0.12] blur-[100px]"
              style={{ animation: "drift 22s linear infinite" }}
            />
            <div
              className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-900 opacity-[0.12] blur-[90px]"
              style={{ animation: "drift 28s linear infinite reverse" }}
            />
          </div>
 
          <div className="relative z-10 mx-auto max-w-6xl space-y-5 px-4 py-6 md:px-6">
            {/* loading header */}
            <div className="a1 flex items-center gap-4 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-700/30 bg-amber-500/[0.08] text-amber-400/50">
                <FileSearch size={17} />
              </div>
              <div>
                <div className="jakarta text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400/60">
                  Loading result
                </div>
                <p className="fraunces text-lg font-bold text-stone-600">
                  Fetching your analysis…
                </p>
              </div>
              {/* spinner */}
              <div
                className="ml-auto h-5 w-5 rounded-full border-2 border-amber-700/20 border-t-amber-400"
                style={{ animation: "spin-slow 0.9s linear infinite" }}
              />
            </div>
 
            <DarkSkeletonLoader />
          </div>
        </div>
      </>
    );
  }
 
  /* ── RESULT / EMPTY STATE ──────────────────────────────────────────── */
  return (
    <>
      <style>{globalCss}</style>
      <div className="relative min-h-screen overflow-hidden bg-[#080706] text-amber-50">
 
        {/* blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-700 opacity-[0.12] blur-[100px]"
            style={{ animation: "drift 22s linear infinite" }}
          />
          <div
            className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-900 opacity-[0.12] blur-[90px]"
            style={{ animation: "drift 28s linear infinite reverse" }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800 opacity-[0.06] blur-[120px]"
            style={{ animation: "drift 35s linear infinite" }}
          />
        </div>
 
        <div className="relative z-10 mx-auto max-w-6xl space-y-5 px-4 py-6 md:px-6">
 
          {/* ── TOP NAV BAR ─────────────────────────────────────────── */}
          <div className="a1 flex items-center justify-between rounded-2xl border border-amber-700/20 bg-[#100e0c] px-5 py-4">
 
            <div className="flex items-center gap-3">
              {/* back button */}
              <button
                onClick={handleBack}
                className="jakarta group flex items-center gap-2 rounded-xl border border-amber-700/25 bg-transparent px-4 py-2 text-sm font-medium text-amber-200 transition hover:border-amber-500/50 hover:bg-amber-500/[0.07]"
              >
                <ArrowLeft size={14} className="transition group-hover:-translate-x-0.5" />
                Back
              </button>
 
              <div className="h-5 w-px bg-amber-700/25" />
 
              {/* breadcrumb */}
              <div className="jakarta hidden items-center gap-1.5 text-[0.72rem] font-medium text-stone-600 sm:flex">
                <span className="text-amber-400/70">Resume Checker</span>
                <span>/</span>
                <span className="text-stone-400">Analysis Result</span>
              </div>
            </div>
 
            {/* badge */}
            <div className="jakarta inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-500/[0.07] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
              <Sparkles size={10} />
              AI powered
            </div>
          </div>
 
          {/* ── PAGE HEADING ─────────────────────────────────────────── */}
          {analysis && (
            <div className="a2 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="pulse-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/[0.1] text-amber-400">
                  <FileSearch size={22} />
                </div>
                <div>
                  <div className="jakarta mb-0.5 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                    <span className="inline-block h-px w-5 bg-amber-400" />
                    Analysis complete
                  </div>
                  <h1 className="fraunces text-2xl font-black tracking-tight text-amber-50 md:text-3xl">
                    Your resume <em className="font-light italic text-amber-400">results.</em>
                  </h1>
                  <p className="jakarta mt-1 text-sm font-light text-stone-500">
                    Review your feedback, skill gaps, and preparation plan below.
                  </p>
                </div>
              </div>
            </div>
          )}
 
          {/* ── RESULT BODY ─────────────────────────────────────────── */}
          <div className="a3">
            {analysis ? (
              <div className="dark-result-override overflow-hidden rounded-2xl border border-amber-700/20 bg-[#100e0c]">
                <ResumeAnalysisResult analysis={analysis} onBack={handleBack} />
              </div>
            ) : (
              <EmptyState onBack={handleBack} />
            )}
          </div>
 
        </div>
      </div>
    </>
  );
}