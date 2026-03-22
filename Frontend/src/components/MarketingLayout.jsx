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
    <div className="min-h-screen bg-[#f5f5f3] text-gray-900">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-[#f5f5f3]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link to="/" className="inline-flex items-center gap-3 text-gray-900">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Sparkles size={18} />
            </span>
            <span>
              <span className="block text-sm font-medium text-blue-600">AI career prep</span>
              <span className="text-xl font-semibold tracking-tight">HireStack</span>
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
                    active ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
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
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white"
            >
              Login
            </Link>
            <Link
              to="/singup"
              className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
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
                  active ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link to="/dashboard" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap">
            Dashboard
          </Link>
          <Link to="/login" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 whitespace-nowrap">
            Login
          </Link>
          <Link to="/singup" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white whitespace-nowrap">
            Signup
          </Link>
        </div>
      </header>

      <main className="px-4 py-8 md:px-8">{children}</main>

      <footer className="border-t border-gray-200 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p>HireStack helps candidates build resumes, improve them with AI, practice interviews, and discover jobs.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="transition hover:text-gray-900">About</Link>
            <Link to="/contact" className="transition hover:text-gray-900">Contact</Link>
            <Link to="/login" className="transition hover:text-gray-900">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}