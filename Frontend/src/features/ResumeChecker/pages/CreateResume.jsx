import { useState } from "react";
import { createResume } from "../services/resumeAnalysis.api";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Briefcase,
  Code,
  GraduationCap,
  Trophy,
  User,
  Target,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const steps = [
  {
    id: "personal-details",
    title: "Personal Details",
    icon: User,
    description: "Basic information about yourself",
  },
  {
    id: "job-description",
    title: "Job Description",
    icon: Target,
    description: "Tell us about the job you're applying for",
  },
  {
    id: "summary",
    title: "Personal Summary",
    icon: User,
    description: "Write a brief summary about yourself",
  },
  {
    id: "skills",
    title: "Skills",
    icon: Code,
    description: "List your technical and soft skills",
  },
  {
    id: "work-history",
    title: "Work Experience",
    icon: Briefcase,
    description: "Describe your professional experience",
  },
  {
    id: "projects",
    title: "Projects",
    icon: FileText,
    description: "Highlight your key projects",
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
    description: "Share your educational background",
  },
  {
    id: "achievements",
    title: "Achievements & Honors",
    icon: Trophy,
    description: "List your achievements and awards",
  },
];

export default function CreateResume() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    jobDescription: "",
    summary: "",
    skills: [],
    workHistory: [],
    projects: [],
    education: [],
    Achievements: [],
    HonorsAndAwards: [],
  });
  const [generatedResumeUrl, setGeneratedResumeUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field) => {
    const newItem = field === "skills" || field === "Achievements" || field === "HonorsAndAwards" ? "" : {};
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }));
  };

  const handleArrayUpdate = (field, index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? (typeof item === "string" ? value : { ...item, [key]: value }) : item
      ),
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownload = () => {
    if (generatedResumeUrl) {
      const a = document.createElement("a");
      a.href = generatedResumeUrl;
      a.download = "generated-resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare data for backend
      const {
        skills: skillsArray,
        workHistory: workHistoryArray,
        projects: projectsArray,
        education: educationArray,
        Achievements: achievementsArray,
        HonorsAndAwards: honorsArray,
        ...otherData
      } = formData;

      const dataToSend = {
        ...otherData,
        skills: skillsArray.join(", "),
        workHistory: workHistoryArray
          .map(exp => `${exp.position || ''} at ${exp.company || ''} (${exp.duration || ''}): ${exp.description || ''}`)
          .join("\n\n"),
        projects: projectsArray
          .map(proj => `${proj.name || ''}: ${proj.description || ''} (${proj.technologies || ''})`)
          .join("\n\n"),
        education: educationArray
          .map(edu => `${edu.degree || ''} from ${edu.institution || ''} (${edu.year || ''})`)
          .join("\n\n"),
        Achievements: achievementsArray.join("\n"),
        HonorsAndAwards: honorsArray.join("\n"),
      };

      const blob = await createResume(dataToSend);
      const url = URL.createObjectURL(blob);
      setGeneratedResumeUrl(url);
    } catch (error) {
      console.error("Error creating resume:", error);
      alert(`Failed to create resume: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;
  const inputClassName =
    "w-full rounded-2xl border border-gray-300 bg-[#fcfcfb] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black";
  const textAreaClassName = `${inputClassName} min-h-32 resize-none`;
  const addButtonClassName =
    "inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800";
  const removeButtonClassName =
    "inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50";
  const itemCardClassName =
    "space-y-3 rounded-3xl border border-gray-200 bg-gray-50 p-4";

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "personal-details":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  className={inputClassName}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail size={16} />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className={inputClassName}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone size={16} />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="New York, NY"
                  className={inputClassName}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Github size={16} />
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  placeholder="https://github.com/johndoe"
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Linkedin size={16} />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        );
      case "job-description":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Job Description *
            </label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => handleInputChange("jobDescription", e.target.value)}
              placeholder="Paste the job description here..."
              className={textAreaClassName}
              required
            />
          </div>
        );
      case "summary":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Personal Summary *
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              placeholder="Write a brief summary about yourself..."
              className={textAreaClassName}
              required
            />
          </div>
        );
      case "skills":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Skills *
              </label>
              <button
                type="button"
                onClick={() => handleArrayAdd("skills")}
                className={addButtonClassName}
              >
                <Plus size={14} />
                Add Skill
              </button>
            </div>
            <div className="space-y-3">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayUpdate("skills", index, null, e.target.value)}
                    placeholder="e.g., JavaScript, React, Python"
                    className={`flex-1 ${inputClassName}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("skills", index)}
                    className="rounded-2xl border border-red-200 bg-white p-3 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "work-history":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Work Experience
              </label>
              <button
                type="button"
                onClick={() => handleArrayAdd("workHistory")}
                className={addButtonClassName}
              >
                <Plus size={14} />
                Add Experience
              </button>
            </div>
            <div className="space-y-4">
              {formData.workHistory.map((exp, index) => (
                <div key={index} className={itemCardClassName}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.position || ""}
                      onChange={(e) => handleArrayUpdate("workHistory", index, "position", e.target.value)}
                      placeholder="Position/Title"
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      value={exp.company || ""}
                      onChange={(e) => handleArrayUpdate("workHistory", index, "company", e.target.value)}
                      placeholder="Company"
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      value={exp.duration || ""}
                      onChange={(e) => handleArrayUpdate("workHistory", index, "duration", e.target.value)}
                      placeholder="Duration (e.g., 2020-2023)"
                      className={inputClassName}
                    />
                  </div>
                  <textarea
                    value={exp.description || ""}
                    onChange={(e) => handleArrayUpdate("workHistory", index, "description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    className={`${inputClassName} min-h-24 resize-none`}
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("workHistory", index)}
                    className={removeButtonClassName}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "projects":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Projects
              </label>
              <button
                type="button"
                onClick={() => handleArrayAdd("projects")}
                className={addButtonClassName}
              >
                <Plus size={14} />
                Add Project
              </button>
            </div>
            <div className="space-y-4">
              {formData.projects.map((proj, index) => (
                <div key={index} className={itemCardClassName}>
                  <input
                    type="text"
                    value={proj.name || ""}
                    onChange={(e) => handleArrayUpdate("projects", index, "name", e.target.value)}
                    placeholder="Project Name"
                    className={inputClassName}
                  />
                  <textarea
                    value={proj.description || ""}
                    onChange={(e) => handleArrayUpdate("projects", index, "description", e.target.value)}
                    placeholder="Project description..."
                    className={`${inputClassName} min-h-24 resize-none`}
                  />
                  <input
                    type="text"
                    value={proj.technologies || ""}
                    onChange={(e) => handleArrayUpdate("projects", index, "technologies", e.target.value)}
                    placeholder="Technologies used (e.g., React, Node.js)"
                    className={inputClassName}
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("projects", index)}
                    className={removeButtonClassName}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "education":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Education
              </label>
              <button
                type="button"
                onClick={() => handleArrayAdd("education")}
                className={addButtonClassName}
              >
                <Plus size={14} />
                Add Education
              </button>
            </div>
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className={itemCardClassName}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) => handleArrayUpdate("education", index, "degree", e.target.value)}
                      placeholder="Degree (e.g., B.S. Computer Science)"
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      value={edu.institution || ""}
                      onChange={(e) => handleArrayUpdate("education", index, "institution", e.target.value)}
                      placeholder="Institution"
                      className={inputClassName}
                    />
                    <input
                      type="text"
                      value={edu.year || ""}
                      onChange={(e) => handleArrayUpdate("education", index, "year", e.target.value)}
                      placeholder="Year (e.g., 2020)"
                      className={inputClassName}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("education", index)}
                    className={removeButtonClassName}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "achievements":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Achievements
              </label>
              <button
                type="button"
                onClick={() => handleArrayAdd("Achievements")}
                className={addButtonClassName}
              >
                <Plus size={14} />
                Add Achievement
              </button>
            </div>
            <div className="space-y-3">
              {formData.Achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => handleArrayUpdate("Achievements", index, null, e.target.value)}
                    placeholder="e.g., Increased team productivity by 30%"
                    className={`flex-1 ${inputClassName}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("Achievements", index)}
                    className="rounded-2xl border border-red-200 bg-white p-3 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Honors and Awards
              </label>
              <button
                type="button"
                onClick={() => handleArrayAdd("HonorsAndAwards")}
                className={addButtonClassName}
              >
                <Plus size={14} />
                Add Honor/Award
              </button>
            </div>
            <div className="space-y-3">
              {formData.HonorsAndAwards.map((honor, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={honor}
                    onChange={(e) => handleArrayUpdate("HonorsAndAwards", index, null, e.target.value)}
                    placeholder="e.g., Dean's List 2022"
                    className={`flex-1 ${inputClassName}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("HonorsAndAwards", index)}
                    className="rounded-2xl border border-red-200 bg-white p-3 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Resume workflow</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <FileText size={22} />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
                    Create Resume
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 md:text-base">
                    Build a polished, job-targeted resume using the same clean,
                    guided design language as the interview flow.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Current step
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {currentStep + 1}/{steps.length}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Focus
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {currentStepData.title}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Output
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900">PDF resume</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-blue-600">Progress</p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Guided resume setup
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Complete each section in order. The form logic stays the same—only the interface is refreshed.
              </p>

              <div className="mt-6 space-y-3">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCurrent = index === currentStep;
                  const isComplete = index < currentStep;

                  return (
                    <div
                      key={step.id}
                      className={`rounded-2xl border p-4 transition ${
                        isCurrent
                          ? "border-blue-200 bg-blue-50"
                          : isComplete
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                            isCurrent
                              ? "bg-blue-600 text-white"
                              : isComplete
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-500"
                          }`}
                        >
                          <StepIcon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {step.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-blue-600">ATS-friendly flow</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Add role context, summary, projects, and experience in a structured sequence.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-blue-600">Responsive layout</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  The new card-based layout stays readable on both desktop and mobile screens.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active section</p>
                  <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold text-gray-900">
                    <IconComponent size={24} />
                    {currentStepData.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    {currentStepData.description}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              <div className="transition-opacity duration-300 ease-in-out">
                {renderStepContent()}
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                {currentStep === steps.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <Sparkles size={16} />
                    {loading ? "Generating..." : "Generate Resume"}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>

            {generatedResumeUrl && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Generated output</p>
                    <h2 className="mt-2 flex items-center gap-2 text-2xl font-semibold text-gray-900">
                      <FileText size={24} className="text-green-600" />
                      Generated Resume
                    </h2>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700"
                  >
                    <FileText size={16} />
                    Download PDF
                  </button>
                </div>
                <div className="overflow-hidden rounded-3xl border border-gray-200">
                  <iframe
                    src={generatedResumeUrl}
                    className="h-96 w-full bg-white"
                    title="Generated Resume"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}