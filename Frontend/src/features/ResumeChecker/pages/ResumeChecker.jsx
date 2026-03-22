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
    <div className="min-h-screen bg-[#f5f5f3] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">AI analysis</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <FileSearch size={22} />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
                    Resume Checker
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 md:text-base">
                    Analyze your resume against a target role and get structured
                    feedback, interview questions, skill gaps, and a preparation plan.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Analysis speed
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">Fast</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Output type
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">Detailed</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Best for
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">ATS prep</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <button
                onClick={() => setFormExpanded(!formExpanded)}
                className="flex w-full items-center justify-between gap-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-6 py-5 text-left transition hover:bg-gray-50 md:px-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">New analysis</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload your resume, add the role context, and generate guidance.
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={20}
                  className={`shrink-0 text-gray-600 transition-transform ${
                    formExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {formExpanded && (
                <div className="p-6 md:p-8">
                  <ResumeAnalysisForm onSuccess={handleFormSuccess} />
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-blue-600">Instant analysis</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Get AI-powered resume feedback in a calm, structured layout.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-blue-600">Actionable insights</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Review skill gaps, suggested questions, and clear next steps.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-blue-600">Previous runs</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Revisit earlier analyses from the sidebar without changing the flow.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4">
              <p className="text-sm font-medium text-blue-600">History</p>
              <h2 className="mt-2 text-xl font-semibold text-gray-900">
                Previous analyses
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Open any earlier analysis result without affecting the current form.
              </p>
            </div>
            <PreviousAnalysisList onSelectAnalysis={handleSelectAnalysis} />
          </div>
        </div>
      </div>
    </div>
  );
}
