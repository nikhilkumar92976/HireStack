import { useState } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { toast } from "react-toastify";
import { User, FileText, Briefcase, Sparkles, Upload, X, CheckCircle2, ArrowUpRight } from "lucide-react";
 
/* ─── STYLES ────────────────────────────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
 
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:none; }
  }
  @keyframes shimmerDrop {
    0%,100% { opacity: .5; }
    50%      { opacity: 1; }
  }
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
 
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
 
  .form-fadeup { animation: fadeUp .4s ease both; }
 
  /* ── field base ── */
  .amber-field {
    width: 100%;
    background: #0d0b09;
    border: 1px solid rgba(180,83,9,0.25);
    border-radius: 14px;
    padding: 11px 16px;
    font-size: 0.875rem;
    color: #fef3c7;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 300;
  }
  .amber-field::placeholder { color: #57534e; }
  .amber-field:focus {
    border-color: rgba(245,158,11,0.5);
    box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
  }
  .amber-field-error {
    border-color: rgba(239,68,68,0.5) !important;
  }
  .amber-field-error:focus {
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08) !important;
  }
 
  /* ── drop zone pulse ── */
  .dropzone-idle {
    border: 2px dashed rgba(180,83,9,0.3);
    background: #0d0b09;
    transition: border-color .2s, background .2s;
  }
  .dropzone-idle:hover {
    border-color: rgba(245,158,11,0.5);
    background: rgba(245,158,11,0.03);
  }
  .dropzone-error {
    border: 2px dashed rgba(239,68,68,0.45);
    background: rgba(239,68,68,0.04);
  }
 
  /* ── details/summary reset ── */
  .amber-details summary { list-style: none; }
  .amber-details summary::-webkit-details-marker { display: none; }
 
  /* ── submit glow ── */
  .submit-glow:hover:not(:disabled) {
    box-shadow: 0 10px 28px rgba(245,158,11,0.28);
    transform: translateY(-1px);
  }
  .submit-glow:active:not(:disabled) { transform: scale(0.98); }
`;
 
/* ─── FIELD LABEL ───────────────────────────────────────────────────────── */
const FieldLabel = ({ icon: Icon, children, optional }) => (
  <label className="jakarta mb-2 flex items-center gap-2 text-sm font-medium text-stone-400">
    {Icon && <Icon size={14} className="text-amber-500/70" />}
    {children}
    {optional && (
      <span className="ml-1 rounded-full border border-amber-700/25 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-widest text-stone-600">
        optional
      </span>
    )}
  </label>
);
 
/* ─── ERROR MSG ─────────────────────────────────────────────────────────── */
const FieldError = ({ msg }) =>
  msg ? (
    <p className="jakarta form-fadeup mt-1.5 flex items-center gap-1 text-xs text-red-400">
      <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
      {msg}
    </p>
  ) : null;
 
/* ─── CHAR COUNTER ──────────────────────────────────────────────────────── */
const CharCount = ({ count }) => (
  <p className="jakarta mt-1.5 text-right text-[0.65rem] font-medium text-stone-700">
    {count} chars
  </p>
);
 
/* ─── HINT CHIPS ────────────────────────────────────────────────────────── */
const HintChip = ({ title, desc }) => (
  <div className="rounded-xl border border-amber-700/15 bg-stone-900/40 p-4">
    <p className="fraunces text-sm font-bold text-amber-200">{title}</p>
    <p className="jakarta mt-1 text-xs font-light leading-4 text-stone-600">{desc}</p>
  </div>
);
 
/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function ResumeAnalysisForm({ onSuccess }) {
  const { handleResumeAnalysis, loading } = useResumeAnalysis();
 
  /* — state unchanged — */
  const [formData, setFormData] = useState({
    title: "",
    resume: "",
    resumeFile: null,
    selfDescription: "",
    jobDescription: "",
  });
  const [errors, setErrors] = useState({});
  const [resumeFileName, setResumeFileName] = useState("");
 
  /* — logic unchanged — */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.resume.trim() && !formData.resumeFile)
      newErrors.resume = "Resume file or text is required";
    if (!formData.jobDescription.trim())
      newErrors.jobDescription = "Job description is required";
    return newErrors;
  };
 
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, resume: "Please upload PDF, DOC, DOCX, or TXT file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, resume: "File size must be less than 5MB" }));
        return;
      }
      setResumeFileName(file.name);
      setFormData((prev) => ({ ...prev, resumeFile: file }));
      if (errors.resume) setErrors((prev) => ({ ...prev, resume: "" }));
    }
  };
 
  const handleRemoveFile = () => {
    setResumeFileName("");
    setFormData((prev) => ({ ...prev, resumeFile: null }));
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields");
      return;
    }
    try {
      let resumeFile = formData.resumeFile;
      if (!resumeFile && formData.resume.trim()) {
        const textBlob = new Blob([formData.resume], { type: "text/plain" });
        resumeFile = new File([textBlob], "resume.txt", { type: "text/plain" });
      }
      const data = await handleResumeAnalysis({
        title: formData.title,
        resumeFile,
        selfDescription: formData.selfDescription,
        jobDescription: formData.jobDescription,
      });
      toast.success("Resume analyzed successfully!");
      if (onSuccess) onSuccess(data.resumeAnalysis);
      setFormData({ title: "", resume: "", resumeFile: null, selfDescription: "", jobDescription: "" });
      setResumeFileName("");
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error(err?.response?.data?.message || "Failed to analyze resume");
    }
  };
 
  return (
    <>
      <style>{globalCss}</style>
 
      <form onSubmit={handleSubmit} className="jakarta space-y-6">
 
        {/* ── hint chips ────────────────────────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-3">
          <HintChip
            title="Upload or paste"
            desc="A file or pasted resume text both work for analysis."
          />
          <HintChip
            title="Role-aware feedback"
            desc="Job title and description shape the matching insights."
          />
          <HintChip
            title="Structured results"
            desc="Get questions, skill gaps, and a prep plan on submit."
          />
        </div>
 
        {/* ── divider ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-amber-700/15" />
          <span className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-stone-700">
            Fill in your details
          </span>
          <div className="h-px flex-1 bg-amber-700/15" />
        </div>
 
        {/* ── job title ─────────────────────────────────────────────── */}
        <div>
          <FieldLabel icon={Briefcase}>Job Title *</FieldLabel>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior React Developer"
            className={`amber-field ${errors.title ? "amber-field-error" : ""}`}
          />
          <FieldError msg={errors.title} />
        </div>
 
        {/* ── resume upload ──────────────────────────────────────────── */}
        <div>
          <FieldLabel icon={FileText}>Your Resume *</FieldLabel>
 
          {/* drop zone or file pill */}
          {!resumeFileName ? (
            <label
              className={`relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl px-4 py-10 text-center transition ${
                errors.resume ? "dropzone-error" : "dropzone-idle"
              }`}
            >
              <div className="pointer-events-none flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    errors.resume
                      ? "border-red-500/30 bg-red-500/[0.08] text-red-400"
                      : "border-amber-700/30 bg-amber-500/[0.08] text-amber-400"
                  }`}
                >
                  <Upload size={22} />
                </div>
                <p className="jakarta mt-3 text-sm font-medium text-stone-400">
                  Click to upload or drag and drop
                </p>
                <p className="jakarta mt-1 text-xs font-light text-stone-600">
                  PDF, DOC, DOCX, or TXT — max 5 MB
                </p>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
            </label>
          ) : (
            <div className="form-fadeup flex items-center justify-between rounded-2xl border border-emerald-700/40 bg-emerald-950/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-700/40 bg-emerald-500/[0.1] text-emerald-400">
                  <CheckCircle2 size={17} />
                </div>
                <div>
                  <p className="jakarta text-sm font-medium text-emerald-300">{resumeFileName}</p>
                  <p className="jakarta text-xs font-light text-emerald-700">Uploaded successfully</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-700/30 text-emerald-600 transition hover:border-red-700/30 hover:bg-red-500/[0.07] hover:text-red-400"
              >
                <X size={15} />
              </button>
            </div>
          )}
 
          <FieldError msg={errors.resume} />
 
          {/* paste fallback */}
          <details className="amber-details mt-4 overflow-hidden rounded-xl border border-amber-700/20 bg-[#0d0b09]">
            <summary className="jakarta cursor-pointer select-none px-4 py-3 text-xs font-medium text-stone-600 transition hover:text-amber-400">
              Or paste resume text instead ↓
            </summary>
            <div className="px-4 pb-4 pt-2">
              <textarea
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                placeholder="Paste your resume content here..."
                rows={5}
                className="amber-field resize-none"
              />
            </div>
          </details>
        </div>
 
        {/* ── job desc + self desc ───────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* job description */}
          <div>
            <FieldLabel icon={Sparkles}>Job Description *</FieldLabel>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste the job description here..."
              rows={7}
              className={`amber-field resize-none ${errors.jobDescription ? "amber-field-error" : ""}`}
            />
            <FieldError msg={errors.jobDescription} />
            <CharCount count={formData.jobDescription.length} />
          </div>
 
          {/* self description */}
          <div>
            <FieldLabel icon={User} optional>About Yourself</FieldLabel>
            <textarea
              name="selfDescription"
              value={formData.selfDescription}
              onChange={handleChange}
              placeholder="Tell us about your experience, skills, and achievements..."
              rows={7}
              className="amber-field resize-none"
            />
            <CharCount count={formData.selfDescription.length} />
          </div>
        </div>
 
        {/* ── submit ────────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={loading}
          className={`submit-glow jakarta inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
            loading
              ? "cursor-not-allowed bg-stone-800 text-stone-600"
              : "bg-amber-500 text-[#080706] hover:bg-amber-400"
          }`}
        >
          {loading ? (
            <>
              <span
                className="h-4 w-4 rounded-full border-2 border-stone-600 border-t-stone-400"
                style={{ animation: "spin-slow 0.9s linear infinite" }}
              />
              Analyzing your resume…
            </>
          ) : (
            <>
              Analyze Resume
              <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
 
      </form>
    </>
  );
}