import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeAnalysisForm from "../components/ResumeAnalysisForm";
import PreviousAnalysisList from "../components/PreviousAnalysisList";
import {
  FileSearch,
  ChevronDown,
  Sparkles,
  Zap,
  LayoutList,
  Target,
} from "lucide-react";
 
/* ─── STYLES (mirrored from Home) ──────────────────────────────────────── */
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
  @keyframes pulseRing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.15); }
    50%       { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
  }
 
  .a1 { animation: fadeUp .55s .05s ease both; }
  .a2 { animation: fadeUp .55s .12s ease both; }
  .a3 { animation: fadeUp .55s .20s ease both; }
  .a4 { animation: fadeUp .55s .28s ease both; }
 
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
 
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080706; }
  ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.3); border-radius: 10px; }
 
  .pulse-icon { animation: pulseRing 2.8s ease-in-out infinite; }
 
  /* Override any child-component light-mode inputs/textareas to honour dark theme */
  .dark-form-override input,
  .dark-form-override textarea,
  .dark-form-override select {
    background-color: #1a1612 !important;
    color: #fef3c7 !important;
    border-color: rgba(180,83,9,0.25) !important;
  }
  .dark-form-override input::placeholder,
  .dark-form-override textarea::placeholder {
    color: #57534e !important;
  }
  .dark-form-override input:focus,
  .dark-form-override textarea:focus,
  .dark-form-override select:focus {
    border-color: rgba(245,158,11,0.5) !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(245,158,11,0.1) !important;
  }
  .dark-form-override label {
    color: #d6d3d1 !important;
  }
  .dark-form-override button[type="submit"] {
    background-color: #f59e0b !important;
    color: #080706 !important;
    font-weight: 600 !important;
  }
  .dark-form-override button[type="submit"]:hover {
    background-color: #fbbf24 !important;
  }
`;
 
/* ─── STAT CARD ─────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
    <div className={`jakarta mb-1 flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-widest ${color}`}>
      {Icon && <Icon size={10} />}
      {label}
    </div>
    <p className={`fraunces mt-2 text-2xl font-black ${color}`}>{value}</p>
  </div>
);
 
/* ─── HIGHLIGHT CHIP ─────────────────────────────────────────────────────── */
const HighlightChip = ({ title, desc, color = "text-amber-400" }) => (
  <div className="rounded-xl border border-amber-700/15 bg-stone-900/40 p-5 transition hover:border-amber-700/35 hover:bg-stone-900/70">
    <p className={`jakarta text-[0.65rem] font-semibold uppercase tracking-widest ${color}`}>
      Feature
    </p>
    <h4 className="fraunces mt-2 text-base font-bold text-amber-100">{title}</h4>
    <p className="jakarta mt-1.5 text-sm font-light leading-5 text-stone-500">{desc}</p>
  </div>
);
 
/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function ResumeChecker() {
  const navigate = useNavigate();
  const [formExpanded, setFormExpanded] = useState(true);
 
  /* — logic unchanged — */
  const handleFormSuccess = (analysisResult) => {
    navigate("/resume-checker/results", {
      state: { analysis: analysisResult },
    });
  };
 
  const handleSelectAnalysis = (analysis) => {
    navigate(`/resume-checker/results/${analysis._id}`, {
      state: { analysis },
    });
  };
 
  return (
    <>
      <style>{globalCss}</style>
 
      <div className="relative min-h-screen overflow-hidden bg-[#080706] text-amber-50">
 
        {/* ── ambient blobs (same as Home) ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-700 opacity-[0.12] blur-[100px]"
            style={{ animation: "drift 22s linear infinite" }}
          />
          <div
            className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-900 opacity-[0.12] blur-[90px]"
            style={{ animation: "drift 28s linear infinite reverse" }}
          />
          {/* extra subtle blob for depth */}
          <div
            className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800 opacity-[0.06] blur-[120px]"
            style={{ animation: "drift 35s linear infinite" }}
          />
        </div>
 
        <div className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 py-6 md:px-6">
 
          {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
          <header className="a1 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
 
              <div>
                {/* eyebrow */}
                <div className="jakarta mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                  <span className="inline-block h-px w-5 bg-amber-400" />
                  AI analysis
                </div>
 
                <div className="flex items-center gap-4 mt-2">
                  {/* icon badge */}
                  <div className="pulse-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/[0.1] text-amber-400">
                    <FileSearch size={22} />
                  </div>
                  <div>
                    <h1 className="fraunces text-3xl font-black tracking-tight text-amber-50 md:text-4xl">
                      Resume <em className="font-light italic text-amber-400">Checker.</em>
                    </h1>
                    <p className="jakarta mt-1 max-w-2xl text-sm font-light text-stone-500">
                      Analyze your resume against a target role and get structured feedback,
                      interview questions, skill gaps, and a preparation plan.
                    </p>
                  </div>
                </div>
              </div>
 
              {/* stat cards */}
              <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
                <StatCard label="Speed"   value="Fast"     icon={Zap}        color="text-amber-400" />
                <StatCard label="Output"  value="Detailed" icon={LayoutList}  color="text-sky-400"  />
                <StatCard label="Best for" value="ATS"     icon={Target}      color="text-emerald-400" />
              </div>
            </div>
          </header>
 
          {/* ── CONTENT GRID ─────────────────────────────────────────────── */}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
 
            {/* LEFT COLUMN */}
            <div className="a2 space-y-5">
 
              {/* ── FORM CARD ─────────────────────────────────────────── */}
              <div className="overflow-hidden rounded-2xl border border-amber-700/20 bg-[#100e0c]">
 
                {/* collapsible header */}
                <button
                  onClick={() => setFormExpanded(!formExpanded)}
                  className="flex w-full items-center justify-between gap-4 border-b border-amber-700/20 bg-gradient-to-r from-[#100e0c] via-[#12100d] to-amber-950/20 px-6 py-5 text-left transition hover:bg-amber-500/[0.04]"
                >
                  <div className="flex items-center gap-3 ">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/[0.1] text-amber-400">
                      <Sparkles size={17} />
                    </div>
                    <div>
                      <div className="jakarta flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-widest text-amber-400">
                        <span className="inline-block h-px w-4 bg-amber-400" />
                        New analysis
                      </div>
                      <h2 className="fraunces mt-0.5 text-lg font-bold text-amber-50">
                        Upload &amp; analyse your resume
                      </h2>
                    </div>
                  </div>
 
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-stone-500 transition-transform duration-300 ${
                      formExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
 
                {/* form body */}
                {formExpanded && (
                  <div className="dark-form-override p-6 md:p-8">
                    <ResumeAnalysisForm onSuccess={handleFormSuccess} />
                  </div>
                )}
              </div>
 
              {/* ── HIGHLIGHT CHIPS ───────────────────────────────────── */}
              <div className="grid gap-3 sm:grid-cols-3 ">
                <HighlightChip
                  title="Instant analysis"
                  desc="AI-powered resume feedback in a calm, structured layout."
                  color="text-amber-400"
                />
                <HighlightChip
                  title="Actionable insights"
                  desc="Skill gaps, suggested questions, and clear next steps."
                  color="text-sky-400"
                />
                <HighlightChip
                  title="Previous runs"
                  desc="Revisit earlier analyses from the sidebar at any time."
                  color="text-emerald-400"
                />
              </div>
            </div>
 
            {/* RIGHT COLUMN — history sidebar */}
            <aside className="a3 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 xl:sticky xl:top-6 xl:self-start">
 
              {/* eyebrow */}
              <div className="jakarta mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                <span className="inline-block h-px w-4 bg-amber-400" />
                History
              </div>
 
              <h2 className="fraunces text-xl font-black tracking-tight text-amber-50">
                Previous <em className="font-light italic text-amber-400">analyses.</em>
              </h2>
              <p className="jakarta mt-1 text-sm font-light text-stone-500">
                Open any earlier result without affecting the current form.
              </p>
 
              <div className="my-4 h-px bg-amber-700/15" />
 
              {/* list — logic untouched */}
              <PreviousAnalysisList onSelectAnalysis={handleSelectAnalysis} />
            </aside>
 
          </div>
        </div>
      </div>
    </>
  );
}