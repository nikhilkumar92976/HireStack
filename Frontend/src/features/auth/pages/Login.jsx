import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SkeletonLoader from '../../../components/SkeletonLoader';
import { toast } from "react-toastify";
import { ArrowUpRight, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
 
const Login = () => {
  const [identifire, setIdentifire] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();
  const [error, setError] = useState(null);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await handleLogin({ identifire, password });
      toast.success("login successfully");
      if (result && result.user) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message);
      const errorMessage = err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.';
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
      {/* ── font import ── */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');`}</style>
 
      {/* ── page shell with dark bg ── */}
      <div className="relative min-h-screen w-full overflow-hidden bg-[#080706]">
 
        {/* ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-amber-700 opacity-[0.15] blur-[90px]"
            style={{ animation: 'drift 22s linear infinite' }} />
          <div className="absolute -right-24 bottom-10 h-[360px] w-[360px] rounded-full bg-amber-900 opacity-[0.15] blur-[90px]"
            style={{ animation: 'drift 28s linear infinite reverse' }} />
        </div>
 
        <style>{`
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
          .anim-3 { animation: fadeUp .6s .25s ease both; }
          .fraunces { font-family: 'Fraunces', serif; }
          .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
 
        {/* ── centered content ── */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[1fr_420px]">
 
            {/* ── LEFT — brand panel ── */}
            <div className="anim-1 flex flex-col justify-between rounded-2xl border border-amber-700/20 bg-[#100e0c] p-8 md:p-10">
 
              {/* logo */}
              <div>
                <div className="fraunces mb-10 text-xl font-bold tracking-tight text-amber-50">
                  Hire<em className="italic text-amber-400">Stack</em>
                </div>
 
                {/* eyebrow */}
                <div className="jakarta mb-5 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-widest text-amber-400">
                  <span className="inline-block h-px w-6 bg-amber-400" />
                  Welcome back
                </div>
 
                <h1 className="fraunces text-4xl font-black leading-[1.05] tracking-tight text-amber-50 md:text-5xl">
                  Sign in &amp; get<br />
                  back to your<br />
                  <em className="font-light italic text-amber-400">preparation.</em>
                </h1>
 
                <p className="jakarta mt-5 max-w-sm text-sm font-light leading-7 text-stone-500">
                  Access your resume tools, AI mock interview workspace,
                  and job discovery flow — all from one protected account.
                </p>
              </div>
 
              {/* feature pills */}
              <div className="mt-10 flex flex-wrap gap-2">
                {["AI Resume Builder", "Mock Interview", "Job Discovery", "Resume Checker"].map(tag => (
                  <span
                    key={tag}
                    className="jakarta rounded-full border border-amber-700/30 bg-amber-500/[0.07] px-3 py-1.5 text-[0.7rem] font-medium tracking-wide text-amber-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
 
              {/* stat strip */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-amber-700/15 pt-8">
                {[
                  { val: "4", label: "AI Tools" },
                  { val: "94%", label: "Confidence rate" },
                  { val: "12k+", label: "Candidates helped" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="fraunces text-2xl font-black text-amber-400">{s.val}</p>
                    <p className="jakarta mt-1 text-[0.65rem] font-semibold uppercase tracking-widest text-stone-600">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
 
            {/* ── RIGHT — form panel ── */}
            <div className="anim-2 flex flex-col justify-center rounded-2xl border border-amber-700/20 bg-[#100e0c] p-8 md:p-10">
 
              <div className="mb-8">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-500/[0.07] px-3 py-1.5">
                  <Sparkles size={11} className="text-amber-400" />
                  <span className="jakarta text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                    Secure login
                  </span>
                </div>
                <h2 className="fraunces text-3xl font-black tracking-tight text-amber-50">
                  Good to see<br />
                  you <em className="font-light italic text-amber-400">again.</em>
                </h2>
                <p className="jakarta mt-2 text-sm font-light text-stone-500">
                  Use your username or email to enter HireStack.
                </p>
              </div>
 
              {/* error */}
              {error && (
                <div className="anim-3 mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">
                  <p className="jakarta text-xs font-semibold uppercase tracking-widest text-red-400">Error</p>
                  <p className="jakarta mt-1 text-sm text-red-300/80">{error}</p>
                </div>
              )}
 
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* identifier */}
                <div className="group relative">
                  <input
                    type="text"
                    placeholder="Username or Email"
                    onChange={(e) => setIdentifire(e.target.value)}
                    className="jakarta w-full rounded-xl border border-amber-700/20 bg-stone-900/60 px-4 py-3.5 text-sm text-amber-50 placeholder-stone-600 outline-none transition-all duration-200 focus:border-amber-500/50 focus:bg-stone-900 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
 
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
                  <LogIn size={15} />
                  Log in
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>
 
              {/* divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-amber-700/15" />
                <span className="jakarta text-xs font-medium text-stone-600">OR</span>
                <div className="h-px flex-1 bg-amber-700/15" />
              </div>
 
              {/* sign up link */}
              <p className="jakarta text-center text-sm font-light text-stone-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/singup"
                  className="font-medium text-amber-400 underline-offset-2 transition hover:text-amber-300 hover:underline"
                >
                  Create one free
                </Link>
              </p>
            </div>
 
          </div>
        </div>
      </div>
    </>
  );
};
 
export default Login;