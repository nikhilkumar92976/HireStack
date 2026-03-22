import { createElement } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  FileText,
  Sparkles,
  ClipboardList,
  LogOut,
  Search,
  FileSearch,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Resume Builder", path: "/create-resume" },
  { icon: FileSearch, label: "Resume Checker", path: "/resume-checker" },
  { icon: Brain, label: "Interview Prep", path: "/interview" },
  { icon: ClipboardList, label: "Job Search", path: "/job" },
  { icon: ClipboardList, label: "Preparation Sheets" },
  { icon: Sparkles, label: "AI Tools" },
];

const learningSections = [
  {
    title: "DSA Sheet",
    desc: "Practice structured coding questions like LeetCode sheets.",
    tone: "from-blue-50 to-cyan-50",
  },
  {
    title: "Aptitude",
    desc: "Prepare for quantitative & logical reasoning.",
    tone: "from-purple-50 to-fuchsia-50",
  },
  {
    title: "Frontend Interview",
    desc: "HTML, CSS, React interview questions.",
    tone: "from-amber-50 to-orange-50",
  },
  {
    title: "Backend Preparation",
    desc: "Node.js, APIs, authentication, databases.",
    tone: "from-emerald-50 to-teal-50",
  },
  {
    title: "System Design",
    desc: "Learn scalable architecture concepts.",
    tone: "from-slate-50 to-zinc-100",
  },
  {
    title: "Company Questions",
    desc: "Frequently asked interview problems.",
    tone: "from-rose-50 to-pink-50",
  },
];

const aiTools = [
  {
    title: "Resume Score Checker",
    desc: "Analyze your resume with AI feedback.",
    path: "/resume-checker",
  },
  {
    title: "AI Mock Interview",
    desc: "Practice real interview questions with live guidance.",
    path: "/interview",
  },
  {
    title: "Custom Resume Generator",
    desc: "Create ATS-friendly resumes instantly.",
    path: "/create-resume",
  },
];

const Home = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogoutAndExit = async () => {
    await handleLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3] px-4 py-6 text-gray-900 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-600">Workspace</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">HireStack</h1>
            <p className="mt-2 text-sm text-gray-500">
              A clean prep hub for resumes, interviews, and focused practice.
            </p>

            <nav className="mt-6 space-y-2 text-sm">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  onClick={item.path ? () => handleNavigate(item.path) : undefined}
                />
              ))}
            </nav>

            <button
              onClick={handleLogoutAndExit}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <StatCard label="AI features" value="3" description="Interview, resume checker, and resume builder." />
            <StatCard label="Preparation tracks" value="6" description="Structured topics for interview readiness." />
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Dashboard</p>
                <h2 className="mt-2 text-3xl font-semibold text-gray-900 md:text-4xl">
                  Your learning hub
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-gray-500 md:text-base">
                  Everything you need to prepare for interviews, improve your resume,
                  and practice with AI-powered workflows in one consistent space.
                </p>
              </div>

              <div className="relative w-full md:max-w-xs">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search topics..."
                  className="w-full rounded-2xl border border-gray-300 bg-[#fcfcfb] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-sm font-medium text-blue-600">Start here</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900 md:text-3xl">
                Prepare like a real interview workflow
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Move from resume creation to resume analysis and then into a live mock
                interview with the same calm, focused interface style.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <ActionButton onClick={() => handleNavigate("/interview")}>Open interview</ActionButton>
                <SecondaryActionButton onClick={() => handleNavigate("/create-resume")}>
                  Build resume
                </SecondaryActionButton>
                <SecondaryActionButton onClick={() => handleNavigate("/resume-checker")}>
                  Check resume
                </SecondaryActionButton>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <FeatureHighlight
                title="Interview-ready design"
                description="Large cards, clear focus states, and a calmer UI across every feature."
              />
              <FeatureHighlight
                title="Mobile friendly"
                description="Optimized spacing and stacked layouts for smaller screens."
              />
            </div>
          </div>

          <Section title="Learning sections" subtitle="Structured preparation tracks in the same refined visual style.">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {learningSections.map((item) => (
                <Card key={item.title} {...item} />
              ))}
            </div>
          </Section>

          <Section title="AI tools" subtitle="The core tools you’ll use most often for resume and interview prep.">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {aiTools.map((tool) => (
                <Card key={tool.title} {...tool} onClick={tool.path ? () => handleNavigate(tool.path) : undefined} />
              ))}
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
};

export default Home;

/* Sidebar Item */
const SidebarItem = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-gray-600 transition hover:bg-gray-50 hover:text-black"
  >
    {createElement(icon, { size: 18 })}
    {label}
  </button>
);

const StatCard = ({ label, value, description }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
  </div>
);

const Section = ({ title, subtitle, children }) => (
  <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
    <div className="mb-6">
      <p className="text-sm font-medium text-blue-600">Collection</p>
      <h3 className="mt-2 text-2xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    </div>
    {children}
  </section>
);

const Card = ({ title, desc, onClick, tone = "from-gray-50 to-gray-100" }) => (
  <div
    onClick={onClick}
    className={`group rounded-3xl border border-gray-200 bg-gradient-to-br ${tone} p-6 transition hover:-translate-y-0.5 hover:shadow-md ${
      onClick ? "cursor-pointer" : "cursor-default"
    }`}
  >
    <div className="rounded-2xl bg-white/70 px-3 py-1 text-xs font-medium text-gray-500 backdrop-blur">
      HireStack module
    </div>
    <h4 className="mt-4 text-lg font-semibold text-gray-900">{title}</h4>
    <p className="mt-2 text-sm leading-6 text-gray-600">{desc}</p>
    <p className="mt-5 text-sm font-medium text-gray-900">
      {onClick ? "Open tool →" : "Available soon"}
    </p>
  </div>
);

const ActionButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
  >
    {children}
  </button>
);

const SecondaryActionButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
  >
    {children}
  </button>
);

const FeatureHighlight = ({ title, description }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-blue-600">Highlight</p>
    <h4 className="mt-2 text-lg font-semibold text-gray-900">{title}</h4>
    <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
  </div>
);