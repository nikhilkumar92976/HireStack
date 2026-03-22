import { Brain, BriefcaseBusiness, FileSearch, FileText } from "lucide-react";
import MarketingLayout from "../components/MarketingLayout";

const pillars = [
  {
    title: "Resume creation",
    description: "Users can create polished resumes in a guided flow instead of starting from a blank page.",
    icon: FileText,
  },
  {
    title: "Resume analysis",
    description: "The platform reviews resume quality and surfaces AI feedback tied to job goals.",
    icon: FileSearch,
  },
  {
    title: "Interview practice",
    description: "Candidates can rehearse with realistic AI mock interviews and review strengths or weaknesses.",
    icon: Brain,
  },
  {
    title: "Job exploration",
    description: "Users can continue into job search without leaving the platform ecosystem.",
    icon: BriefcaseBusiness,
  },
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
          <p className="text-sm font-medium text-blue-600">About HireStack</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">A focused platform built to help candidates become interview-ready.</h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-gray-600 md:text-lg">
            HireStack combines preparation tools that usually live in separate apps. The goal is simple:
            help users build stronger resumes, get smarter AI feedback, practice confidently, and move into
            opportunities with less friction.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{pillar.description}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-medium text-blue-600">Why this platform exists</p>
            <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
              Candidates often struggle because preparation is fragmented. One place handles resumes, another handles
              questions, and another handles job listings. HireStack reduces that fragmentation by keeping the most
              useful preparation steps together in a clear, mobile-friendly experience.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-medium text-blue-600">What makes it hostable</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
              <li>• Public-facing pages explain the product before authentication.</li>
              <li>• Protected routes keep core user tools behind login.</li>
              <li>• Frontend API URLs can now be controlled with environment variables.</li>
              <li>• Backend origin and cookie handling are prepared for deployment environments.</li>
            </ul>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}