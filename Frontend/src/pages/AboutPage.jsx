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
      {/* font + animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        .fraunces { font-family: 'Fraunces', serif; }
        .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:none; }
        }

        .anim { animation: fadeUp .6s ease both; }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 py-12 space-y-10">

        {/* HERO */}
        <section className="anim rounded-3xl border border-amber-700/20 bg-[#100e0c] p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
          <p className="jakarta text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
            About HireStack
          </p>

          <h1 className="fraunces mt-4 text-4xl md:text-6xl font-black leading-tight text-amber-50">
            One platform to
            <br />
            <em className="italic font-light text-amber-400">prepare, practice, and perform.</em>
          </h1>

          <p className="jakarta mt-6 max-w-3xl text-sm md:text-base leading-7 text-stone-400">
            HireStack brings together the most important steps of job preparation into a single,
            focused experience — helping candidates move from uncertainty to confidence with less friction.
          </p>
        </section>

        {/* FEATURES / BENTO */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="anim rounded-2xl border border-amber-700/20 bg-[#0f0d0c] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-700/30 bg-amber-500/10 text-amber-400">
                  <Icon size={18} />
                </div>

                <h2 className="fraunces text-lg font-semibold text-amber-50">
                  {pillar.title}
                </h2>

                <p className="jakarta mt-2 text-sm leading-6 text-stone-400">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* INFO SECTIONS */}
        <section className="grid gap-6 lg:grid-cols-2">

          {/* WHY */}
          <div className="anim rounded-3xl border border-amber-700/20 bg-[#100e0c] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <p className="jakarta text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              Why this platform exists
            </p>

            <h2 className="fraunces mt-3 text-2xl font-bold text-amber-50">
              Fixing fragmented preparation
            </h2>

            <p className="jakarta mt-4 text-sm leading-7 text-stone-400">
              Candidates often struggle because preparation is scattered across multiple tools.
              HireStack simplifies that journey by combining resume building, AI feedback,
              interview practice, and job discovery into one unified experience.
            </p>
          </div>

          {/* HOSTABLE */}
          <div className="anim rounded-3xl border border-amber-700/20 bg-[#100e0c] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            <p className="jakarta text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              Built for deployment
            </p>

            <h2 className="fraunces mt-3 text-2xl font-bold text-amber-50">
              Production-ready architecture
            </h2>

            <ul className="jakarta mt-4 space-y-3 text-sm text-stone-400">
              <li>• Public pages accessible before authentication</li>
              <li>• Protected dashboard routes for core features</li>
              <li>• Environment-based API configuration</li>
              <li>• Backend-ready origin & cookie handling</li>
            </ul>
          </div>
        </section>

      </div>
    </MarketingLayout>
  );
}