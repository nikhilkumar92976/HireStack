import { ArrowRight, Brain, BriefcaseBusiness, FileSearch, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import MarketingLayout from "../components/MarketingLayout";

const features = [
  {
    title: "AI Resume Builder",
    description: "Generate clean ATS-friendly resumes for your target role with a guided flow.",
    icon: FileText,
  },
  {
    title: "Resume Checker",
    description: "Upload your resume and get structured AI feedback, scoring, and improvement hints.",
    icon: FileSearch,
  },
  {
    title: "Mock Interview",
    description: "Practice interview questions with voice support, timed answers, and feedback summaries.",
    icon: Brain,
  },
  {
    title: "Job Discovery",
    description: "Browse focused job cards with paginated results and cached page loading.",
    icon: BriefcaseBusiness,
  },
];

const workflow = [
  "Create or refine your resume for the role you want.",
  "Check your resume against job goals and identify weak points.",
  "Practice a realistic AI mock interview using the same workspace.",
  "Move into job search with a cleaner and better-prepared profile.",
];

const hostabilityCards = [
  "Public landing pages for visitors before login.",
  "Protected dashboard routing for actual app features.",
  "Environment-based API configuration for deployment.",
  "Hosting-friendly auth flow with stronger backend origin handling.",
];

export default function LandingPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              <Sparkles size={16} />
              One platform for complete interview preparation
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              HireStack explains, prepares, and powers your full job-ready workflow.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
              This platform helps candidates understand what to improve, build stronger resumes,
              practice interviews with AI, and move into job search from one clean dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/singup" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
                Create account
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
                Login
              </Link>
              <Link to="/dashboard" className="rounded-2xl border border-gray-200 bg-[#f5f5f3] px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                View dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <InfoCard label="AI tools" value="4" description="Resume builder, checker, mock interview, and job search." />
            <InfoCard label="User journey" value="End-to-end" description="From resume creation to interview practice in one product." />
            <InfoCard label="Deployment ready" value="Hostable" description="Public pages, protected routes, and env-based API configuration." />
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-blue-600">What the website does</p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900 md:text-4xl">Everything is designed around candidate preparation.</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600 md:text-base">
              Instead of jumping between separate tools, HireStack keeps your resume work,
              interview practice, and job search flow connected. That makes the experience easier
              for users and much clearer for a public-facing hosted product.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-3xl border border-gray-200 bg-[#f5f5f3] p-5">
                  <div className="inline-flex rounded-2xl bg-white p-3 text-blue-600 shadow-sm">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-medium text-blue-600">How users move through HireStack</p>
            <div className="mt-6 space-y-4">
              {workflow.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-gray-100 bg-[#f5f5f3] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              <ShieldCheck size={16} />
              Hostability upgrade
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900 md:text-3xl">The app is now structured for public access first.</h2>
            <div className="mt-6 grid gap-4">
              {hostabilityCards.map((item) => (
                <div key={item} className="rounded-2xl border border-gray-100 bg-[#f5f5f3] px-4 py-4 text-sm text-gray-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}

const InfoCard = ({ label, value, description }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-blue-600">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
    <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
  </div>
);