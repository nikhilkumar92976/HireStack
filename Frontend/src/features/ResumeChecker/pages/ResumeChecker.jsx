import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeAnalysisForm from "../components/ResumeAnalysisForm";
import PreviousAnalysisList from "../components/PreviousAnalysisList";
import {
  FileSearch,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function ResumeChecker() {
  const navigate = useNavigate();
  const [formExpanded, setFormExpanded] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const handleFormSuccess = (analysisResult) => {
    // Navigate to results page with the new analysis
    navigate("/resume-checker/results", {
      state: { analysis: analysisResult },
    });
  };

  const handleSelectAnalysis = (analysis) => {
    // Navigate to detailed view of specific analysis
    navigate(`/resume-checker/results/${analysis._id}`, {
      state: { analysis },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileSearch size={28} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Resume Checker</h1>
        </div>
        <p className="text-gray-600">
          Analyze your resume and get personalized recommendations to improve
          your chances of landing your dream job.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section - Takes up 2 columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Form Header */}
            <button
              onClick={() => setFormExpanded(!formExpanded)}
              className="
                w-full px-6 py-4 flex items-center justify-between
                bg-gradient-to-r from-blue-50 to-purple-50
                border-b border-gray-200
                hover:from-blue-100 hover:to-purple-100
                transition
              "
            >
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-blue-600" />
                <div className="text-left">
                  <h2 className="font-semibold text-gray-900">
                    New Analysis
                  </h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Upload your resume and job description
                  </p>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${
                  formExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Form Content */}
            {formExpanded && (
              <div className="p-6 bg-white">
                <ResumeAnalysisForm onSuccess={handleFormSuccess} />
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 text-sm mb-1">
                ✓ Instant Analysis
              </h3>
              <p className="text-xs text-blue-700">
                Get AI-powered feedback in seconds
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 text-sm mb-1">
                📈 Actionable Insights
              </h3>
              <p className="text-xs text-purple-700">
                Specific recommendations for improvement
              </p>
            </div>
          </div>
        </div>

        {/* Previous Analyses Section - Takes up 1 column on desktop */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Previous Analyses
            </h2>
            <PreviousAnalysisList onSelectAnalysis={handleSelectAnalysis} />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">100+</div>
          <p className="text-sm text-gray-600">Resumes Analyzed</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">95%</div>
          <p className="text-sm text-gray-600">User Satisfaction</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">24/7</div>
          <p className="text-sm text-gray-600">Available</p>
        </div>
      </div>
    </div>
  );
}
