import { useLocation, useNavigate, useParams } from "react-router-dom";
import ResumeAnalysisResult from "../components/ResumeAnalysisResult";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import SkeletonLoader from "../../../components/SkeletonLoader";

export default function ResumeCheckerResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(
    location.state?.analysis || null
  );
  const { resumeAnalysis, loading, handleGetResumeAnalysisById } =
    useResumeAnalysis();

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

  // Update analysis when resumeAnalysis from context changes
  useEffect(() => {
    if (resumeAnalysis && !analysis) {
      setAnalysis(resumeAnalysis);
    }
  }, [resumeAnalysis, analysis]);

  const handleBack = () => {
    navigate("/resume-checker");
  };

  if (loading && !analysis) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      {/* Header with Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
      >
        <ArrowLeft size={20} />
        Back to Resume Checker
      </button>

      {/* Results Content */}
      {analysis ? (
        <ResumeAnalysisResult analysis={analysis} onBack={handleBack} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">No analysis data found</p>
          <button
            onClick={handleBack}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Return to Resume Checker
          </button>
        </div>
      )}
    </div>
  );
}
