import {
  CheckCircle2,
  ClipboardList,
  Mic,
  Play,
  Send,
  Square,
  TimerReset,
  Volume2,
} from "lucide-react";
import { formatTime } from "../utils/interview.utils";

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2 text-gray-500">
      {icon}
      <p className="text-sm">{label}</p>
    </div>
    <p className="mt-3 text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

export default function InterviewSessionPanel({
  currentQuestion,
  currentIndex,
  questionCount,
  answeredQuestions,
  elapsedSeconds,
  isSpeaking,
  isRecording,
  loading,
  draftAnswer,
  sessionError,
  recordingUrl,
  onAnswerChange,
  onReplay,
  onStartRecording,
  onStopRecording,
  onAdvance,
}) {
  if (!currentQuestion) {
    return null;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<ClipboardList size={18} />}
          label="Question"
          value={`${currentIndex + 1} / ${questionCount}`}
        />
        <StatCard
          icon={<CheckCircle2 size={18} />}
          label="Answered"
          value={`${answeredQuestions} saved`}
        />
        <StatCard
          icon={<TimerReset size={18} />}
          label="Elapsed"
          value={formatTime(elapsedSeconds)}
        />
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Question {currentIndex + 1}</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">{currentQuestion.question}</h2>
          </div>

          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <Volume2 size={16} />
            Replay question
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
          {isSpeaking
            ? "The interviewer is reading this question aloud. Listen, think, then record your answer."
            : "Speak naturally. Your voice transcript appears below and can be edited before you continue."}
        </div>

        {sessionError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {sessionError}
          </div>
        )}

        <label className="mb-2 block text-sm font-medium text-gray-700">Your answer transcript</label>
        <textarea
          value={draftAnswer}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder="Press start recording and answer naturally, or type your answer here..."
          className="min-h-48 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-black"
        />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={onStartRecording}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
            >
              <Mic size={16} />
              Start answer recording
            </button>
          ) : (
            <button
              type="button"
              onClick={onStopRecording}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
            >
              <Square size={16} />
              Stop recording
            </button>
          )}

          <button
            type="button"
            onClick={onAdvance}
            disabled={loading || isRecording}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {currentIndex === questionCount - 1 ? <Send size={16} /> : <Play size={16} />}
            {loading
              ? "Submitting..."
              : currentIndex === questionCount - 1
                ? "Submit interview"
                : "Save & next question"}
          </button>
        </div>

        {recordingUrl && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Recorded answer preview</p>
            <audio controls src={recordingUrl} className="w-full" />
          </div>
        )}
      </div>
    </>
  );
}