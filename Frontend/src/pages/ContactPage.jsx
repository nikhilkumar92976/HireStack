import { useState } from "react";
import {
  Mail, MapPin, Twitter, Github, Linkedin,
  ArrowUpRight, Send, MessageSquare, Phone,
  CheckCircle2, AlertCircle,
} from "lucide-react";
 
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
  @keyframes spin-slow {
    to { transform: rotate(360deg); }
  }
  @keyframes pulseRing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.15); }
    50%       { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
  }
  @keyframes successPop {
    0%   { opacity:0; transform: scale(.85) translateY(8px); }
    70%  { transform: scale(1.03) translateY(-2px); }
    100% { opacity:1; transform: scale(1) translateY(0); }
  }
 
  .fraunces { font-family: 'Fraunces', serif; }
  .jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }
 
  .c-a1 { animation: fadeUp .55s .04s ease both; }
  .c-a2 { animation: fadeUp .55s .13s ease both; }
  .c-a3 { animation: fadeUp .55s .22s ease both; }
  .c-a4 { animation: fadeUp .55s .31s ease both; }
 
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #080706; }
  ::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.3); border-radius: 10px; }
 
  .pulse-icon { animation: pulseRing 2.8s ease-in-out infinite; }
 
  /* ── field ── */
  .c-field {
    width: 100%;
    background: #0d0b09;
    border: 1px solid rgba(180,83,9,0.25);
    border-radius: 13px;
    padding: 11px 16px;
    font-size: 0.875rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 300;
    color: #fef3c7;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .c-field::placeholder { color: #44403c; }
  .c-field:focus {
    border-color: rgba(245,158,11,0.5);
    box-shadow: 0 0 0 3px rgba(245,158,11,0.07);
  }
  .c-field-error {
    border-color: rgba(239,68,68,0.5) !important;
  }
  .c-field-error:focus {
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08) !important;
  }
 
  /* ── submit glow ── */
  .submit-glow:hover:not(:disabled) {
    box-shadow: 0 10px 28px rgba(245,158,11,0.28);
    transform: translateY(-1px);
  }
  .submit-glow:active:not(:disabled) { transform: scale(0.98); }
 
  /* ── social link hover ── */
  .social-link {
    transition: border-color .2s, background .2s, transform .2s;
  }
  .social-link:hover {
    border-color: rgba(245,158,11,0.45);
    background: rgba(245,158,11,0.06);
    transform: translateY(-2px);
  }
 
  /* ── info card hover ── */
  .info-card {
    transition: border-color .2s, background .2s, transform .2s;
  }
  .info-card:hover {
    border-color: rgba(245,158,11,0.35);
    background: rgba(245,158,11,0.04);
    transform: translateY(-2px);
  }
 
  /* ── success pop ── */
  .success-pop { animation: successPop .45s cubic-bezier(.34,1.56,.64,1) both; }
`;
 
/* ─── FIELD LABEL ───────────────────────────────────────────────────────── */
const Label = ({ children, icon: Icon, optional }) => (
  <label className="jakarta mb-2 flex items-center gap-2 text-sm font-medium text-stone-400">
    {Icon && <Icon size={13} className="text-amber-500/70" />}
    {children}
    {optional && (
      <span className="ml-1 rounded-full border border-amber-700/25 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-widest text-stone-700">
        optional
      </span>
    )}
  </label>
);
 
/* ─── FIELD ERROR ───────────────────────────────────────────────────────── */
const FieldError = ({ msg }) =>
  msg ? (
    <p className="jakarta mt-1.5 flex items-center gap-1 text-xs text-red-400">
      <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
      {msg}
    </p>
  ) : null;
 
/* ─── CONTACT INFO CARD ─────────────────────────────────────────────────── */
const InfoCard = ({ icon: Icon, label, value, href, color = "text-amber-400", border = "border-amber-700/30", bg = "bg-amber-500/[0.08]" }) => (
  <a
    href={href || "#"}
    target={href ? "_blank" : undefined}
    rel="noreferrer"
    className="info-card flex items-center gap-4 rounded-xl border border-amber-700/15 bg-stone-900/40 p-4"
  >
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${border} ${bg} ${color}`}>
      <Icon size={17} />
    </div>
    <div className="min-w-0">
      <p className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-stone-600">{label}</p>
      <p className="jakarta mt-0.5 truncate text-sm font-medium text-stone-300">{value}</p>
    </div>
    {href && <ArrowUpRight size={14} className="ml-auto shrink-0 text-stone-700" />}
  </a>
);
 
/* ─── SOCIAL BUTTON ─────────────────────────────────────────────────────── */
const SocialBtn = ({ icon: Icon, label, href, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`social-link flex items-center gap-3 rounded-xl border border-amber-700/15 bg-stone-900/40 px-4 py-3`}
  >
    <Icon size={16} className={color} />
    <span className="jakarta text-sm font-medium text-stone-400">{label}</span>
    <ArrowUpRight size={13} className="ml-auto text-stone-700" />
  </a>
);
 
/* ─── SUCCESS BANNER ────────────────────────────────────────────────────── */
const SuccessBanner = ({ onReset }) => (
  <div className="success-pop flex flex-col items-center justify-center py-14 text-center">
    <div className="pulse-icon mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-700/40 bg-emerald-950/40 text-emerald-400">
      <CheckCircle2 size={30} />
    </div>
    <div className="jakarta mb-1 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-widest text-emerald-400">
      <span className="inline-block h-px w-4 bg-emerald-400" />
      Message sent
    </div>
    <h3 className="fraunces mt-1 text-2xl font-black tracking-tight text-amber-50">
      Thanks for reaching <em className="font-light italic text-amber-400">out!</em>
    </h3>
    <p className="jakarta mt-2 max-w-xs text-sm font-light text-stone-500">
      Your message has been received. We'll get back to you within 24 hours.
    </p>
    <button
      onClick={onReset}
      className="jakarta mt-7 rounded-xl border border-amber-700/25 px-5 py-2.5 text-sm font-medium text-amber-300 transition hover:border-amber-500/50 hover:bg-amber-500/[0.07]"
    >
      Send another message
    </button>
  </div>
);
 
/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
 
  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Your name is required";
    if (!form.email.trim())   e.email   = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email   = "Enter a valid email address";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    return e;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // ── replace with your actual submission logic ──
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  };
 
  const handleReset = () => {
    setSent(false);
    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  };
 
  return (
    <>
      <style>{globalCss}</style>
 
      <div className="relative min-h-screen overflow-hidden bg-[#080706] text-amber-50">
 
        {/* ── blobs ─────────────────────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-700 opacity-[0.12] blur-[100px]"
            style={{ animation: "drift 22s linear infinite" }} />
          <div className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-900 opacity-[0.12] blur-[90px]"
            style={{ animation: "drift 28s linear infinite reverse" }} />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800 opacity-[0.05] blur-[120px]"
            style={{ animation: "drift 35s linear infinite" }} />
        </div>
 
        <div className="relative z-10 mx-auto max-w-6xl space-y-5 px-4 py-6 md:px-6">
 
          {/* ── PAGE HEADER ─────────────────────────────────────────── */}
          <header className="c-a1 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="jakarta mb-2 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
                  <span className="inline-block h-px w-5 bg-amber-400" />
                  Get in touch
                </div>
                <h1 className="fraunces text-4xl font-black tracking-tight text-amber-50 md:text-5xl">
                  Let's <em className="font-light italic text-amber-400">talk.</em>
                </h1>
                <p className="jakarta mt-2 max-w-lg text-sm font-light leading-6 text-stone-500">
                  Have a question, collaboration idea, or just want to say hello?
                  Fill out the form or reach out directly — we respond within 24 hours.
                </p>
              </div>
 
              {/* response time badge */}
              <div className="flex shrink-0 items-center gap-3 rounded-xl border border-amber-700/20 bg-stone-900/40 px-5 py-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <div>
                  <p className="jakarta text-[0.6rem] font-semibold uppercase tracking-widest text-stone-600">Avg. response</p>
                  <p className="fraunces text-sm font-bold text-emerald-400">Under 24 hrs</p>
                </div>
              </div>
            </div>
          </header>
 
          {/* ── MAIN GRID ───────────────────────────────────────────── */}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_320px]">
 
            {/* ── FORM CARD ─────────────────────────────────────────── */}
            <div className="c-a2 overflow-hidden rounded-2xl border border-amber-700/20 bg-[#100e0c]">
 
              {/* form header strip */}
              <div className="flex items-center gap-3 border-b border-amber-700/15 bg-gradient-to-r from-[#100e0c] via-[#12100d] to-amber-950/20 px-6 py-5">
                <div className="pulse-icon flex h-10 w-10 items-center justify-center rounded-xl border border-amber-700/30 bg-amber-500/[0.09] text-amber-400">
                  <MessageSquare size={17} />
                </div>
                <div>
                  <div className="jakarta text-[0.62rem] font-semibold uppercase tracking-widest text-amber-400/70">
                    Direct message
                  </div>
                  <h2 className="fraunces text-lg font-black text-amber-50">Send a message</h2>
                </div>
              </div>
 
              {/* form body */}
              <div className="p-6 md:p-8">
                {sent ? (
                  <SuccessBanner onReset={handleReset} />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
 
                    {/* name + email */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <Label icon={null}>Full Name *</Label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Alex Johnson"
                          className={`c-field ${errors.name ? "c-field-error" : ""}`}
                        />
                        <FieldError msg={errors.name} />
                      </div>
                      <div>
                        <Label icon={Mail}>Email Address *</Label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="alex@example.com"
                          className={`c-field ${errors.email ? "c-field-error" : ""}`}
                        />
                        <FieldError msg={errors.email} />
                      </div>
                    </div>
 
                    {/* subject */}
                    <div>
                      <Label optional>Subject</Label>
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="e.g., Collaboration inquiry, Bug report…"
                        className="c-field"
                      />
                    </div>
 
                    {/* message */}
                    <div>
                      <Label icon={MessageSquare}>Message *</Label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us what's on your mind…"
                        rows={6}
                        className={`c-field resize-none ${errors.message ? "c-field-error" : ""}`}
                      />
                      <div className="mt-1 flex items-center justify-between">
                        <FieldError msg={errors.message} />
                        <p className="jakarta ml-auto text-[0.65rem] font-medium text-stone-700">
                          {form.message.length} chars
                        </p>
                      </div>
                    </div>
 
                    {/* submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`submit-glow jakarta inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200
                        ${loading
                          ? "cursor-not-allowed bg-stone-800 text-stone-600"
                          : "bg-amber-500 text-[#080706] hover:bg-amber-400"
                        }`}
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-stone-600 border-t-stone-400"
                            style={{ animation: "spin-slow 0.9s linear infinite" }} />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={14} className="transition group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
 
                  </form>
                )}
              </div>
            </div>
 
            {/* ── RIGHT SIDEBAR ────────────────────────────────────── */}
            <aside className="c-a3 space-y-4">
 
              {/* contact info */}
              <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
                <div className="jakarta mb-1 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-widest text-amber-400">
                  <span className="inline-block h-px w-4 bg-amber-400" />
                  Contact info
                </div>
                <h3 className="fraunces mb-4 text-lg font-black text-amber-50">
                  Reach us <em className="font-light italic text-amber-400">directly.</em>
                </h3>
 
                <div className="space-y-3">
                  <InfoCard
                    icon={Mail}
                    label="Email"
                    value="hello@hirestack.dev"
                    href="mailto:hello@hirestack.dev"
                    color="text-amber-400"
                    border="border-amber-700/30"
                    bg="bg-amber-500/[0.08]"
                  />
                  <InfoCard
                    icon={Phone}
                    label="Phone"
                    value="+1 (555) 000-0000"
                    href="tel:+15550000000"
                    color="text-sky-400"
                    border="border-sky-700/30"
                    bg="bg-sky-500/[0.08]"
                  />
                  <InfoCard
                    icon={MapPin}
                    label="Location"
                    value="San Francisco, CA"
                    color="text-emerald-400"
                    border="border-emerald-700/30"
                    bg="bg-emerald-500/[0.08]"
                  />
                </div>
              </div>
 
              {/* socials */}
              <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
                <div className="jakarta mb-1 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-widest text-amber-400">
                  <span className="inline-block h-px w-4 bg-amber-400" />
                  Socials
                </div>
                <h3 className="fraunces mb-4 text-lg font-black text-amber-50">
                  Find us <em className="font-light italic text-amber-400">online.</em>
                </h3>
 
                <div className="space-y-2.5">
                  <SocialBtn icon={Github}   label="GitHub"   href="https://github.com"   color="text-stone-300" />
                  <SocialBtn icon={Twitter}  label="Twitter"  href="https://twitter.com"  color="text-sky-400"   />
                  <SocialBtn icon={Linkedin} label="LinkedIn" href="https://linkedin.com" color="text-blue-400"  />
                </div>
              </div>
 
              {/* availability notice */}
              <div className="rounded-2xl border border-amber-700/20 bg-[#100e0c] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-400/70" />
                  <span className="jakarta text-[0.65rem] font-semibold uppercase tracking-widest text-amber-400/70">
                    Availability
                  </span>
                </div>
                <p className="jakarta text-sm font-light leading-6 text-stone-500">
                  We're currently open to{" "}
                  <span className="font-medium text-amber-300">freelance projects</span>,{" "}
                  <span className="font-medium text-amber-300">collaborations</span>, and{" "}
                  <span className="font-medium text-amber-300">consulting enquiries</span>.
                  Feel free to reach out anytime.
                </p>
              </div>
 
            </aside>
          </div>
 
          {/* ── BOTTOM FAQ STRIP ─────────────────────────────────────── */}
          <section className="c-a4 rounded-2xl border border-amber-700/20 bg-[#100e0c] p-6 md:p-8">
            <div className="jakarta mb-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-widest text-amber-400">
              <span className="inline-block h-px w-5 bg-amber-400" />
              Quick answers
            </div>
            <h2 className="fraunces mb-6 text-2xl font-black tracking-tight text-amber-50">
              Common <em className="font-light italic text-amber-400">questions.</em>
            </h2>
 
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  q: "How quickly will you respond?",
                  a: "We aim to reply to all messages within 24 hours on business days.",
                  color: "text-amber-400", dot: "bg-amber-400",
                },
                {
                  q: "Do you take on freelance work?",
                  a: "Yes — we're open to freelance, contract, and consulting engagements.",
                  color: "text-sky-400", dot: "bg-sky-400",
                },
                {
                  q: "Can I report a bug or feature request?",
                  a: "Absolutely. Use the form above or open an issue on our GitHub repository.",
                  color: "text-emerald-400", dot: "bg-emerald-400",
                },
              ].map(({ q, a, color, dot }) => (
                <div key={q} className="rounded-xl border border-amber-700/15 bg-stone-900/40 p-5 transition hover:border-amber-700/30 hover:bg-stone-900/60">
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
                    <span className="jakarta text-[0.6rem] font-semibold uppercase tracking-widest text-stone-600">
                      FAQ
                    </span>
                  </div>
                  <h4 className={`fraunces text-base font-bold ${color}`}>{q}</h4>
                  <p className="jakarta mt-2 text-sm font-light leading-5 text-stone-600">{a}</p>
                </div>
              ))}
            </div>
          </section>
 
        </div>
      </div>
    </>
  );
}