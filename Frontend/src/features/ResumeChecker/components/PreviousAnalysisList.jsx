import { useEffect, useState, useRef, useCallback } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { Calendar, Briefcase, ChevronRight } from "lucide-react";

export default function PreviousAnalysisList({ onSelectAnalysis }) {
  const { allResumeAnalysis, handleGetAllResumeAnalysis, loading } =
    useResumeAnalysis();
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
  }, []);

  // Implement lazy loading logic
  useEffect(() => {
    if (allResumeAnalysis && allResumeAnalysis.length > 0) {
      const startIndex = 0;
      const endIndex = currentPage * itemsPerPage;
      const itemsToDisplay = allResumeAnalysis.slice(startIndex, endIndex);
      setDisplayedItems(itemsToDisplay);
      setHasMore(endIndex < allResumeAnalysis.length);
    }
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
            className="h-24 bg-gray-200 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!allResumeAnalysis || allResumeAnalysis.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No previous analyses yet.</p>
        <p className="text-gray-400 text-xs mt-2">
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
          className="
            p-4 bg-white border border-gray-200 rounded-lg
            hover:shadow-md hover:border-gray-300 cursor-pointer
            transition duration-200
            group
          "
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
                  <div className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
        </div>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            You've viewed all {allResumeAnalysis.length} analyses
          </p>
        </div>
      )}
    </div>
  );
}
