import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SkeletonLoader from '../../../components/SkeletonLoader';
import { toast } from "react-toastify";
import { ArrowUpRight, Eye, EyeOff, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
 
const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const navigate = useNavigate();
  const { loading, handleSingup } = useAuth();
  const [error, setError] = useState(null);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await handleSingup({ username, email, password });
      toast.success("Account created successfully!");
      if (res && res.user) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Signup failed. Try again.';
      toast.error(err.message);
      setError(errorMessage);
    }
  };
 
  if (loading) {
    return (
      <main className="max-w-4xl mx-auto">
        <SkeletonLoader />
      </main>
    );
  }
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes drift {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(40px,-30px) scale(1.06); }
          66%  { transform: translate(-25px,40px) scale(.96); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
        .anim-1 { animation: fadeUp .6s .05s ease both; }
        .anim-2 { animation: fadeUp .6s .15s ease both; }
        .fraunces { font-family: 'Fraunces', serif; }
        .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>
 
      <div className="relative min-h-screen w-full overflow-hidden bg-[#080706]">
 
        {/* ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-amber-700 opacity-[0.15] blur-[90px]"
            style={{ animation: 'drift 22s linear infinite' }} />
          <div className="absolute -right-24 bottom-10 h-[360px] w-[360px] rounded-full bg-amber-900 opacity-[0.15] blur-[90px]"
            style={{ animation: 'drift 28s linear infinite reverse' }} />
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600 opacity-[0.07] blur-[80px]"
            style={{ animation: 'drift 18s linear infinite' }} />
        </div>
 
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[1fr_420px]">
 
            {/* ── LEFT — brand panel ── */}
            <div className="anim-1 flex flex-col justify-between rounded-2xl border border-amber-700/20 bg-[#100e0c] p-8 md:p-10">
              <div>
                {/* logo */}
                <div className="fraunces mb-10 text-xl font-bold tracking-tight text-amber-50">
                  Hire<em className="italic text-amber-400">Stack</em>
                </div>
 
                {/* eyebrow */}
                <div className="jakarta mb-5 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-widest text-amber-400">
                  <span className="inline-block h-px w-6 bg-amber-400" />
                  Create your account
                </div>
 
                <h1 className="fraunces text-4xl font-black leading-[1.05] tracking-tight text-amber-50 md:text-5xl">
                  Start your<br />
                  journey to<br />
                  <em className="font-light italic text-amber-400">getting hired.</em>
                </h1>
 
                <p className="jakarta mt-5 max-w-sm text-sm font-light leading-7 text-stone-500">
                  After signup you move straight into the protected dashboard
                  for resume building, analysis, mock interviews, and job search.
                </p>
              </div>
 
              {/* what you unlock */}
              <div className="mt-10">
                <p className="jakarta mb-4 text-[0.68rem] font-semibold uppercase tracking-widest text-stone-600">
                  What you unlock
                </p>
                <div className="space-y-3">
                  {[
                    "AI-powered resume builder & ATS checker",
                    "Realistic mock interviews with feedback",
                    "Curated job discovery with smart filters",
                    "One unified dashboard for full prep flow",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-amber-400" />
                      <span className="jakarta text-sm font-light text-stone-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* stat strip */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-amber-700/15 pt-8">
                {[
                  { val: "Free", label: "To get started" },
                  { val: "4",    label: "AI tools included" },
                  { val: "12k+", label: "Users joined" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="fraunces text-2xl font-black text-amber-400">{s.val}</p>
                    <p className="jakarta mt-1 text-[0.65rem] font-semibold uppercase tracking-widest text-stone-600">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
 
            {/* ── RIGHT — form panel ── */}
            <div className="anim-2 flex flex-col justify-center rounded-2xl border border-amber-700/20 bg-[#100e0c] p-8 md:p-10">
 
              <div className="mb-7">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-500/[0.07] px-3 py-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  <span className="jakarta text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                    No credit card needed
                  </span>
                </div>
                <h2 className="fraunces text-3xl font-black tracking-tight text-amber-50">
                  Create your<br />
                  <em className="font-light italic text-amber-400">free account.</em>
                </h2>
                <p className="jakarta mt-2 text-sm font-light text-stone-500">
                  Join thousands already preparing smarter with HireStack.
                </p>
              </div>
 
              {/* error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">
                  <p className="jakarta text-xs font-semibold uppercase tracking-widest text-red-400">Error</p>
                  <p className="jakarta mt-1 text-sm text-red-300/80">{error}</p>
                </div>
              )}
 
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* username */}
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="jakarta w-full rounded-xl border border-amber-700/20 bg-stone-900/60 px-4 py-3.5 text-sm text-amber-50 placeholder-stone-600 outline-none transition-all duration-200 focus:border-amber-500/50 focus:bg-stone-900 focus:ring-1 focus:ring-amber-500/20"
                />
 
                {/* email */}
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="jakarta w-full rounded-xl border border-amber-700/20 bg-stone-900/60 px-4 py-3.5 text-sm text-amber-50 placeholder-stone-600 outline-none transition-all duration-200 focus:border-amber-500/50 focus:bg-stone-900 focus:ring-1 focus:ring-amber-500/20"
                />
 
                {/* password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="jakarta w-full rounded-xl border border-amber-700/20 bg-stone-900/60 px-4 py-3.5 pr-11 text-sm text-amber-50 placeholder-stone-600 outline-none transition-all duration-200 focus:border-amber-500/50 focus:bg-stone-900 focus:ring-1 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 transition hover:text-amber-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
 
                {/* submit */}
                <button
                  type="submit"
                  className="jakarta group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 text-sm font-semibold text-[#080706] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_12px_32px_rgba(245,158,11,0.3)]"
                >
                  <UserPlus size={15} />
                  Create account
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>
 
              {/* disclaimer */}
              <p className="jakarta mt-4 text-center text-[0.72rem] font-light leading-5 text-stone-600">
                By creating an account you get access to the full HireStack
                dashboard and all AI preparation tools.
              </p>
 
              {/* divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-amber-700/15" />
                <span className="jakarta text-xs font-medium text-stone-600">OR</span>
                <div className="h-px flex-1 bg-amber-700/15" />
              </div>
 
              {/* login link */}
              <p className="jakarta text-center text-sm font-light text-stone-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-amber-400 underline-offset-2 transition hover:text-amber-300 hover:underline"
                >
                  Log in instead
                </Link>
              </p>
            </div>
 
          </div>
        </div>
      </div>
    </>
  );
};
 
export default Signup;
 