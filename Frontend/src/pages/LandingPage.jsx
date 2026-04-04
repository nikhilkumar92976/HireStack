import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight, Brain, BriefcaseBusiness, FileSearch,
  FileText, ShieldCheck, Sparkles, CheckCircle2,
} from "lucide-react";
 
/* ─── GLOBAL STYLES ──────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
 
  :root {
    --bg:      #080706;
    --s1:      #100e0c;
    --border:  rgba(232,168,76,.12);
    --border2: rgba(232,168,76,.28);
    --gold:    #e8a84c;
    --gold2:   #f5ca7a;
    --cream:   #f0e6d3;
    --muted:   #7a6e62;
    --text:    #d4c8b8;
  }
 
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
 
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    min-height: 100vh;
  }
 
  /* grain */
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: .025;
  }
 
  /* blobs */
  .blob-wrap { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
  .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: .18; animation: drift linear infinite; }
  .blob-1 { width: 560px; height: 560px; background: #c47d1a; top: -160px; left: -120px; animation-duration: 22s; }
  .blob-2 { width: 400px; height: 400px; background: #8b4a12; bottom: 10%; right: -100px; animation-duration: 28s; animation-direction: reverse; }
  .blob-3 { width: 300px; height: 300px; background: #e8a84c; top: 50%; left: 40%; animation-duration: 18s; opacity: .08; }
  @keyframes drift {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(40px,-30px) scale(1.06); }
    66%  { transform: translate(-25px,40px) scale(.96); }
    100% { transform: translate(0,0) scale(1); }
  }
 
  /* layout */
  .wrap { position: relative; z-index: 1; max-width: 1160px; margin: 0 auto; padding: 0 28px 100px; }
 
  /* nav */
  .nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 20px; animation: up .6s ease both; }
  .logo { font-family: 'Fraunces', serif; font-size: 1.35rem; font-weight: 700; color: var(--cream); letter-spacing: -.02em; }
  .logo em { color: var(--gold); font-style: italic; }
  .nav-r { display: flex; align-items: center; gap: 10px; }
  .n-link { padding: 7px 18px; border-radius: 6px; font-size: .82rem; font-weight: 500; color: var(--muted); text-decoration: none; transition: color .2s; }
  .n-link:hover { color: var(--cream); }
  .n-cta {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 8px 20px; border-radius: 8px; background: var(--gold); color: #080706;
    font-size: .82rem; font-weight: 600; text-decoration: none; transition: all .22s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .n-cta:hover { background: var(--gold2); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(232,168,76,.3); }
 
  .rule { width: 100%; height: 1px; background: var(--border); margin: 0 0 56px; animation: up .5s .15s ease both; }
 
  /* hero */
  .hero { padding: 48px 0 64px; }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: .74rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 28px; animation: up .6s .1s ease both;
  }
  .hero-eyebrow span { display: inline-block; width: 28px; height: 1px; background: var(--gold); }
  .hero-h {
    font-family: 'Fraunces', serif;
    font-size: clamp(3rem, 6.5vw, 6rem);
    font-weight: 900; line-height: 1.02; letter-spacing: -.03em; color: var(--cream);
    animation: up .7s .2s ease both;
  }
  .hero-h i { font-style: italic; color: var(--gold); font-weight: 300; }
  .hero-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; margin-top: 36px; flex-wrap: wrap; }
  .hero-sub { max-width: 420px; font-size: 1rem; line-height: 1.75; color: var(--muted); font-weight: 300; animation: up .7s .3s ease both; }
  .hero-actions { display: flex; gap: 12px; align-items: center; animation: up .7s .4s ease both; flex-wrap: wrap; }
  .btn-gold {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 13px 26px; border-radius: 10px; background: var(--gold); color: #080706;
    font-size: .9rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
    text-decoration: none; transition: all .24s; border: none; cursor: pointer;
  }
  .btn-gold:hover { background: var(--gold2); transform: translateY(-2px); box-shadow: 0 14px 36px rgba(232,168,76,.35); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 26px; border-radius: 10px; border: 1px solid var(--border2);
    background: transparent; color: var(--cream); font-size: .9rem;
    font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none; transition: all .22s; cursor: pointer;
  }
  .btn-ghost:hover { background: rgba(232,168,76,.07); border-color: var(--gold); }
 
  /* bento */
  .bento { display: grid; gap: 16px; margin-top: 72px; }
  .bento-top { grid-template-columns: 1.55fr 1fr; }
  .bento-mid { grid-template-columns: repeat(4, 1fr); margin-top: 16px; }
  .bento-bot { grid-template-columns: 1fr 1.4fr; margin-top: 16px; }
  @media (max-width: 900px) { .bento-mid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 640px) { .bento-top, .bento-mid, .bento-bot { grid-template-columns: 1fr; } }
 
  .card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px; position: relative; overflow: hidden;
    transition: border-color .3s, transform .3s, box-shadow .3s;
  }
  .card::after {
    content: ''; position: absolute; inset: 0; border-radius: 20px;
    background: linear-gradient(135deg, rgba(232,168,76,.05) 0%, transparent 60%);
    opacity: 0; transition: opacity .3s;
  }
  .card:hover { border-color: var(--border2); transform: translateY(-3px); box-shadow: 0 20px 50px rgba(0,0,0,.5); }
  .card:hover::after { opacity: 1; }
 
  .ctag { display: inline-block; font-size: .68rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; opacity: .8; }
  .card-h { font-family: 'Fraunces', serif; font-weight: 700; letter-spacing: -.02em; color: var(--cream); line-height: 1.15; }
  .xl { font-size: clamp(1.6rem, 2.5vw, 2.2rem); }
  .lg { font-size: 1.3rem; }
  .md { font-size: 1.05rem; }
  .card-p { font-size: .84rem; line-height: 1.7; color: var(--muted); margin-top: 10px; font-weight: 300; }
  .card-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(232,168,76,.1); border: 1px solid var(--border2);
    color: var(--gold); margin-bottom: 18px;
    transition: background .25s, transform .25s;
  }
  .card:hover .card-icon { background: rgba(232,168,76,.18); transform: rotate(-6deg) scale(1.05); }
 
  .card-hero-main { padding: 44px 40px; }
  .card-hero-main .card-h { font-size: clamp(1.8rem, 2.8vw, 2.6rem); margin-bottom: 14px; }
  .card-hero-main .card-p { font-size: .9rem; max-width: 380px; }
 
  .tag-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 24px; }
  .tag { padding: 5px 13px; border-radius: 100px; border: 1px solid var(--border2); background: rgba(232,168,76,.06); font-size: .73rem; font-weight: 500; color: var(--gold); letter-spacing: .04em; }
 
  .stat-num { font-family: 'Fraunces', serif; font-size: 3.4rem; font-weight: 900; color: var(--gold); line-height: 1; letter-spacing: -.04em; }
  .stat-label { font-size: .75rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-top: 8px; font-weight: 500; }
 
  .steps { list-style: none; margin-top: 22px; display: flex; flex-direction: column; gap: 11px; }
  .step-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; background: rgba(232,168,76,.04); border: 1px solid var(--border); font-size: .82rem; color: var(--text); transition: border-color .2s; }
  .step-row:hover { border-color: var(--border2); }
  .step-n { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; background: var(--gold); color: #080706; font-family: 'Fraunces', serif; font-weight: 700; font-size: .78rem; display: flex; align-items: center; justify-content: center; }
 
  .blist { list-style: none; margin-top: 18px; display: flex; flex-direction: column; gap: 10px; }
  .blist li { display: flex; align-items: flex-start; gap: 10px; font-size: .82rem; color: var(--text); line-height: 1.55; }
  .blist li svg { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
 
  /* CTA */
  .cta-banner {
    margin-top: 72px; border-radius: 24px; padding: 70px 52px; text-align: center;
    background: var(--s1); border: 1px solid var(--border2); position: relative; overflow: hidden;
  }
  .cta-banner::before {
    content: ''; position: absolute; left: 50%; top: -40px; width: 500px; height: 260px;
    transform: translateX(-50%); background: radial-gradient(ellipse, rgba(232,168,76,.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-banner > * { position: relative; z-index: 1; }
  .cta-h { font-family: 'Fraunces', serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; color: var(--cream); letter-spacing: -.03em; line-height: 1.1; margin-bottom: 16px; }
  .cta-h i { font-style: italic; color: var(--gold); font-weight: 300; }
  .cta-sub { color: var(--muted); font-size: .92rem; max-width: 400px; margin: 0 auto 36px; line-height: 1.7; font-weight: 300; }
  .cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
 
  /* footer */
  .footer { margin-top: 64px; padding-top: 28px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
  .footer-copy { font-size: .78rem; color: var(--muted); font-weight: 300; }
 
  /* reveal */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .75s ease, transform .75s ease; }
  .reveal.in { opacity: 1; transform: none; }
  .d1 { transition-delay: .1s; } .d2 { transition-delay: .2s; } .d3 { transition-delay: .3s; }
 
  @keyframes up { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }
`;
 
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
 
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = setTimeout(() => requestAnimationFrame(step), 500);
    return () => clearTimeout(id);
  }, [target]);
  return <>{val}{suffix}</>;
}
 
const features = [
  { title: "AI Resume Builder", desc: "ATS-optimized resumes tailored to your role with smart guided flows.", icon: FileText },
  { title: "Resume Checker",    desc: "Upload & get structured scoring with clear, actionable improvements.",  icon: FileSearch },
  { title: "Mock Interview",    desc: "Voice-enabled practice with timed answers & AI feedback summaries.",    icon: Brain },
  { title: "Job Discovery",     desc: "Curated job cards with smart filters and blazing-fast cached results.", icon: BriefcaseBusiness },
];
 
const workflow = [
  "Build or refine your resume for the exact role you want.",
  "Run the AI checker — find gaps and weak spots instantly.",
  "Practice a realistic mock interview in the same workspace.",
  "Enter job search fully polished and offer-ready.",
];
 
const hostItems = [
  "Public landing pages accessible before any login.",
  "Protected dashboard routing for authenticated features.",
  "Environment-based API config for seamless deployment.",
  "Auth flow with hardened backend origin handling.",
];
 
export default function LandingPage() {
  useReveal();
 
  return (
    <>
      <style>{css}</style>
 
      <div className="blob-wrap">
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
      </div>
 
      <div className="wrap">
        {/* NAV */}
        <nav className="nav">
          <div className="logo">Hire<em>Stack</em></div>
          <div className="nav-r">
            <a href="/login" className="n-link">Login</a>
            <a href="/signup" className="n-cta">Get started <ArrowUpRight size={13} /></a>
          </div>
        </nav>
        <div className="rule" />
 
        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow"><span />Complete Job Preparation<span /></div>
          <h1 className="hero-h">
            Build your résumé.<br />
            <i>Ace</i> the interview.<br />
            Land the role.
          </h1>
          <div className="hero-row">
            <p className="hero-sub">
              HireStack is one unified workspace — AI resume building, intelligent feedback,
              mock interviews and job discovery, all under one roof.
            </p>
            <div className="hero-actions">
              <a href="/signup" className="btn-gold">Start free <ArrowUpRight size={15} /></a>
              <a href="/dashboard" className="btn-ghost">View dashboard</a>
            </div>
          </div>
        </section>
 
        {/* BENTO ROW 1 */}
        <div className="bento bento-top reveal">
          <div className="card card-hero-main">
            <span className="ctag">Platform overview</span>
            <h2 className="card-h xl">
              One platform.<br />Every tool you need<br />to get <em style={{ fontStyle:"italic", color:"var(--gold)", fontFamily:"Fraunces,serif", fontWeight:300 }}>hired faster.</em>
            </h2>
            <p className="card-p">Stop juggling five different apps. HireStack connects your resume work, interview prep, and job search into a single seamless flow that actually gets results.</p>
            <div className="tag-row">
              {["Resume AI","Mock Interview","Job Search","Feedback Engine"].map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
 
          <div className="card" style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", gap:28 }}>
            {[
              { target:4,  suffix:"",   label:"AI-powered tools" },
              { target:94, suffix:"%",  label:"Interview confidence rate" },
              { target:12, suffix:"k+", label:"Candidates prepared" },
            ].map(s => (
              <div key={s.label}>
                <div className="stat-num"><Counter target={s.target} suffix={s.suffix} /></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
 
        {/* BENTO ROW 2 — features */}
        <div className="bento bento-mid">
          {features.map(({ title, desc, icon: Icon }, i) => (
            <div key={title} className={`card reveal d${i}`}>
              <div className="card-icon"><Icon size={19} /></div>
              <h3 className="card-h md">{title}</h3>
              <p className="card-p">{desc}</p>
            </div>
          ))}
        </div>
 
        {/* BENTO ROW 3 */}
        <div className="bento bento-bot">
          <div className="card reveal">
            <span className="ctag">Your journey</span>
            <h2 className="card-h lg">From first draft<br />to offer letter.</h2>
            <ul className="steps">
              {workflow.map((step, i) => (
                <li key={i} className="step-row">
                  <span className="step-n">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
 
          <div className="card reveal d1">
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <ShieldCheck size={17} color="var(--gold)" />
              <span className="ctag" style={{ marginBottom:0 }}>Deployment ready</span>
            </div>
            <h2 className="card-h lg">Built to ship.<br /><em style={{ fontStyle:"italic", fontFamily:"Fraunces,serif", color:"var(--gold)", fontWeight:300 }}>Built to scale.</em></h2>
            <p className="card-p">Architected for real-world hosting with public routes, protected dashboards, and env-based config out of the box.</p>
            <ul className="blist">
              {hostItems.map((item, i) => (
                <li key={i}><CheckCircle2 size={14} />{item}</li>
              ))}
            </ul>
          </div>
        </div>
 
        {/* CTA */}
        <div className="cta-banner reveal">
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, fontSize:".74rem", fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:"var(--gold)", marginBottom:20 }}>
            <Sparkles size={13} /> No credit card required
          </div>
          <h2 className="cta-h">Ready to get <i>hired</i><br />faster than ever?</h2>
          <p className="cta-sub">Join thousands of candidates who used HireStack to go from uncertain to offer-ready in record time.</p>
          <div className="cta-actions">
            <a href="/signup" className="btn-gold">Create free account <ArrowUpRight size={15} /></a>
            <a href="/login" className="btn-ghost">Sign in</a>
          </div>
        </div>
 
        {/* FOOTER */}
        <footer className="footer">
          <div className="logo" style={{ fontSize:"1rem" }}>Hire<em>Stack</em></div>
          <div className="footer-copy">© 2025 HireStack. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}
 