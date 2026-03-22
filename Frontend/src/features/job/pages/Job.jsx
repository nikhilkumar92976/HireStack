import React, { useEffect, useMemo, useState } from "react";
import { useJob } from "../hooks/useJob";

const getInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || "J";

const JobPageSkeleton = () => (
  <div className="min-h-screen bg-[#f5f5f3] px-4 py-6 md:px-8">
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded-full bg-gray-200" />
                <div className="h-3 w-1/2 rounded-full bg-gray-100" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-3 rounded-full bg-gray-100" />
              <div className="h-3 rounded-full bg-gray-100" />
              <div className="h-3 w-4/5 rounded-full bg-gray-100" />
            </div>
            <div className="mt-6 h-10 w-28 rounded-2xl bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const JobCard = ({ item }) => (
  <article className="group flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-start gap-4">
      {item.employer_logo ? (
        <img
          src={item.employer_logo}
          alt={`${item.employer_name || "Company"} logo`}
          className="h-14 w-14 rounded-2xl object-cover ring-1 ring-black/5"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-700 ring-1 ring-blue-100">
          {getInitial(item.employer_name)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          {item.job_employment_type || "Opportunity"}
        </p>
        <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-gray-900">
          {item.job_title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{item.employer_name || "Confidential company"}</p>
      </div>
    </div>

    <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-gray-600">
      <span className="rounded-full bg-gray-100 px-3 py-1.5">{item.job_location || "Location not specified"}</span>
      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">{item.job_country || "Global"}</span>
    </div>

    <p className="mt-4 line-clamp-4 text-sm leading-6 text-gray-600">
      {item.job_description || "Explore this opening to view the full role details and application instructions."}
    </p>

    <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-gray-400">Posted</p>
        <p className="mt-1 text-sm text-gray-600">{item.job_posted_at || "Recently posted"}</p>
      </div>

      <a
        href={item.job_apply_link}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Apply now
      </a>
    </div>
  </article>
);

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

  useEffect(() => {
    handleGetJobs().catch(() => null);
  }, [handleGetJobs]);

  const jobs = useMemo(() => (Array.isArray(job) ? job : []), [job]);
  const loadedPages = useMemo(
    () =>
      Object.entries(jobCache)
        .filter(([, cachedJobs]) => Array.isArray(cachedJobs) && cachedJobs.length > 0)
        .map(([page]) => Number(page))
        .sort((firstPage, secondPage) => firstPage - secondPage),
    [jobCache]
  );

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1;

    if (previousPage < 1) {
      return;
    }

    activateCachedPage(previousPage);
    setCurrentPage(previousPage);
  };

  const handleSelectPage = (page) => {
    if (page === currentPage) {
      return;
    }

    activateCachedPage(page);
    setCurrentPage(page);
  };

  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    const result = await handleGetJobs(nextPage, { activate: false }).catch(() => null);

    if (!result?.jobs?.length) {
      return;
    }

    activateCachedPage(nextPage);
    setCurrentPage(nextPage);
  };

  const canGoNext = lastPageReached === null || currentPage < lastPageReached;

  if (loading) return <JobPageSkeleton />;

  return (
    <div className="min-h-screen bg-[#f5f5f3] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {jobs.length > 0 ? (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((item, index) => (
              <JobCard
                key={`${item.job_apply_link || item.job_title || "job"}-${currentPage}-${index}`}
                item={item}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-semibold text-gray-900">No jobs available right now</h2>
          </section>
        )}

        <section className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {loadedPages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handleSelectPage(page)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={handleNextPage}
            disabled={!canGoNext || loading}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Next"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Job;
