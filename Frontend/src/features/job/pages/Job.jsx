import React, { useEffect, useMemo, useState } from "react";
import { useJob } from "../hooks/useJob";
import {
  MapPin, Globe, Clock, ArrowUpRight,
  Briefcase, ChevronLeft, ChevronRight, SearchX,
} from "lucide-react";
 
/* ─── STYLES ────────────────────────────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
 
  @keyframes drift {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(35px,-25px) scale(1.05); }
    66%  { transform: translate(-20px,35px) scale(.97); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
 
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
 
  .j-a1 { animation: fadeUp .5s .04s ease both; }
  .j-a2 { animation: fadeUp .5s .12s ease both; }
 
  /* card stagger */
  .job-card { animation: fadeUp .45s ease both; }
 
  .skeleton-bar {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.02) 0%,
      rgba(245,158,11,0.07) 50%,
      rgba(255,255,255,0.02) 100%
    );
    background-size: 600px 100%;
    animation: shimmer 1.8s infinite linear;
    border-radius: 8px;
  }
 
  /* job card hover glow */
  .job-card-inner {
    transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
  }
  .job-card-inner:hover {
    transform: translateY(-3px);
    border-color: rgba(245,158,11,0.4);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.08);
  }
 
  /* logo placeholder shimmer on img error */
  .logo-fallback {
    background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(120,53,15,0.2));
  }
`;
 
/* ─── HELPERS ───────────────────────────────────────────────────────────── */
const getInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || "J";
 
/* ─── SKELETON ──────────────────────────────────────────────────────────── */
const JobPageSkeleton = () => (
  <>
    <style>{globalCss}</style>
    <div className="relative min-h-screen overflow-hidden bg-[#080706]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-700 opacity-[0.12] blur-[100px]"
          style={{ animation: "drift 22s linear infinite" }} />
        <div className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-900 opacity-[0.12] blur-[90px]"
          style={{ animation: "drift 28s linear infinite reverse" }} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="j-a1 mb-5 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
          <div className="skeleton-bar mb-3 h-3 w-20 rounded" />
          <div className="skeleton-bar mb-2 h-8 w-56 rounded" />
          <div className="skeleton-bar h-4 w-72 rounded" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-amber-700/15 bg-[#100e0c] p-5"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="skeleton-bar h-12 w-12 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton-bar h-3.5 w-3/4 rounded" />
                  <div className="skeleton-bar h-3 w-1/2 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="skeleton-bar h-3 w-full rounded" />
                <div className="skeleton-bar h-3 w-5/6 rounded" />
                <div className="skeleton-bar h-3 w-4/5 rounded" />
                <div className="skeleton-bar h-3 w-3/4 rounded" />
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-amber-700/10 pt-4">
                <div className="skeleton-bar h-3 w-24 rounded" />
                <div className="skeleton-bar h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
 
/* ─── JOB CARD ──────────────────────────────────────────────────────────── */
const JobCard = ({ item, index }) => (
  <article
    className="job-card flex h-full flex-col"
    style={{ animationDelay: `${index * 55}ms` }}
  >
    <div className="job-card-inner flex h-full flex-col rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
 
      {/* top — logo + title */}
      <div className="flex items-start gap-3">
        {item.employer_logo ? (
          <img
            src={item.employer_logo}
            alt={`${item.employer_name || "Company"} logo`}
            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-amber-700/20"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="logo-fallback flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-700/25 text-base font-black text-amber-400 fraunces">
            {getInitial(item.employer_name)}
          </div>
        )}
 
        <div className="min-w-0 flex-1">
          {/* employment type eyebrow */}
          <div className="jakarta mb-0.5 flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-widest text-amber-400">
            <Briefcase size={9} />
            {item.job_employment_type || "Opportunity"}
          </div>
          <h2 className="fraunces line-clamp-2 text-base font-bold leading-snug text-amber-100">
            {item.job_title}
          </h2>
          <p className="jakarta mt-0.5 truncate text-xs font-light text-stone-600">
            {item.employer_name || "Confidential company"}
          </p>
        </div>
      </div>
 
      {/* meta chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="jakarta inline-flex items-center gap-1 rounded-lg border border-amber-700/20 bg-stone-900/50 px-2.5 py-1 text-[0.65rem] font-medium text-stone-500">
          <MapPin size={9} className="text-amber-600/60" />
          {item.job_location || "Location not specified"}
        </span>
        <span className="jakarta inline-flex items-center gap-1 rounded-lg border border-sky-700/30 bg-sky-950/30 px-2.5 py-1 text-[0.65rem] font-medium text-sky-400">
          <Globe size={9} />
          {item.job_country || "Global"}
        </span>
      </div>
 
      {/* divider */}
      <div className="my-4 h-px bg-amber-700/10" />
 
      {/* description */}
      <p className="jakarta line-clamp-4 flex-1 text-sm font-light leading-6 text-stone-600">
        {item.job_description ||
          "Explore this opening to view the full role details and application instructions."}
      </p>
 
      {/* footer */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-amber-700/10 pt-4">
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-stone-700" />
          <div>
            <p className="jakarta text-[0.6rem] font-semibold uppercase tracking-widest text-stone-700">
              Posted
            </p>
            <p className="jakarta text-xs font-light text-stone-600">
              {item.job_posted_at || "Recently"}
            </p>
          </div>
        </div>
 
        <a
          href={item.job_apply_link}
          target="_blank"
          rel="noreferrer"
          className="jakarta group inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-[#080706] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_8px_24px_rgba(245,158,11,0.25)]"
        >
          Apply now
          <ArrowUpRight size={12} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  </article>
);
 
/* ─── EMPTY STATE ───────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-700/20 bg-[#100e0c] py-20 text-center">
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-700/25 bg-amber-500/[0.07] text-amber-500/50">
      <SearchX size={24} />
    </div>
    <h2 className="fraunces text-xl font-black text-amber-100">
      No jobs <em className="font-light italic text-amber-400">available right now.</em>
    </h2>
    <p className="jakarta mt-2 text-sm font-light text-stone-600">
      Check back soon — new listings are added regularly.
    </p>
  </div>
);
 
/* ─── PAGINATION BUTTON ─────────────────────────────────────────────────── */
const PageBtn = ({ onClick, disabled, active, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`jakarta inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition
      ${active
        ? "bg-amber-500 text-[#080706] shadow-[0_4px_16px_rgba(245,158,11,0.25)]"
        : "border border-amber-700/20 bg-[#100e0c] text-stone-400 hover:border-amber-500/40 hover:text-amber-300"
      }
      disabled:cursor-not-allowed disabled:opacity-40`}
  >
    {children}
  </button>
);
 
/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
const Job = () => {
  const {
    handleGetJobs,
    activateCachedPage,
    loading,
    job,
    jobCache,
    lastPageReached,
  } = useJob();
  const [currentPage, setCurrentPage] = useState(1);
 
  /* — logic unchanged — */
  useEffect(() => {
    handleGetJobs().catch(() => null);
  }, [handleGetJobs]);
 
  const jobs = useMemo(() => (Array.isArray(job) ? job : []), [job]);
 
  const loadedPages = useMemo(
    () =>
      Object.entries(jobCache)
        .filter(([, cachedJobs]) => Array.isArray(cachedJobs) && cachedJobs.length > 0)
        .map(([page]) => Number(page))
        .sort((a, b) => a - b),
    [jobCache]
  );
 
  const handlePreviousPage = () => {
    const prev = currentPage - 1;
    if (prev < 1) return;
    activateCachedPage(prev);
    setCurrentPage(prev);
  };
 
  const handleSelectPage = (page) => {
    if (page === currentPage) return;
    activateCachedPage(page);
    setCurrentPage(page);
  };
 
  const handleNextPage = async () => {
    const next = currentPage + 1;
    const result = await handleGetJobs(next, { activate: false }).catch(() => null);
    if (!result?.jobs?.length) return;
    activateCachedPage(next);
    setCurrentPage(next);
  };
 
  const canGoNext = lastPageReached === null || currentPage < lastPageReached;
 
  if (loading) return <JobPageSkeleton />;
 
  return (
    <>
      <style>{globalCss}</style>
 
      <div className="relative min-h-screen overflow-hidden bg-[#080706] text-amber-50">
 
        {/* ── blobs ─────────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-700 opacity-[0.12] blur-[100px]"
            style={{ animation: "drift 22s linear infinite" }} />
          <div className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-900 opacity-[0.12] blur-[90px]"
            style={{ animation: "drift 28s linear infinite reverse" }} />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800 opacity-[0.05] blur-[120px]"
            style={{ animation: "drift 35s linear infinite" }} />
        </div>
 
        <div className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 py-6 md:px-6">
 
          {/* ── PAGE HEADER ─────────────────────────────────────────── */}
          <header className="j-a1 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
            <div className="jakarta mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
              <span className="inline-block h-px w-5 bg-amber-400" />
              Opportunities
            </div>
            <h1 className="fraunces text-3xl font-black tracking-tight text-amber-50 md:text-4xl">
              Job <em className="font-light italic text-amber-400">Search.</em>
            </h1>
            <p className="jakarta mt-1.5 text-sm font-light text-stone-500">
              Browse curated openings matched to your profile and apply in one click.
            </p>
 
            {/* result count + page indicator */}
            {jobs.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="jakarta inline-flex items-center gap-1.5 rounded-lg border border-amber-700/20 bg-stone-900/40 px-3 py-1.5 text-xs font-medium text-stone-500">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {jobs.length} listings on page {currentPage}
                </span>
              </div>
            )}
          </header>
 
          {/* ── JOB GRID ────────────────────────────────────────────── */}
          <section className="j-a2">
            {jobs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {jobs.map((item, index) => (
                  <JobCard
                    key={`${item.job_apply_link || item.job_title || "job"}-${currentPage}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>
 
          {/* ── PAGINATION ──────────────────────────────────────────── */}
          {(loadedPages.length > 0 || canGoNext) && (
            <nav className="flex flex-wrap items-center justify-center gap-2 pb-4">
              <PageBtn
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft size={15} />
                Prev
              </PageBtn>
 
              {loadedPages.map((page) => (
                <PageBtn
                  key={page}
                  onClick={() => handleSelectPage(page)}
                  active={page === currentPage}
                >
                  {page}
                </PageBtn>
              ))}
 
              <PageBtn
                onClick={handleNextPage}
                disabled={!canGoNext || loading}
              >
                {loading ? "…" : "Next"}
                <ChevronRight size={15} />
              </PageBtn>
            </nav>
          )}
 
        </div>
      </div>
    </>
  );
};
 
export default Job;