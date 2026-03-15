import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
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
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("skills", index)}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={14} />
                Add Experience
              </button>
            </div>
            <div className="space-y-4">
              {formData.workHistory.map((exp, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={exp.position || ""}
                      onChange={(e) => handleArrayUpdate("workHistory", index, "position", e.target.value)}
                      placeholder="Position/Title"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={exp.company || ""}
                      onChange={(e) => handleArrayUpdate("workHistory", index, "company", e.target.value)}
                      placeholder="Company"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={exp.duration || ""}
                      onChange={(e) => handleArrayUpdate("workHistory", index, "duration", e.target.value)}
                      placeholder="Duration (e.g., 2020-2023)"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    value={exp.description || ""}
                    onChange={(e) => handleArrayUpdate("workHistory", index, "description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("workHistory", index)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
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
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={14} />
                Add Project
              </button>
            </div>
            <div className="space-y-4">
              {formData.projects.map((proj, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <input
                    type="text"
                    value={proj.name || ""}
                    onChange={(e) => handleArrayUpdate("projects", index, "name", e.target.value)}
                    placeholder="Project Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    value={proj.description || ""}
                    onChange={(e) => handleArrayUpdate("projects", index, "description", e.target.value)}
                    placeholder="Project description..."
                    className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <input
                    type="text"
                    value={proj.technologies || ""}
                    onChange={(e) => handleArrayUpdate("projects", index, "technologies", e.target.value)}
                    placeholder="Technologies used (e.g., React, Node.js)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("projects", index)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
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
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={14} />
                Add Education
              </button>
            </div>
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) => handleArrayUpdate("education", index, "degree", e.target.value)}
                      placeholder="Degree (e.g., B.S. Computer Science)"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={edu.institution || ""}
                      onChange={(e) => handleArrayUpdate("education", index, "institution", e.target.value)}
                      placeholder="Institution"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={edu.year || ""}
                      onChange={(e) => handleArrayUpdate("education", index, "year", e.target.value)}
                      placeholder="Year (e.g., 2020)"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("education", index)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
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
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
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
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("Achievements", index)}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
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
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("HonorsAndAwards", index)}
                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText size={28} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Create Resume</h1>
        </div>
        <p className="text-gray-600">
          Generate a professional resume tailored to your job application.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index === currentStep
                  ? "text-blue-600"
                  : index < currentStep
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index === currentStep
                    ? "bg-blue-600 text-white"
                    : index < currentStep
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    index < currentStep ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
            <IconComponent size={24} />
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mt-1">{currentStepData.description}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="transition-opacity duration-300 ease-in-out">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Sparkles size={16} />
              {loading ? "Generating..." : "Generate Resume"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Generated Resume Display */}
      {generatedResumeUrl && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={24} className="text-green-600" />
              Generated Resume
            </h2>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FileText size={16} />
              Download PDF
            </button>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <iframe
              src={generatedResumeUrl}
              className="w-full h-96"
              title="Generated Resume"
            />
          </div>
        </div>
      )}
    </div>
  );
}