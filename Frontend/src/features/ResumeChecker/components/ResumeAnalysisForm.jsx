import { useState } from "react";
import { useResumeAnalysis } from "../hooks/useResumeAnalysis";
import { toast } from "react-toastify";
import { User, FileText, Briefcase, Sparkles, Upload, X } from "lucide-react";

export default function ResumeAnalysisForm({ onSuccess }) {
  const { handleResumeAnalysis, loading } = useResumeAnalysis();
  const [formData, setFormData] = useState({
    title: "",
    resume: "",
    resumeFile: null,
    selfDescription: "",
    jobDescription: "",
  });

  const [errors, setErrors] = useState({});
  const [resumeFileName, setResumeFileName] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.resume.trim() && !formData.resumeFile) 
      newErrors.resume = "Resume file or text is required";
    if (!formData.jobDescription.trim())
      newErrors.jobDescription = "Job description is required";
    // selfDescription is optional
    return newErrors;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload PDF, DOC, DOCX, or TXT file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be less than 5MB",
        }));
        return;
      }

      setResumeFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
      }));

      // Clear error when file is selected
      if (errors.resume) {
        setErrors((prev) => ({
          ...prev,
          resume: "",
        }));
      }
    }
  };

  const handleRemoveFile = () => {
    setResumeFileName("");
    setFormData((prev) => ({
      ...prev,
      resumeFile: null,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

      // If no file is selected but text is provided, create a File object from text
      if (!resumeFile && formData.resume.trim()) {
        const textBlob = new Blob([formData.resume], { type: "text/plain" });
        resumeFile = new File([textBlob], "resume.txt", { type: "text/plain" });
      }

      const data = await handleResumeAnalysis({
        title: formData.title,
        resumeFile: resumeFile,
        selfDescription: formData.selfDescription,
        jobDescription: formData.jobDescription,
      });

      toast.success("Resume analyzed successfully!");

      // Call the callback with the result
      if (onSuccess) {
        onSuccess(data.resumeAnalysis);
      }

      // Reset form
      setFormData({
        title: "",
        resume: "",
        resumeFile: null,
        selfDescription: "",
        jobDescription: "",
      });
      setResumeFileName("");
    } catch (err) {
      console.error("Form submission error:", err);
      const errorMsg =
        err?.response?.data?.message || "Failed to analyze resume";
      toast.error(errorMsg);
    }
  };

  const getFieldClassName = (hasError = false) => `w-full rounded-2xl border bg-[#fcfcfb] px-4 py-3 text-sm text-gray-900 outline-none transition ${
    hasError ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-black"
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 rounded-2xl bg-gray-50 p-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="font-medium text-gray-900">Upload or paste</p>
          <p className="mt-1 text-xs text-gray-500">
            Either a file or pasted resume text can be analyzed.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="font-medium text-gray-900">Role-aware feedback</p>
          <p className="mt-1 text-xs text-gray-500">
            The job title and description shape the matching insights.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="font-medium text-gray-900">Structured results</p>
          <p className="mt-1 text-xs text-gray-500">
            Get questions, skill gaps, and a preparation plan after submission.
          </p>
        </div>
      </div>

      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Briefcase size={16} />
            Job Title *
          </div>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Senior React Developer"
          className={getFieldClassName(Boolean(errors.title))}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Resume */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            Your Resume *
          </div>
        </label>

        {!resumeFileName ? (
          <label
            className={`
              relative flex w-full cursor-pointer flex-col items-center justify-center
              rounded-3xl border-2 border-dashed px-4 py-10 text-center transition
              ${
                errors.resume
                  ? "border-red-300 bg-red-50 hover:bg-red-100"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }
            `}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload
                size={32}
                className={errors.resume ? "text-red-500" : "text-gray-400"}
              />
              <p className="mt-3 text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOC, DOCX, or TXT (Max 5MB)
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
          <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-green-600" />
              <div>
                <p className="font-medium text-green-900">{resumeFileName}</p>
                <p className="text-xs text-green-700">File uploaded successfully</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="rounded-xl p-2 transition hover:bg-green-100"
            >
              <X size={18} className="text-green-600" />
            </button>
          </div>
        )}

        {errors.resume && (
          <p className="mt-1 text-xs text-red-500">{errors.resume}</p>
        )}

        {/* Alternative text input */}
        <div className="mt-4 relative">
          <details className="cursor-pointer rounded-2xl border border-gray-200 bg-white px-4 py-3">
            <summary className="text-xs font-medium text-gray-500 hover:text-gray-700">
              Or paste resume text instead
            </summary>
            <textarea
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              placeholder="Paste your resume content here..."
              rows="4"
              className="mt-3 min-h-32 w-full rounded-2xl border border-gray-300 bg-[#fcfcfb] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black"
            />
          </details>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              Job Description *
            </div>
          </label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste the job description here..."
            rows="6"
            className={`${getFieldClassName(Boolean(errors.jobDescription))} min-h-40 resize-none`}
          />
          {errors.jobDescription && (
            <p className="mt-1 text-xs text-red-500">{errors.jobDescription}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.jobDescription.length} characters
          </p>
        </div>

        {/* Self Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              About Yourself (Optional)
            </div>
          </label>
          <textarea
            name="selfDescription"
            value={formData.selfDescription}
            onChange={handleChange}
            placeholder="Tell us about your experience, skills, and achievements..."
            rows="4"
            className={`${getFieldClassName()} min-h-40 resize-none`}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.selfDescription.length} characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`
          inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-white transition duration-200
          ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-black hover:bg-gray-800 active:scale-95"
          }
        `}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </form>
  );
}
