import { ArrowRight, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function MarketingLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#080706] text-amber-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090706]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link to="/" className="inline-flex items-center gap-3 text-amber-100">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-black shadow-lg shadow-amber-900/20">
              <Sparkles size={18} />
            </span>
            <span>
              <span className="block text-sm font-medium text-amber-300">AI career prep</span>
              <span className="text-xl font-semibold tracking-tight text-amber-50">HireStack</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition ${
                    active ? "text-amber-300" : "text-stone-300 hover:text-amber-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#12100f] px-4 py-2.5 text-sm font-medium text-amber-100 transition hover:border-amber-400/30 hover:bg-[#1b1611]"
            >
              Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="rounded-2xl px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:text-amber-50"
            >
              Login
            </Link>
            <Link
              to="/singup"
              className="rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-black transition hover:bg-amber-400"
            >
              Signup
            </Link>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 pb-4 md:hidden md:px-8">
          {navLinks.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  active ? "bg-amber-500 text-black" : "bg-[#12100f] text-stone-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link to="/dashboard" className="rounded-full bg-[#12100f] px-4 py-2 text-sm font-medium text-stone-300 whitespace-nowrap">
            Dashboard
          </Link>
          <Link to="/login" className="rounded-full bg-[#12100f] px-4 py-2 text-sm font-medium text-stone-300 whitespace-nowrap">
            Login
          </Link>
          <Link to="/singup" className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-black whitespace-nowrap">
            Signup
          </Link>
        </div>
      </header>

      <main className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      <footer className="border-t border-white/10 bg-[#090706]/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-stone-300 md:flex-row md:items-center md:justify-between md:px-8">
          <p>HireStack helps candidates build resumes, improve them with AI, practice interviews, and discover jobs.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="transition hover:text-amber-100">About</Link>
            <Link to="/contact" className="transition hover:text-amber-100">Contact</Link>
            <Link to="/login" className="transition hover:text-amber-100">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}