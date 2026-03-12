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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className={`
            w-full px-4 py-2 text-sm
            border rounded-lg
            focus:outline-none focus:ring-1
            ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-black"
            }
          `}
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
              relative flex flex-col items-center justify-center
              w-full py-8 px-4 border-2 border-dashed rounded-lg
              cursor-pointer transition
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
              <p className="mt-2 text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
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
          <div className="p-4 bg-green-50 border border-green-300 rounded-lg flex items-center justify-between">
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
              className="p-1 hover:bg-green-200 rounded transition"
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
          <details className="cursor-pointer">
            <summary className="text-xs text-gray-500 hover:text-gray-700">
              Or paste resume text instead
            </summary>
            <textarea
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              placeholder="Paste your resume content here..."
              rows="4"
              className="
                w-full px-4 py-2 text-sm mt-2
                border border-gray-300 rounded-lg resize-none
                focus:outline-none focus:ring-1 focus:ring-black
              "
            />
          </details>
        </div>
      </div>

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
          className={`
            w-full px-4 py-2 text-sm
            border rounded-lg resize-none
            focus:outline-none focus:ring-1
            ${
              errors.jobDescription
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-black"
            }
          `}
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
          className="
            w-full px-4 py-2 text-sm
            border border-gray-300 rounded-lg resize-none
            focus:outline-none focus:ring-1 focus:ring-black
          "
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.selfDescription.length} characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`
          w-full py-3 px-4
          font-medium text-white
          rounded-lg
          transition duration-200
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 active:scale-95"
          }
        `}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </form>
  );
}
