import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { Calendar, Briefcase, ChevronRight, ClockIcon } from "lucide-react";
 
/* ─── STYLES ────────────────────────────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
 
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes shimmer {
    0%   { background-position: -500px 0; }
    100% { background-position: 500px 0; }
  }
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
 
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
 
  .list-fadeup { animation: fadeUp .35s ease both; }
 
  .skeleton-bar {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.02) 0%,
      rgba(245,158,11,0.07) 50%,
      rgba(255,255,255,0.02) 100%
    );
    background-size: 500px 100%;
    animation: shimmer 1.8s infinite linear;
    border-radius: 8px;
  }
`;
 
/* ─── MATCH SCORE BADGE ─────────────────────────────────────────────────── */
const MatchBadge = ({ score }) => {
  const color =
    score >= 75
      ? "border-emerald-700/40 bg-emerald-950/40 text-emerald-400"
      : score >= 50
      ? "border-amber-700/40 bg-amber-950/40 text-amber-400"
      : "border-red-700/40 bg-red-950/30 text-red-400";
 
  return (
    <span
      className={`jakarta inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold ${color}`}
    >
      {score}% match
    </span>
  );
};
 
/* ─── SKELETON LOADING ──────────────────────────────────────────────────── */
const SkeletonList = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="rounded-xl border border-amber-700/15 bg-stone-900/40 p-4"
        style={{ animationDelay: `${i * 80}ms` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="skeleton-bar h-3.5 w-1/3 rounded" />
            <div className="skeleton-bar h-3 w-2/4 rounded" />
            <div className="skeleton-bar h-3 w-full rounded" />
            <div className="skeleton-bar h-3 w-4/5 rounded" />
          </div>
          <div className="skeleton-bar h-5 w-5 shrink-0 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
 
/* ─── EMPTY STATE ───────────────────────────────────────────────────────── */
const EmptyList = () => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-700/20 bg-stone-900/20 py-12 text-center">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-700/25 bg-amber-500/[0.06] text-amber-500/50">
      <ClockIcon size={18} />
    </div>
    <p className="jakarta text-sm font-medium text-stone-500">No previous analyses yet.</p>
    <p className="jakarta mt-1 text-xs font-light text-stone-700">
      Analyze your resume to see results here.
    </p>
  </div>
);
 
/* ─── ANALYSIS CARD ─────────────────────────────────────────────────────── */
const AnalysisCard = ({ analysis, index, onClick }) => (
  <div
    onClick={onClick}
    className="list-fadeup group cursor-pointer rounded-xl border border-amber-700/15 bg-stone-900/40 p-4 transition duration-200 hover:border-amber-500/40 hover:bg-amber-500/[0.04] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)]"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
 
        {/* title row */}
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-amber-700/25 bg-amber-500/[0.08] text-amber-500/70">
            <Briefcase size={12} />
          </div>
          <h3 className="fraunces truncate text-sm font-bold text-amber-100">
            {analysis.title || "Untitled Analysis"}
          </h3>
        </div>
 
        {/* meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="jakarta flex items-center gap-1 text-[0.65rem] font-light text-stone-600">
            <Calendar size={10} className="text-stone-700" />
            {new Date(analysis.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
 
          {analysis.matchScore != null && (
            <MatchBadge score={analysis.matchScore} />
          )}
        </div>
 
        {/* summary */}
        {analysis.summary && (
          <p className="jakarta mt-2.5 line-clamp-2 text-xs font-light leading-5 text-stone-600">
            {analysis.summary}
          </p>
        )}
      </div>
 
      {/* arrow */}
      <ChevronRight
        size={16}
        className="mt-0.5 shrink-0 text-stone-700 transition group-hover:translate-x-0.5 group-hover:text-amber-400"
      />
    </div>
  </div>
);
 
/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function PreviousAnalysisList({ onSelectAnalysis }) {
  const { allResumeAnalysis, handleGetAllResumeAnalysis, loading } =
    useResumeAnalysis();
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef(null);
  const itemsPerPage = 5;
 
  /* — logic unchanged — */
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        await handleGetAllResumeAnalysis();
      } catch (err) {
        console.error("Failed to fetch analyses:", err);
      }
    };
    fetchAnalyses();
  }, [handleGetAllResumeAnalysis]);
 
  const displayedItems = useMemo(() => {
    if (!allResumeAnalysis || allResumeAnalysis.length === 0) return [];
    return allResumeAnalysis.slice(0, currentPage * itemsPerPage);
  }, [allResumeAnalysis, currentPage]);
 
  const hasMore = useMemo(() => {
    if (!allResumeAnalysis || allResumeAnalysis.length === 0) return false;
    return currentPage * itemsPerPage < allResumeAnalysis.length;
  }, [allResumeAnalysis, currentPage]);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    const target = observerTarget.current;
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target); };
  }, [hasMore, loading]);
 
  const handleSelectAnalysis = useCallback(
    (analysis) => { if (onSelectAnalysis) onSelectAnalysis(analysis); },
    [onSelectAnalysis]
  );
 
  /* ── states ──────────────────────────────────────────────────────────── */
  if (loading && displayedItems.length === 0) {
    return (
      <>
        <style>{globalCss}</style>
        <SkeletonList />
      </>
    );
  }
 
  if (!allResumeAnalysis || allResumeAnalysis.length === 0) {
    return (
      <>
        <style>{globalCss}</style>
        <EmptyList />
      </>
    );
  }
 
  return (
    <>
      <style>{globalCss}</style>
 
      <div className="space-y-2.5">
        {displayedItems.map((analysis, index) => (
          <AnalysisCard
            key={analysis._id || index}
            analysis={analysis}
            index={index}
            onClick={() => handleSelectAnalysis(analysis)}
          />
        ))}
 
        {/* infinite scroll trigger */}
        {hasMore && (
          <div
            ref={observerTarget}
            className="flex items-center justify-center py-5"
          >
            <div
              className="h-4 w-4 rounded-full border-2 border-amber-700/20 border-t-amber-400"
              style={{ animation: "spin-slow 0.9s linear infinite" }}
            />
          </div>
        )}
 
        {/* end of list */}
        {!hasMore && displayedItems.length > 0 && (
          <div className="flex items-center gap-3 py-3">
            <div className="h-px flex-1 bg-amber-700/15" />
            <p className="jakarta text-[0.65rem] font-semibold uppercase tracking-widest text-stone-700">
              All {allResumeAnalysis.length} analyses shown
            </p>
            <div className="h-px flex-1 bg-amber-700/15" />
          </div>
        )}
      </div>
    </>
  );
}