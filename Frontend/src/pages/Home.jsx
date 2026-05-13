import { createElement } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Brain, FileText, Sparkles,
  ClipboardList, LogOut, Search, FileSearch,
  ArrowUpRight, ChevronRight,
} from "lucide-react";
import { ImFlattr } from "react-icons/im";

/* ─── DATA ─────────────────────────────────────────────────────────────── */
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard",          path: "/dashboard" },
  { icon: FileText,        label: "Resume Builder",     path: "/create-resume" },
  { icon: FileSearch,      label: "Resume Checker",     path: "/resume-checker" },
  { icon: Brain,           label: "Interview Prep",     path: "/interview" },
  { icon: ClipboardList,   label: "Job Search",         path: "/job" },
  { icon: ClipboardList,   label: "Preparation Sheets" },
  { icon: Sparkles,        label: "AI Bot",             path: "/chat" },
];
 
const learningSections = [
  { title: "DSA Sheet",          desc: "Practice structured coding questions like LeetCode sheets.",  color: "text-sky-400",    dot: "bg-sky-400" },
  { title: "Aptitude",           desc: "Prepare for quantitative & logical reasoning.",               color: "text-violet-400", dot: "bg-violet-400" },
  { title: "Frontend Interview", desc: "HTML, CSS, React interview questions.",                       color: "text-amber-400",  dot: "bg-amber-400" },
  { title: "Backend Prep",       desc: "Node.js, APIs, authentication, databases.",                   color: "text-emerald-400",dot: "bg-emerald-400" },
  { title: "System Design",      desc: "Learn scalable architecture concepts.",                       color: "text-rose-400",   dot: "bg-rose-400" },
  { title: "Company Questions",  desc: "Frequently asked interview problems.",                        color: "text-orange-400", dot: "bg-orange-400" },
];
 
const aiTools = [
  { title: "Resume Score Checker",    desc: "Analyze your resume with detailed AI feedback.",         path: "/resume-checker" },
  { title: "AI Mock Interview",       desc: "Practice real interview questions with live guidance.",  path: "/interview" },
  { title: "Custom Resume Generator", desc: "Create ATS-friendly resumes instantly.",                path: "/create-resume" },
];
 
/* ─── STYLES ────────────────────────────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
  @keyframes drift {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(35px,-25px) scale(1.05); }
    66%  { transform: translate(-20px,35px) scale(.97); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:none; }
  }
  .a1 { animation: fadeUp .55s .05s ease both; }
  .a2 { animation: fadeUp .55s .12s ease both; }
  .a3 { animation: fadeUp .55s .20s ease both; }
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
  /* custom scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080706; }
  ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.3); border-radius: 10px; }
`;
 
/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
const Home = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
 
  const handleNavigate = (path) => navigate(path);
  const handleLogoutAndExit = async () => { await handleLogout(); navigate("/"); };
 
  return (
    <>
      <style>{globalCss}</style>
 
      <div className="relative min-h-screen overflow-hidden bg-[#080706] text-amber-50">
 
        {/* blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-700 opacity-[0.12] blur-[100px]"
            style={{ animation: "drift 22s linear infinite" }} />
          <div className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-900 opacity-[0.12] blur-[90px]"
            style={{ animation: "drift 28s linear infinite reverse" }} />
        </div>
 
        <div className="relative z-10 mx-auto grid max-w-7xl gap-5 px-4 py-6 md:px-6 xl:grid-cols-[268px_minmax(0,1fr)]">
 
          {/* ══ SIDEBAR ══════════════════════════════════════════════════════ */}
          <aside className="a1 space-y-4 xl:sticky xl:top-6 xl:self-start">
 
            {/* brand + nav */}
            <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
              {/* logo */}
              <div className="fraunces mb-1 text-lg font-bold text-amber-50 flex items-center gap-0.5">
                <ImFlattr/>ire<em className="italic text-amber-400">Stack</em>
              </div>
              <p className="jakarta text-[0.72rem] font-light text-stone-600">
                Your complete interview prep workspace.
              </p>
 
              <div className="my-4 h-px bg-amber-700/15" />
 
              {/* eyebrow */}
              <p className="jakarta mb-2 px-1 text-[0.62rem] font-semibold uppercase tracking-widest text-stone-600">
                Navigation
              </p>
 
              <nav className="space-y-0.5">
                {sidebarItems.map((item) => (
                  <SidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    onClick={item.path ? () => handleNavigate(item.path) : undefined}
                  />
                ))}
              </nav>
 
              <div className="my-4 h-px bg-amber-700/15" />
 
              <button
                onClick={handleLogoutAndExit}
                className="jakarta flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
 
            {/* stat cards */}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
              <StatCard label="AI features"        value="3" desc="Interview, resume checker, and resume builder." />
              <StatCard label="Preparation tracks" value="6" desc="Structured topics for interview readiness." />
            </div>
          </aside>
 
          {/* ══ MAIN ═════════════════════════════════════════════════════════ */}
          <main className="a2 space-y-4">
 
            {/* header bar */}
            <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="jakarta mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                    <span className="inline-block h-px w-5 bg-amber-400" />
                    Dashboard
                  </div>
                  <h2 className="fraunces text-3xl font-black tracking-tight text-amber-50 md:text-4xl">
                    Your learning <em className="font-light italic text-amber-400">hub.</em>
                  </h2>
                  <p className="jakarta mt-1.5 max-w-xl text-sm font-light text-stone-500">
                    Resumes, mock interviews, and focused practice — all in one calm workspace.
                  </p>
                </div>
 
                {/* search */}
                <div className="relative w-full md:max-w-xs">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600" />
                  <input
                    placeholder="Search topics..."
                    className="jakarta w-full rounded-xl border border-amber-700/20 bg-stone-900/60 py-2.5 pl-9 pr-4 text-sm text-amber-50 placeholder-stone-600 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            </div>
 
            {/* hero action card + highlights */}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.85fr)]">
 
              {/* hero card */}
              <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-500/[0.07] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                  <Sparkles size={10} /> Start here
                </div>
                <h3 className="fraunces mt-3 text-2xl font-black tracking-tight text-amber-50 md:text-3xl">
                  Prepare like a real<br />
                  <em className="font-light italic text-amber-400">interview workflow.</em>
                </h3>
                <p className="jakarta mt-2 max-w-md text-sm font-light leading-6 text-stone-500">
                  Move from resume creation to analysis and into a live mock interview —
                  all inside the same focused workspace.
                </p>
 
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleNavigate("/interview")}
                    className="jakarta group inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-[#080706] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_10px_28px_rgba(245,158,11,0.28)]"
                  >
                    Open interview
                    <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                  <button
                    onClick={() => handleNavigate("/create-resume")}
                    className="jakarta inline-flex items-center gap-2 rounded-xl border border-amber-700/25 bg-transparent px-5 py-2.5 text-sm font-medium text-amber-200 transition hover:border-amber-500/50 hover:bg-amber-500/[0.07]"
                  >
                    Build resume
                  </button>
                  <button
                    onClick={() => handleNavigate("/resume-checker")}
                    className="jakarta inline-flex items-center gap-2 rounded-xl border border-amber-700/25 bg-transparent px-5 py-2.5 text-sm font-medium text-amber-200 transition hover:border-amber-500/50 hover:bg-amber-500/[0.07]"
                  >
                    Check resume
                  </button>
                </div>
              </div>
 
              {/* feature highlights */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <FeatureHighlight title="Interview-ready design"  desc="Large cards, clear focus states, and a calmer UI across every feature." />
                <FeatureHighlight title="Mobile friendly"         desc="Optimised spacing and stacked layouts for all screen sizes." />
              </div>
            </div>
 
            {/* learning sections */}
            <Section tag="Collection" title="Learning sections" subtitle="Structured preparation tracks to build interview readiness.">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {learningSections.map((item) => (
                  <LearningCard key={item.title} {...item} />
                ))}
              </div>
            </Section>
 
            {/* AI tools */}
            <Section tag="AI powered" title="AI tools" subtitle="The core tools you'll use most for resume and interview prep.">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {aiTools.map((tool) => (
                  <ToolCard key={tool.title} {...tool} onClick={() => handleNavigate(tool.path)} />
                ))}
              </div>
            </Section>
 
          </main>
        </div>
      </div>
    </>
  );
};
 
export default Home;
 
/* ─── SUB-COMPONENTS ─────────────────────────────────────────────────────── */
 
const SidebarItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`jakarta flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition
      ${onClick
        ? "cursor-pointer text-stone-400 hover:bg-amber-500/[0.07] hover:text-amber-300"
        : "cursor-default text-stone-600"
      }`}
  >
    {createElement(icon, { size: 16, className: onClick ? "text-amber-500/70" : "text-stone-700" })}
    {label}
  </button>
);
 
const StatCard = ({ label, value, desc }) => (
  <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
    <p className="jakarta text-[0.65rem] font-semibold uppercase tracking-widest text-amber-400/70">{label}</p>
    <p className="fraunces mt-2 text-3xl font-black text-amber-400">{value}</p>
    <p className="jakarta mt-1.5 text-[0.75rem] font-light leading-5 text-stone-600">{desc}</p>
  </div>
);
 
const Section = ({ tag, title, subtitle, children }) => (
  <section className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-7">
    <div className="mb-5">
      <div className="jakarta mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
        <span className="inline-block h-px w-5 bg-amber-400" />
        {tag}
      </div>
      <h3 className="fraunces text-2xl font-black tracking-tight text-amber-50">{title}</h3>
      <p className="jakarta mt-1 text-sm font-light text-stone-500">{subtitle}</p>
    </div>
    {children}
  </section>
);
 
const LearningCard = ({ title, desc, color, dot }) => (
  <div className="group rounded-xl border border-amber-700/15 bg-stone-900/40 p-5 transition hover:border-amber-700/35 hover:bg-stone-900/70 hover:-translate-y-0.5">
    <div className="mb-3 flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
      <span className="jakarta text-[0.65rem] font-semibold uppercase tracking-widest text-stone-600">
        HireStack module
      </span>
    </div>
    <h4 className={`fraunces text-lg font-bold ${color}`}>{title}</h4>
    <p className="jakarta mt-1.5 text-sm font-light leading-5 text-stone-500">{desc}</p>
    <p className="jakarta mt-4 text-[0.75rem] font-medium text-stone-600 transition group-hover:text-amber-400/70">
      Available soon →
    </p>
  </div>
);
 
const ToolCard = ({ title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer rounded-xl border border-amber-700/20 bg-stone-900/40 p-5 transition hover:border-amber-500/40 hover:bg-amber-500/[0.06] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
  >
    <div className="mb-3 flex items-center justify-between">
      <span className="jakarta text-[0.65rem] font-semibold uppercase tracking-widest text-amber-400/60">
        AI powered
      </span>
      <ChevronRight size={14} className="text-stone-700 transition group-hover:translate-x-0.5 group-hover:text-amber-400" />
    </div>
    <h4 className="fraunces text-lg font-bold text-amber-100">{title}</h4>
    <p className="jakarta mt-1.5 text-sm font-light leading-5 text-stone-500">{desc}</p>
    <p className="jakarta mt-4 text-[0.75rem] font-semibold text-amber-500 transition group-hover:text-amber-300">
      Open tool →
    </p>
  </div>
);
 
const FeatureHighlight = ({ title, desc }) => (
  <div className="rounded-xl border border-amber-700/20 bg-stone-900/40 p-5">
    <div className="jakarta mb-2 text-[0.65rem] font-semibold uppercase tracking-widest text-amber-400/70">
      Highlight
    </div>
    <h4 className="fraunces text-lg font-bold text-amber-100">{title}</h4>
    <p className="jakarta mt-1.5 text-sm font-light leading-5 text-stone-500">{desc}</p>
  </div>
);