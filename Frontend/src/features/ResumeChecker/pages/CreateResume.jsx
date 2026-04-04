import { useState } from "react";
import { createResume } from "../services/resumeAnalysis.api";
import {
  FileText, ChevronLeft, ChevronRight, Sparkles, Briefcase,
  Code, GraduationCap, Trophy, User, Target, Plus, Trash2,
  Github, Linkedin, Mail, Phone, MapPin, CheckCircle2, ArrowUpRight,
} from "lucide-react";
 
/* ─── DATA ───────────────────────────────────────────────────────────────── */
const steps = [
  { id: "personal-details", title: "Personal Details",      icon: User,          description: "Basic information about yourself" },
  { id: "job-description",  title: "Job Description",       icon: Target,        description: "Tell us about the job you're applying for" },
  { id: "summary",          title: "Personal Summary",      icon: User,          description: "Write a brief summary about yourself" },
  { id: "skills",           title: "Skills",                icon: Code,          description: "List your technical and soft skills" },
  { id: "work-history",     title: "Work Experience",       icon: Briefcase,     description: "Describe your professional experience" },
  { id: "projects",         title: "Projects",              icon: FileText,      description: "Highlight your key projects" },
  { id: "education",        title: "Education",             icon: GraduationCap, description: "Share your educational background" },
  { id: "achievements",     title: "Achievements & Honors", icon: Trophy,        description: "List your achievements and awards" },
];
 
/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
  @keyframes drift {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(35px,-25px) scale(1.05); }
    66%  { transform: translate(-20px,35px) scale(.97); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:none; }
  }
  .a1 { animation: fadeUp .5s .05s ease both; }
  .a2 { animation: fadeUp .5s .15s ease both; }
  .a3 { animation: fadeUp .5s .25s ease both; }
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080706; }
  ::-webkit-scrollbar-thumb { background: rgba(217,119,6,.3); border-radius: 10px; }
  .step-fade { animation: fadeUp .35s ease both; }
`;
 
/* ─── SHARED INPUT CLASSES ───────────────────────────────────────────────── */
const inp  = "jakarta w-full rounded-xl border border-amber-700/20 bg-stone-900/60 px-4 py-3 text-sm text-amber-50 placeholder-stone-600 outline-none transition focus:border-amber-500/50 focus:bg-stone-900 focus:ring-1 focus:ring-amber-500/20";
const ta   = `${inp} min-h-32 resize-none`;
const card = "space-y-3 rounded-xl border border-amber-700/20 bg-stone-900/40 p-4";
 
/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function CreateResume() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", location: "", github: "", linkedin: "",
    jobDescription: "", summary: "", skills: [], workHistory: [],
    projects: [], education: [], Achievements: [], HonorsAndAwards: [],
  });
  const [generatedResumeUrl, setGeneratedResumeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
 
  /* handlers — untouched */
  const handleInputChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));
  const handleArrayAdd    = (field) => {
    const newItem = ["skills","Achievements","HonorsAndAwards"].includes(field) ? "" : {};
    setFormData(p => ({ ...p, [field]: [...p[field], newItem] }));
  };
  const handleArrayUpdate = (field, index, key, value) =>
    setFormData(p => ({ ...p, [field]: p[field].map((item, i) =>
      i === index ? (typeof item === "string" ? value : { ...item, [key]: value }) : item
    )}));
  const handleArrayRemove = (field, index) =>
    setFormData(p => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
  const handleNext = () => currentStep < steps.length - 1 && setCurrentStep(s => s + 1);
  const handlePrev = () => currentStep > 0 && setCurrentStep(s => s - 1);
  const handleDownload = () => {
    if (!generatedResumeUrl) return;
    const a = document.createElement("a");
    a.href = generatedResumeUrl; a.download = "generated-resume.pdf";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { skills: sa, workHistory: wa, projects: pa, education: ea, Achievements: aa, HonorsAndAwards: ha, ...other } = formData;
      const dataToSend = {
        ...other,
        skills: sa.join(", "),
        workHistory: wa.map(e => `${e.position||''} at ${e.company||''} (${e.duration||''}): ${e.description||''}`).join("\n\n"),
        projects:    pa.map(p => `${p.name||''}: ${p.description||''} (${p.technologies||''})`).join("\n\n"),
        education:   ea.map(e => `${e.degree||''} from ${e.institution||''} (${e.year||''})`).join("\n\n"),
        Achievements: aa.join("\n"),
        HonorsAndAwards: ha.join("\n"),
      };
      const blob = await createResume(dataToSend);
      setGeneratedResumeUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Error creating resume:", err);
      alert(`Failed to create resume: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };
 
  const cur = steps[currentStep];
  const Icon = cur.icon;
 
  /* ── step content ── */
  const renderStepContent = () => {
    switch (cur.id) {
      case "personal-details": return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { field:"name",     label:"Full Name",  icon: User,     type:"text",  ph:"John Doe" },
              { field:"email",    label:"Email",      icon: Mail,     type:"email", ph:"john@example.com" },
              { field:"phone",    label:"Phone",      icon: Phone,    type:"tel",   ph:"+1 (555) 123-4567" },
              { field:"location", label:"Location",   icon: MapPin,   type:"text",  ph:"New York, NY" },
            ].map(({ field, label, icon: FIcon, type, ph }) => (
              <div key={field} className="space-y-2">
                <Label icon={<FIcon size={13} />}>{label}</Label>
                <input type={type} value={formData[field]} placeholder={ph}
                  onChange={e => handleInputChange(field, e.target.value)} className={inp} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { field:"github",   label:"GitHub",   icon: Github,   ph:"https://github.com/johndoe" },
              { field:"linkedin", label:"LinkedIn",  icon: Linkedin, ph:"https://linkedin.com/in/johndoe" },
            ].map(({ field, label, icon: FIcon, ph }) => (
              <div key={field} className="space-y-2">
                <Label icon={<FIcon size={13} />}>{label}</Label>
                <input type="url" value={formData[field]} placeholder={ph}
                  onChange={e => handleInputChange(field, e.target.value)} className={inp} />
              </div>
            ))}
          </div>
        </div>
      );
      case "job-description": return (
        <div className="space-y-3">
          <Label>Job Description *</Label>
          <textarea value={formData.jobDescription} onChange={e => handleInputChange("jobDescription", e.target.value)}
            placeholder="Paste the job description here..." className={ta} />
        </div>
      );
      case "summary": return (
        <div className="space-y-3">
          <Label>Personal Summary *</Label>
          <textarea value={formData.summary} onChange={e => handleInputChange("summary", e.target.value)}
            placeholder="Write a brief summary about yourself..." className={ta} />
        </div>
      );
      case "skills": return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Skills *</Label>
            <AddBtn onClick={() => handleArrayAdd("skills")}><Plus size={13} /> Add Skill</AddBtn>
          </div>
          <div className="space-y-2.5">
            {formData.skills.map((skill, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={skill} onChange={e => handleArrayUpdate("skills", i, null, e.target.value)}
                  placeholder="e.g., JavaScript, React, Python" className={`flex-1 ${inp}`} />
                <DelBtn onClick={() => handleArrayRemove("skills", i)} />
              </div>
            ))}
          </div>
        </div>
      );
      case "work-history": return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Work Experience</Label>
            <AddBtn onClick={() => handleArrayAdd("workHistory")}><Plus size={13} /> Add Experience</AddBtn>
          </div>
          <div className="space-y-4">
            {formData.workHistory.map((exp, i) => (
              <div key={i} className={card}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input type="text" value={exp.position||""} onChange={e => handleArrayUpdate("workHistory",i,"position",e.target.value)} placeholder="Position / Title" className={inp} />
                  <input type="text" value={exp.company||""}  onChange={e => handleArrayUpdate("workHistory",i,"company",e.target.value)}  placeholder="Company" className={inp} />
                  <input type="text" value={exp.duration||""} onChange={e => handleArrayUpdate("workHistory",i,"duration",e.target.value)} placeholder="Duration (e.g., 2020–2023)" className={inp} />
                </div>
                <textarea value={exp.description||""} onChange={e => handleArrayUpdate("workHistory",i,"description",e.target.value)}
                  placeholder="Describe your responsibilities and achievements..." className={`${inp} min-h-24 resize-none`} />
                <DelBtn onClick={() => handleArrayRemove("workHistory", i)} label="Remove" />
              </div>
            ))}
          </div>
        </div>
      );
      case "projects": return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Projects</Label>
            <AddBtn onClick={() => handleArrayAdd("projects")}><Plus size={13} /> Add Project</AddBtn>
          </div>
          <div className="space-y-4">
            {formData.projects.map((proj, i) => (
              <div key={i} className={card}>
                <input type="text" value={proj.name||""} onChange={e => handleArrayUpdate("projects",i,"name",e.target.value)} placeholder="Project Name" className={inp} />
                <textarea value={proj.description||""} onChange={e => handleArrayUpdate("projects",i,"description",e.target.value)}
                  placeholder="Project description..." className={`${inp} min-h-24 resize-none`} />
                <input type="text" value={proj.technologies||""} onChange={e => handleArrayUpdate("projects",i,"technologies",e.target.value)} placeholder="Technologies used (e.g., React, Node.js)" className={inp} />
                <DelBtn onClick={() => handleArrayRemove("projects", i)} label="Remove" />
              </div>
            ))}
          </div>
        </div>
      );
      case "education": return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Education</Label>
            <AddBtn onClick={() => handleArrayAdd("education")}><Plus size={13} /> Add Education</AddBtn>
          </div>
          <div className="space-y-4">
            {formData.education.map((edu, i) => (
              <div key={i} className={card}>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input type="text" value={edu.degree||""}      onChange={e => handleArrayUpdate("education",i,"degree",e.target.value)}      placeholder="Degree (e.g., B.S. Computer Science)" className={inp} />
                  <input type="text" value={edu.institution||""} onChange={e => handleArrayUpdate("education",i,"institution",e.target.value)} placeholder="Institution" className={inp} />
                  <input type="text" value={edu.year||""}        onChange={e => handleArrayUpdate("education",i,"year",e.target.value)}        placeholder="Year (e.g., 2020)" className={inp} />
                </div>
                <DelBtn onClick={() => handleArrayRemove("education", i)} label="Remove" />
              </div>
            ))}
          </div>
        </div>
      );
      case "achievements": return (
        <div className="space-y-6">
          {/* achievements */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Achievements</Label>
              <AddBtn onClick={() => handleArrayAdd("Achievements")}><Plus size={13} /> Add Achievement</AddBtn>
            </div>
            {formData.Achievements.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={a} onChange={e => handleArrayUpdate("Achievements",i,null,e.target.value)}
                  placeholder="e.g., Increased team productivity by 30%" className={`flex-1 ${inp}`} />
                <DelBtn onClick={() => handleArrayRemove("Achievements", i)} />
              </div>
            ))}
          </div>
          {/* honors */}
          <div className="space-y-3 border-t border-amber-700/15 pt-6">
            <div className="flex items-center justify-between">
              <Label>Honors & Awards</Label>
              <AddBtn onClick={() => handleArrayAdd("HonorsAndAwards")}><Plus size={13} /> Add Honor</AddBtn>
            </div>
            {formData.HonorsAndAwards.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={h} onChange={e => handleArrayUpdate("HonorsAndAwards",i,null,e.target.value)}
                  placeholder="e.g., Dean's List 2022" className={`flex-1 ${inp}`} />
                <DelBtn onClick={() => handleArrayRemove("HonorsAndAwards", i)} />
              </div>
            ))}
          </div>
        </div>
      );
      default: return null;
    }
  };
 
  return (
    <>
      <style>{globalCss}</style>
 
      <div className="relative min-h-screen overflow-hidden bg-[#080706]">
        {/* blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-700 opacity-[0.12] blur-[100px]"
            style={{ animation: "drift 22s linear infinite" }} />
          <div className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-900 opacity-[0.12] blur-[90px]"
            style={{ animation: "drift 28s linear infinite reverse" }} />
        </div>
 
        <div className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 py-6 md:px-6">
 
          {/* ── HEADER ── */}
          <div className="a1 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="jakarta mb-2 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                  <span className="inline-block h-px w-5 bg-amber-400" />
                  Resume workflow
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-700/30 bg-amber-500/10 text-amber-400">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h1 className="fraunces text-3xl font-black tracking-tight text-amber-50 md:text-4xl">
                      Create <em className="font-light italic text-amber-400">Resume</em>
                    </h1>
                    <p className="jakarta mt-0.5 text-sm font-light text-stone-500">
                      Build a polished, job-targeted resume step by step.
                    </p>
                  </div>
                </div>
              </div>
 
              {/* mini stats */}
              <div className="grid grid-cols-3 gap-3 lg:min-w-[380px]">
                {[
                  { label: "Current step", val: `${currentStep + 1} / ${steps.length}` },
                  { label: "Focus",        val: cur.title },
                  { label: "Output",       val: "PDF resume" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-amber-700/20 bg-stone-900/50 p-3.5">
                    <p className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-stone-600">{s.label}</p>
                    <p className="fraunces mt-1.5 text-base font-bold leading-tight text-amber-400">{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          {/* ── BODY GRID ── */}
          <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
 
            {/* ── SIDEBAR ── */}
            <aside className="a2 space-y-4 xl:sticky xl:top-6 xl:self-start">
              <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
                <div className="jakarta mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                  <span className="inline-block h-px w-4 bg-amber-400" />
                  Progress
                </div>
                <h2 className="fraunces text-xl font-black text-amber-50">Guided setup</h2>
                <p className="jakarta mt-1 text-[0.78rem] font-light text-stone-600">
                  Complete each section in order.
                </p>
 
                <div className="mt-5 space-y-2">
                  {steps.map((step, i) => {
                    const SIcon = step.icon;
                    const isCur = i === currentStep;
                    const isDone = i < currentStep;
                    return (
                      <div key={step.id} className={`rounded-xl border p-3.5 transition
                        ${isCur  ? "border-amber-500/40 bg-amber-500/[0.08]" :
                          isDone ? "border-emerald-600/25 bg-emerald-600/[0.06]" :
                                   "border-amber-700/15 bg-stone-900/30"}`}>
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition
                            ${isCur  ? "bg-amber-500 text-[#080706]" :
                              isDone ? "bg-emerald-600/20 text-emerald-400" :
                                       "bg-stone-800 text-stone-600"}`}>
                            {isDone ? <CheckCircle2 size={15} /> : <SIcon size={15} />}
                          </div>
                          <div className="min-w-0">
                            <p className={`jakarta text-sm font-semibold
                              ${isCur ? "text-amber-300" : isDone ? "text-emerald-400" : "text-stone-500"}`}>
                              {step.title}
                            </p>
                            <p className="jakarta mt-0.5 text-[0.7rem] font-light leading-4 text-stone-700">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
 
              {/* info cards */}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {[
                  { tag:"ATS-friendly flow",  body:"Add role context, summary, projects, and experience in a structured sequence." },
                  { tag:"Responsive layout",  body:"Card-based layout stays readable on both desktop and mobile screens." },
                ].map(c => (
                  <div key={c.tag} className="rounded-xl border border-amber-700/20 bg-[#100e0c] p-4">
                    <div className="jakarta mb-1.5 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-widest text-amber-400">
                      <span className="inline-block h-px w-4 bg-amber-400/60" />
                      {c.tag}
                    </div>
                    <p className="jakarta text-[0.78rem] font-light leading-5 text-stone-600">{c.body}</p>
                  </div>
                ))}
              </div>
            </aside>
 
            {/* ── FORM PANEL ── */}
            <div className="a3 space-y-4">
              <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
 
                {/* step header */}
                <div className="mb-7 flex flex-col gap-4 border-b border-amber-700/15 pb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="jakarta mb-2 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                      <span className="inline-block h-px w-4 bg-amber-400" />
                      Active section
                    </div>
                    <h2 className="fraunces flex items-center gap-2.5 text-2xl font-black text-amber-50">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-700/30 bg-amber-500/10 text-amber-400">
                        <Icon size={18} />
                      </span>
                      {cur.title}
                    </h2>
                    <p className="jakarta mt-1.5 text-sm font-light text-stone-500">{cur.description}</p>
                  </div>
                  <div className="jakarta rounded-xl border border-amber-700/20 bg-stone-900/50 px-4 py-2.5 text-sm font-medium text-amber-400/80">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
 
                {/* step content */}
                <div className="step-fade">{renderStepContent()}</div>
 
                {/* nav buttons */}
                <div className="mt-8 flex flex-col gap-3 border-t border-amber-700/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button onClick={handlePrev} disabled={currentStep === 0}
                    className="jakarta inline-flex items-center justify-center gap-2 rounded-xl border border-amber-700/25 bg-transparent px-6 py-2.5 text-sm font-medium text-amber-200 transition hover:border-amber-500/40 hover:bg-amber-500/[0.07] disabled:cursor-not-allowed disabled:opacity-30">
                    <ChevronLeft size={15} /> Previous
                  </button>
 
                  {currentStep === steps.length - 1 ? (
                    <button onClick={handleSubmit} disabled={loading}
                      className="jakarta group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-[#080706] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_10px_28px_rgba(245,158,11,0.28)] disabled:cursor-not-allowed disabled:opacity-50">
                      <Sparkles size={15} />
                      {loading ? "Generating..." : "Generate Resume"}
                      <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  ) : (
                    <button onClick={handleNext}
                      className="jakarta group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-[#080706] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_10px_28px_rgba(245,158,11,0.28)]">
                      Next <ChevronRight size={15} className="transition group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>
              </div>
 
              {/* ── GENERATED RESUME ── */}
              {generatedResumeUrl && (
                <div className="rounded-2xl border border-emerald-600/25 bg-[#100e0c] p-6 md:p-8">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="jakarta mb-2 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-emerald-400">
                        <span className="inline-block h-px w-4 bg-emerald-400" />
                        Generated output
                      </div>
                      <h2 className="fraunces flex items-center gap-2.5 text-2xl font-black text-amber-50">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-600/30 bg-emerald-600/10 text-emerald-400">
                          <FileText size={18} />
                        </span>
                        Your Resume
                      </h2>
                    </div>
                    <button onClick={handleDownload}
                      className="jakarta group inline-flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-600/10 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-600/20">
                      <FileText size={15} />
                      Download PDF
                      <ArrowUpRight size={13} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-amber-700/20">
                    <iframe src={generatedResumeUrl} className="h-96 w-full bg-white" title="Generated Resume" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
/* ─── MINI COMPONENTS ─────────────────────────────────────────────────────── */
const Label = ({ children, icon }) => (
  <label className="jakarta flex items-center gap-1.5 text-sm font-medium text-stone-400">
    {icon && <span className="text-amber-400/70">{icon}</span>}
    {children}
  </label>
);
 
const AddBtn = ({ onClick, children }) => (
  <button type="button" onClick={onClick}
    className="jakarta inline-flex items-center gap-1.5 rounded-xl border border-amber-700/30 bg-amber-500/[0.07] px-3.5 py-2 text-[0.78rem] font-semibold text-amber-400 transition hover:bg-amber-500/[0.14]">
    {children}
  </button>
);
 
const DelBtn = ({ onClick, label }) => (
  <button type="button" onClick={onClick}
    className={`jakarta inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3 py-2 text-[0.78rem] font-medium text-red-400 transition hover:bg-red-500/10 ${label ? "px-4" : "p-2.5"}`}>
    <Trash2 size={14} />
    {label}
  </button>
);