import { formatTime } from "../utils/interview.utils";

const ResultPanel = ({ title, content }) => (
  <div className="rounded-2xl bg-gray-50 p-4">
    <p className="text-sm font-medium text-gray-900">{title}</p>
    <p className="mt-2 text-sm leading-6 text-gray-600">{content}</p>
  </div>
);

const ListPanel = ({ title, items, emptyMessage }) => (
  <div className="rounded-2xl border border-gray-200 p-4">
    <p className="text-sm font-medium text-gray-900">{title}</p>
    {items.length ? (
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-3 text-sm text-gray-500">{emptyMessage}</p>
    )}
  </div>
);

export default function InterviewResults({
  result,
  resultDetails,
  responses,
  questions,
  elapsedSeconds,
  jobTitle,
  onReset,
  onBack,
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-600">Interview result</p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900">
              {result?.title || jobTitle || "Interview summary"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your interview has been submitted and scored using the existing backend API.
            </p>
          </div>

          <div className="rounded-3xl bg-black px-6 py-4 text-center text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Score</p>
            <p className="mt-2 text-4xl font-semibold">{resultDetails?.interviewScore ?? "--"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ResultPanel
            title="Overall feedback"
            content={
              resultDetails?.feedback ||
              "Interview submitted successfully. Feedback will appear here when returned by the API."
            }
          />
          <ResultPanel
            title="Session details"
            content={`Answered ${responses.filter(Boolean).length} questions in ${formatTime(elapsedSeconds)}.`}
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ListPanel
            title="Strengths"
            items={resultDetails?.strengths || []}
            emptyMessage="No strengths returned by the API."
          />
          <ListPanel
            title="Improvements"
            items={resultDetails?.improvements || []}
            emptyMessage="No improvements returned by the API."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            Start another interview
          </button>
          <button
            type="button"
            onClick={onBack}
            className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back to dashboard
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="text-xl font-semibold text-gray-900">Question review</h3>
        <div className="mt-5 space-y-4">
          {questions.map((question, index) => (
            <div key={`${question.question}-${index}`} className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm font-medium text-blue-600">Question {index + 1}</p>
              <h4 className="mt-1 font-semibold text-gray-900">{question.question}</h4>
              <p className="mt-3 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Your answer:</span>{" "}
                {responses[index]?.answer || "No answer recorded."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}