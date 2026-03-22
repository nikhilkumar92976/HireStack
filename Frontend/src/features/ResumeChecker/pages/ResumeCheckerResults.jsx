import { useLocation, useNavigate, useParams } from "react-router-dom";
import ResumeAnalysisResult from "../components/ResumeAnalysisResult";
import { useEffect } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import SkeletonLoader from "../../../components/SkeletonLoader";

export default function ResumeCheckerResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { resumeAnalysis, loading, handleGetResumeAnalysisById } =
    useResumeAnalysis();
  const analysis = location.state?.analysis || resumeAnalysis || null;

  // If viewing a specific analysis by ID, fetch it
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

  if (loading && !analysis) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl py-2">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f3] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {analysis ? (
          <ResumeAnalysisResult analysis={analysis} onBack={handleBack} />
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="mb-4 text-gray-600">No analysis data found</p>
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Return to Resume Checker
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
