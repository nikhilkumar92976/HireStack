import React, { useState, useEffect } from "react";
import {
  ArrowLeft, ChevronDown, CheckCircle, AlertCircle,
  BookOpen, Zap, Brain, Target, MapPin, Calendar,
} from "lucide-react";
 
/* ─── STYLES ────────────────────────────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
 
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes drift {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(20px,-15px) scale(1.04); }
    66%  { transform: translate(-12px,20px) scale(.97); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes scoreArc {
    from { stroke-dasharray: 0 282.7; }
  }
 
  .r-a1 { animation: fadeUp .5s .05s ease both; }
  .r-a2 { animation: fadeUp .5s .12s ease both; }
  .r-a3 { animation: fadeUp .5s .20s ease both; }
  .r-a4 { animation: fadeUp .5s .28s ease both; }
  .r-a5 { animation: fadeUp .5s .36s ease both; }
  .r-a6 { animation: fadeUp .5s .44s ease both; }
 
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
 
  /* section card */
  .result-card {
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid rgba(180,83,9,0.2);
    background: #100e0c;
  }
  /* section header strip */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid rgba(180,83,9,0.15);
    padding: 18px 24px;
    background: linear-gradient(to right, #100e0c, #12100d, rgba(120,53,15,0.08));
  }
 
  /* accordion row */
  .accordion-row {
    border-bottom: 1px solid rgba(180,83,9,0.12);
    transition: background .15s;
  }
  .accordion-row:last-child { border-bottom: none; }
  .accordion-row:hover { background: rgba(245,158,11,0.03); }
 
  /* accordion expanded panel */
  .accordion-panel {
    border-top: 1px solid rgba(180,83,9,0.12);
    background: rgba(245,158,11,0.025);
    padding: 16px 24px;
  }
 
  /* answer box */
  .answer-box {
    border-radius: 12px;
    border: 1px solid rgba(180,83,9,0.2);
    background: #0d0b09;
    padding: 14px 16px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 300;
    color: #a8a29e;
    line-height: 1.7;
    white-space: pre-line;
  }
 
  /* score arc animation */
  .score-arc {
    animation: scoreArc 1.2s cubic-bezier(.4,0,.2,1) both;
    animation-delay: .3s;
  }
 
  /* skill gap pill */
  .skill-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 10px;
    border: 1px solid rgba(239,68,68,0.3);
    background: rgba(239,68,68,0.06);
    padding: 6px 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: #f87171;
    transition: border-color .15s, background .15s;
  }
  .skill-pill:hover {
    border-color: rgba(239,68,68,0.5);
    background: rgba(239,68,68,0.1);
  }
 
  /* prep day card */
  .day-card {
    border-radius: 14px;
    border: 1px solid rgba(16,185,129,0.2);
    background: rgba(16,185,129,0.04);
    padding: 20px;
    transition: border-color .2s, background .2s, transform .2s;
  }
  .day-card:hover {
    border-color: rgba(16,185,129,0.4);
    background: rgba(16,185,129,0.07);
    transform: translateY(-2px);
  }
`;
 
/* ─── HELPERS ───────────────────────────────────────────────────────────── */
const scoreColor = (s) =>
  s >= 75 ? "#10b981" : s >= 50 ? "#f59e0b" : "#ef4444";
 
const scoreLabelColor = (s) =>
  s >= 75 ? "text-emerald-400" : s >= 50 ? "text-amber-400" : "text-red-400";
 
const scoreRingBg = (s) =>
  s >= 75
    ? "border-emerald-700/30 bg-emerald-950/30"
    : s >= 50
    ? "border-amber-700/30 bg-amber-950/30"
    : "border-red-700/30 bg-red-950/30";
 
/* ─── SECTION ICON BADGE ────────────────────────────────────────────────── */
const IconBadge = ({ icon: Icon, color = "text-amber-400", bg = "bg-amber-500/[0.1]", border = "border-amber-700/30" }) => (
  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${border} ${bg} ${color}`}>
    <Icon size={17} />
  </div>
);
 
/* ─── COUNT PILL ────────────────────────────────────────────────────────── */
const CountPill = ({ n, color = "text-amber-400", border = "border-amber-700/30", bg = "bg-amber-500/[0.07]" }) => (
  <span className={`jakarta inline-flex items-center rounded-full border ${border} ${bg} ${color} px-2.5 py-0.5 text-[0.65rem] font-semibold`}>
    {n}
  </span>
);
 
/* ─── SUB-LABEL ─────────────────────────────────────────────────────────── */
const SubLabel = ({ emoji, text }) => (
  <p className="jakarta mb-2 flex items-center gap-1.5 text-xs font-semibold text-stone-500">
    <span>{emoji}</span>
    {text}
  </p>
);
 
/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
const ResumeAnalysisResult = ({ analysis, onBack }) => {
  const [expandedTech, setExpandedTech] = useState(null);
  const [expandedBehavior, setExpandedBehavior] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
 
  /* — score animation logic unchanged — */
  useEffect(() => {
    if (!analysis) return;
    const target = analysis.matchScore;
    const increment = target / 50;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [analysis]);
 
  if (!analysis) {
    return (
      <div className="jakarta rounded-2xl border border-amber-700/20 bg-[#100e0c] p-10 text-center text-stone-600">
        Loading…
      </div>
    );
  }
 
  const data = analysis;
 
  return (
    <>
      <style>{globalCss}</style>
 
      <div className="space-y-4 p-5 md:p-6">
 
        {/* ── BACK BUTTON ─────────────────────────────────────────────── */}
        {onBack && (
          <div className="r-a1">
            <button
              onClick={onBack}
              className="jakarta group inline-flex items-center gap-2 rounded-xl border border-amber-700/25 bg-transparent px-4 py-2.5 text-sm font-medium text-amber-200 transition hover:border-amber-500/50 hover:bg-amber-500/[0.07]"
            >
              <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" />
              Back to Resume Checker
            </button>
          </div>
        )}
 
        {/* ── HEADER + SCORE ───────────────────────────────────────────── */}
        <div className="r-a1 result-card">
          <div className="card-header flex-col gap-5 sm:flex-row sm:items-center">
 
            {/* left — title */}
            <div className="flex-1">
              <div className="jakarta mb-1.5 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-widest text-amber-400">
                <span className="inline-block h-px w-5 bg-amber-400" />
                Analysis complete
              </div>
              <h1 className="fraunces text-2xl font-black tracking-tight text-amber-50 md:text-3xl">
                {data.title}
              </h1>
              <p className="jakarta mt-1 text-sm font-light text-stone-600">
                Resume Analysis Report
              </p>
            </div>
 
            {/* right — score ring */}
            <div className="flex flex-col items-center gap-2">
              <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-2 ${scoreRingBg(data.matchScore)}`}>
                {/* SVG arc */}
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* track */}
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(180,83,9,0.15)" strokeWidth="3" />
                  {/* fill */}
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke={scoreColor(data.matchScore)}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(displayScore / 100) * 276.5} 276.5`}
                    className="score-arc"
                    style={{ transition: "stroke-dasharray 0.3s ease-out" }}
                  />
                </svg>
                {/* text */}
                <div className="relative text-center">
                  <p className={`fraunces text-4xl font-black leading-none ${scoreLabelColor(data.matchScore)}`}>
                    {displayScore}
                  </p>
                  <p className="jakarta mt-0.5 text-[0.6rem] font-semibold uppercase tracking-widest text-stone-600">
                    Match %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* ── JOB DESCRIPTION ─────────────────────────────────────────── */}
        <div className="r-a2 result-card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <IconBadge icon={BookOpen} />
              <div>
                <div className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-amber-400/70">
                  Context
                </div>
                <h2 className="fraunces text-lg font-black text-amber-50">Job Description</h2>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="jakarta text-sm font-light leading-7 text-stone-500 whitespace-pre-line">
              {data.jobDescription}
            </p>
          </div>
        </div>
 
        {/* ── TECHNICAL QUESTIONS ──────────────────────────────────────── */}
        <div className="r-a3 result-card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <IconBadge icon={Zap} color="text-sky-400" bg="bg-sky-500/[0.1]" border="border-sky-700/30" />
              <div>
                <div className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-sky-400/70">
                  Interview prep
                </div>
                <h2 className="fraunces text-lg font-black text-amber-50">Technical Questions</h2>
              </div>
            </div>
            <CountPill
              n={data.technicalQuestions?.length || 0}
              color="text-sky-400"
              border="border-sky-700/30"
              bg="bg-sky-500/[0.07]"
            />
          </div>
 
          <div>
            {data.technicalQuestions?.map((q, index) => (
              <div key={index} className="accordion-row">
                <button
                  onClick={() => setExpandedTech(expandedTech === index ? null : index)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="jakarta flex-1 text-sm font-medium text-stone-300">
                    <span className="jakarta mr-2 font-semibold text-sky-400/60">Q{index + 1}.</span>
                    {q.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`mt-0.5 shrink-0 text-stone-600 transition-transform duration-300 ${
                      expandedTech === index ? "rotate-180 text-sky-400" : ""
                    }`}
                  />
                </button>
 
                {expandedTech === index && (
                  <div className="accordion-panel space-y-4">
                    {q.intention && (
                      <div>
                        <SubLabel emoji="💡" text="Intention" />
                        <div className="answer-box">{q.intention}</div>
                      </div>
                    )}
                    {q.answer && (
                      <div>
                        <SubLabel emoji="✅" text="Expected Answer" />
                        <div className="answer-box">{q.answer}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
 
        {/* ── BEHAVIORAL QUESTIONS ─────────────────────────────────────── */}
        <div className="r-a4 result-card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <IconBadge icon={Brain} color="text-violet-400" bg="bg-violet-500/[0.1]" border="border-violet-700/30" />
              <div>
                <div className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-violet-400/70">
                  Soft skills
                </div>
                <h2 className="fraunces text-lg font-black text-amber-50">Behavioral Questions</h2>
              </div>
            </div>
            <CountPill
              n={data.behavioralQuestions?.length || 0}
              color="text-violet-400"
              border="border-violet-700/30"
              bg="bg-violet-500/[0.07]"
            />
          </div>
 
          <div>
            {data.behavioralQuestions?.map((q, index) => (
              <div key={index} className="accordion-row">
                <button
                  onClick={() => setExpandedBehavior(expandedBehavior === index ? null : index)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="jakarta flex-1 text-sm font-medium text-stone-300">
                    <span className="jakarta mr-2 font-semibold text-violet-400/60">Q{index + 1}.</span>
                    {q.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`mt-0.5 shrink-0 text-stone-600 transition-transform duration-300 ${
                      expandedBehavior === index ? "rotate-180 text-violet-400" : ""
                    }`}
                  />
                </button>
 
                {expandedBehavior === index && (
                  <div className="accordion-panel">
                    {q.answer && (
                      <div>
                        <SubLabel emoji="💬" text="Suggested Answer" />
                        <div className="answer-box">{q.answer}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
 
        {/* ── SKILL GAPS ───────────────────────────────────────────────── */}
        <div className="r-a5 result-card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <IconBadge icon={Target} color="text-red-400" bg="bg-red-500/[0.1]" border="border-red-700/30" />
              <div>
                <div className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-red-400/70">
                  Areas to improve
                </div>
                <h2 className="fraunces text-lg font-black text-amber-50">Skill Gaps</h2>
              </div>
            </div>
            <CountPill
              n={data.skillGaps?.length || 0}
              color="text-red-400"
              border="border-red-700/30"
              bg="bg-red-500/[0.07]"
            />
          </div>
 
          <div className="flex flex-wrap gap-2.5 p-6">
            {data.skillGaps?.map((skill, index) => (
              <span key={index} className="skill-pill">
                <MapPin size={11} />
                {skill.skill}
              </span>
            ))}
          </div>
        </div>
 
        {/* ── PREPARATION PLAN ─────────────────────────────────────────── */}
        <div className="r-a6 result-card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <IconBadge icon={CheckCircle} color="text-emerald-400" bg="bg-emerald-500/[0.1]" border="border-emerald-700/30" />
              <div>
                <div className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-emerald-400/70">
                  Roadmap
                </div>
                <h2 className="fraunces text-lg font-black text-amber-50">Preparation Plan</h2>
              </div>
            </div>
            <CountPill
              n={`${data.preparationPlan?.length || 0} days`}
              color="text-emerald-400"
              border="border-emerald-700/30"
              bg="bg-emerald-500/[0.07]"
            />
          </div>
 
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {data.preparationPlan?.map((day, index) => (
              <div key={index} className="day-card">
                {/* day header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-700/40 bg-emerald-950/50 text-sm font-black text-emerald-400 fraunces">
                    {day.day}
                  </div>
                  <div>
                    <p className="jakarta text-[0.6rem] font-semibold uppercase tracking-widest text-emerald-700">
                      Day {day.day}
                    </p>
                    <p className="jakarta text-sm font-medium italic text-stone-400">{day.focus}</p>
                  </div>
                </div>
 
                {/* divider */}
                <div className="mb-3 h-px bg-emerald-900/40" />
 
                {/* tasks */}
                <ul className="space-y-2">
                  {day.tasks?.map((task, i) => (
                    <li key={i} className="jakarta flex items-start gap-2.5 text-sm font-light text-stone-500">
                      <span className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-emerald-700/40 bg-emerald-950/50">
                        <span className="block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
 
      </div>
    </>
  );
};
 
export default ResumeAnalysisResult;