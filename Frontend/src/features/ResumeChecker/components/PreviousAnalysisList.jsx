import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { Calendar, Briefcase, ChevronRight } from "lucide-react";

export default function PreviousAnalysisList({ onSelectAnalysis }) {
  const { allResumeAnalysis, handleGetAllResumeAnalysis, loading } =
    useResumeAnalysis();
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef(null);
  const itemsPerPage = 5;

  // Fetch all analyses on mount
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
    if (!allResumeAnalysis || allResumeAnalysis.length === 0) {
      return [];
    }

    return allResumeAnalysis.slice(0, currentPage * itemsPerPage);
  }, [allResumeAnalysis, currentPage]);

  const hasMore = useMemo(() => {
    if (!allResumeAnalysis || allResumeAnalysis.length === 0) {
      return false;
    }

    return currentPage * itemsPerPage < allResumeAnalysis.length;
  }, [allResumeAnalysis, currentPage]);

  // Intersection Observer for infinite scroll
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
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, loading]);

  const handleSelectAnalysis = useCallback(
    (analysis) => {
      if (onSelectAnalysis) {
        onSelectAnalysis(analysis);
      }
    },
    [onSelectAnalysis]
  );

  if (loading && displayedItems.length === 0) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-3xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!allResumeAnalysis || allResumeAnalysis.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        <p className="text-sm text-gray-500">No previous analyses yet.</p>
        <p className="mt-2 text-xs text-gray-400">
          Analyze your resume to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedItems.map((analysis, index) => (
        <div
          key={analysis._id || index}
          onClick={() => handleSelectAnalysis(analysis)}
          className="group cursor-pointer rounded-2xl border border-gray-200 bg-[#fcfcfb] p-4 transition duration-200 hover:border-gray-300 hover:bg-white hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={16} className="text-gray-600 flex-shrink-0" />
                <h3 className="font-medium text-gray-900 truncate">
                  {analysis.title || "Untitled Analysis"}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(analysis.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {analysis.matchScore != null && (
                  <div className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    {analysis.matchScore}% Match
                  </div>
                )}
              </div>

              {analysis.summary && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {analysis.summary}
                </p>
              )}
            </div>

            <ChevronRight
              size={20}
              className="text-gray-400 flex-shrink-0 ml-3 group-hover:translate-x-1 transition"
            />
          </div>
        </div>
      ))}

      {/* Lazy Loading Indicator */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="flex justify-center items-center py-6"
        >
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-black" />
        </div>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="rounded-2xl bg-gray-50 py-4 text-center">
          <p className="text-sm text-gray-500">
            You've viewed all {allResumeAnalysis.length} analyses
          </p>
        </div>
      )}
    </div>
  );
}
