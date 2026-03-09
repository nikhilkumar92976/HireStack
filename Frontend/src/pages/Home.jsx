import React from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
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

const Home = () => {
  const { handleLogout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f5f5f3] text-gray-900">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 px-6 py-6">

        <h1 className="text-xl font-semibold tracking-tight mb-8">
          HireStack
        </h1>

        <nav className="space-y-2 text-sm">

          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarItem icon={<FileSearch size={18} />} label="Resume Checker" />
          <SidebarItem icon={<Brain size={18} />} label="Interview Prep" />
          <SidebarItem icon={<ClipboardList size={18} />} label="Preparation Sheets" />
          <SidebarItem icon={<Sparkles size={18} />} label="AI Tools" />
          <SidebarItem icon={<FileText size={18} />} label="Resume Builder" />

        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-auto text-sm text-red-500 hover:text-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>

      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1">

        {/* Top Header */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">

          <div className="relative w-64 hidden md:block">
            <Search
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              placeholder="Search topics..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
          </div>

        </header>

        {/* Content */}
        <main className="p-6 space-y-10">

          {/* Welcome */}
          <div>
            <h2 className="text-2xl font-semibold">Your Learning Hub</h2>
            <p className="text-gray-500 text-sm">
              Everything you need to prepare for tech interviews.
            </p>
          </div>

          {/* Learning Sections */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            <Card
              title="DSA Sheet"
              desc="Practice structured coding questions like LeetCode sheets."
            />

            <Card
              title="Aptitude"
              desc="Prepare for quantitative & logical reasoning."
            />

            <Card
              title="Frontend Interview"
              desc="HTML, CSS, React interview questions."
            />

            <Card
              title="Backend Preparation"
              desc="Node.js, APIs, authentication, databases."
            />

            <Card
              title="System Design"
              desc="Learn scalable architecture concepts."
            />

            <Card
              title="Company Questions"
              desc="Frequently asked interview problems."
            />

          </div>

          {/* AI Tools */}
          <div>

            <h3 className="text-xl font-semibold mb-5">
              AI Tools
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

              <Card
                title="Resume Score Checker"
                desc="Analyze your resume with AI feedback."
              />

              <Card
                title="AI Mock Interview"
                desc="Practice real interview questions."
              />

              <Card
                title="Custom Resume Generator"
                desc="Create ATS-friendly resumes instantly."
              />

            </div>

          </div>

        </main>

      </div>
    </div>
  );
};

export default Home;

/* Sidebar Item */
const SidebarItem = ({ icon, label }) => (
  <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition">
    {icon}
    {label}
  </button>
);

/* Card */
const Card = ({ title, desc }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer">
    <h4 className="font-semibold mb-1">{title}</h4>
    <p className="text-sm text-gray-500">{desc}</p>
  </div>
);