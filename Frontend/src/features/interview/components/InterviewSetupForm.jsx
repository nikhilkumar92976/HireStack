import { Play, Sparkles } from "lucide-react";

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  textarea = false,
}) => {
  const classes = `w-full rounded-2xl border px-4 py-3 text-sm text-gray-900 outline-none transition ${
    error ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"
  }`;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${classes} min-h-32`}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={classes}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const InfoCard = ({ title, description }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4">
    <p className="font-medium text-gray-900">{title}</p>
    <p className="mt-1 text-xs text-gray-500">{description}</p>
  </div>
);

export default function InterviewSetupForm({
  formData,
  errors,
  loading,
  sessionError,
  onChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <Sparkles size={20} className="text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Interview setup</h2>
          <p className="text-sm text-gray-500">
            Tell us the role, your profile, and the job description to generate personalized interview questions.
          </p>
        </div>
      </div>

      {sessionError && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {sessionError}
        </div>
      )}

      <div className="space-y-5">
        <Field
          label="Job title"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={onChange}
          placeholder="e.g. Frontend Developer"
          error={errors.jobTitle}
        />

        <Field
          label="Self description"
          name="selfDescription"
          value={formData.selfDescription}
          onChange={onChange}
          placeholder="Summarize your experience, skills, and strengths"
          error={errors.selfDescription}
          textarea
        />

        <Field
          label="Job description"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={onChange}
          placeholder="Paste the job description here"
          error={errors.jobDescription}
          textarea
        />
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl bg-gray-50 p-4 md:grid-cols-3">
        <InfoCard
          title="Interview starts first"
          description="The session starts immediately; camera permission will not block the API call."
        />
        <InfoCard
          title="Questions read aloud"
          description="Each question is automatically spoken when it appears." 
        />
        <InfoCard
          title="Voice or typed answers"
          description="Record your answer when supported, or type/edit the transcript manually."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        <Play size={18} />
        {loading ? "Preparing interview..." : "Start interview"}
      </button>
    </form>
  );
}