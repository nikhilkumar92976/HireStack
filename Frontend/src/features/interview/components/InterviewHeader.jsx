import { ArrowLeft, Brain } from "lucide-react";

const StatusChip = ({ label, muted = false }) => (
  <div
    className={`rounded-full px-4 py-2 text-sm font-medium ${
      muted ? "bg-gray-100 text-gray-600" : "bg-black text-white"
    }`}
  >
    {label}
  </div>
);

export default function InterviewHeader({ stage, questionCount, onBack }) {
  const stageLabel =
    stage === "setup"
      ? "Ready to begin"
      : stage === "interview"
        ? "Interview live"
        : "Interview completed";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
            <Brain size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-gray-900">AI Mock Interview</h1>
            <p className="text-sm text-gray-500">
              Start with your role details, answer questions one by one, and get scored instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <StatusChip label={stageLabel} />
        <StatusChip label={`${questionCount || 0} questions`} muted />
      </div>
    </div>
  );
}