import fs from "fs";

const landing = `import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  LineChart,
  LockKeyhole,
  Menu,
  PieChart,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const splitWords = (text) =>
  text.split(" ").map((word, index) => (
    <span className="reveal-word" key={index}>
      {word}&nbsp;
    </span>
  ));

const LandingPage = () => {
  const rootRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-word", { yPercent: 110, opacity: 0 });
      gsap.set(".hero-kicker, .hero-copy, .hero-actions, .hero-trust", {
        y: 24,
        opacity: 0,
      });
      gsap.set(".hero-visual", { y: 40, scale: 0.96, opacity: 0 });
      gsap.set(".float-card", { y: 24, opacity: 0, scale: 0.96 });

      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .to(".hero-kicker", { y: 0, opacity: 1, duration: 0.7 })
        .to(
          ".hero-word",
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.055,
          },
          "-=0.25"
        )
        .to(
          ".hero-copy",
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.35"
        )
        .to(
          ".hero-actions",
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.45"
        )
        .to(
          ".hero-visual",
          { y: 0, scale: 1, opacity: 1, duration: 1 },
          "-=0.55"
        )
        .to(
          ".float-card",
          { y: 0, scale: 1, opacity: 1, duration: 0.75, stagger: 0.12 },
          "-=0.55"
        )
        .to(
          ".hero-trust",
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.4"
        );

      gsap.to(".orb-one", {
        x: 38,
        y: -26,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".orb-two", {
        x: -34,
        y: 28,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".dashboard-mockup", {
        y: -18,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray(".section-title").forEach((title) => {
        gsap.from(title.querySelectorAll(".reveal-word"), {
          scrollTrigger: {
            trigger: title,
            start: "top 82%",
          },
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          stagger: 0.035,
          ease: "power3.out",
        });
      });

      gsap.utils.toArray(".reveal-up").forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
          },
          y: 42,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
        });
      });

      gsap.utils.toArray(".feature-card").forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
          },
          y: 45,
          opacity: 0,
          scale: 0.97,
          duration: 0.75,
          delay: index * 0.04,
          ease: "power3.out",
        });
      });

      gsap.to(".analytics-strip", {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: ".analytics-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.from(".pin-card", {
        scrollTrigger: {
          trigger: ".workflow-section",
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { label: "Features", id: "features" },
    { label: "Analytics", id: "analytics" },
    { label: "Workflow", id: "workflow" },
    { label: "FAQ", id: "faq" },
  ];

  const features = [
    {
      icon: Wallet,
      title: "Smart expense tracking",
      desc: "Track income, expenses, categories, and notes with a clean finance-first dashboard.",
    },
    {
      icon: BarChart3,
      title: "Visual analytics",
      desc: "Understand spending patterns with category breakdowns, trends, and monthly summaries.",
    },
    {
      icon: ReceiptText,
      title: "Transaction history",
      desc: "Search, filter, manage, and export transactions without messy spreadsheets.",
    },
    {
      icon: ShieldCheck,
      title: "Secure authentication",
      desc: "JWT auth, OTP flow, password reset, and protected account-level data.",
    },
    {
      icon: Zap,
      title: "Fast workflow",
      desc: "Add transactions quickly and keep your finance overview always updated.",
    },
    {
      icon: LockKeyhole,
      title: "Private by design",
      desc: "Each user gets isolated personal finance records with protected API routes.",
    },
  ];

  const workflow = [
    {
      step: "01",
      title: "Add income and expenses",
      desc: "Record daily spending, income, category, date, and notes in seconds.",
    },
    {
      step: "02",
      title: "Understand the pattern",
      desc: "See where money goes through visual charts and smart summaries.",
    },
    {
      step: "03",
      title: "Take better decisions",
      desc: "Use reports, budget alerts, and history to improve your financial habits.",
    },
  ];

  const faqs = [
    {
      q: "Is this only a basic CRUD project?",
      a: "No. It includes auth, OTP/password reset, categories, analytics, reports, settings, budget logic, CSV export, and animated UI.",
    },
    {
      q: "Does it support guest mode?",
      a: "Yes. Users can explore the product in guest mode before creating an account.",
    },
    {
      q: "Can I export my transactions?",
      a: "Yes. The transaction page supports CSV export for the currently visible data.",
    },
    {
      q: "Is billing included?",
      a: "No. This version is designed as a clean personal finance SaaS-style app without payment or pricing sections.",
    },
  ];

  return (
    <div ref={rootRef} className="landing-shell min-h-screen overflow-hidden bg-[#f8fbff] text-slate-950">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/landing" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">ExpenseTracker</p>
              <p className="-mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                Finance OS
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-full px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-600"
            >
              Start Free
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  {item.label}
                </button>
              ))}
              <Link to="/login" className="rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                Log In
              </Link>
              <Link to="/signup" className="rounded-xl bg-blue-600 px-3 py-3 text-sm font-bold text-white">
                Start Free
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-32 lg:px-8 lg:pt-40">
          <div className="absolute inset-0 landing-grid opacity-80" />
          <div className="orb-one absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />
          <div className="orb-two absolute bottom-20 right-[-140px] h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="hero-kicker mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Animated MERN finance dashboard
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
                {["Track", "money", "with", "clarity,", "speed", "and", "control."].map((word) => (
                  <span key={word} className="hero-line inline-block overflow-hidden pr-3">
                    <span className="hero-word inline-block">{word}</span>
                  </span>
                ))}
              </h1>

              <p className="hero-copy mt-7 max-w-2xl text-lg leading-8 text-slate-600">
                A premium personal finance web app built with MERN, Redux Toolkit, JWT auth,
                analytics, reports, CSV export, and smooth GSAP interactions.
              </p>

              <div className="hero-actions mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-4 text-sm font-black text-white shadow-2xl shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-700"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700"
                >
                  Open Dashboard
                </Link>
              </div>

              <div className="hero-trust mt-10 grid max-w-xl grid-cols-3 gap-3">
                {[
                  ["JWT", "Secure auth"],
                  ["CSV", "Export data"],
                  ["GSAP", "Premium motion"],
                ].map(([top, bottom]) => (
                  <div key={top} className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur-xl">
                    <p className="text-xl font-black text-slate-950">{top}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{bottom}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual relative">
              <div className="dashboard-mockup relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_100px_rgba(15,23,42,0.16)]">
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Balance</p>
                      <p className="mt-1 text-4xl font-black">₹42,850</p>
                    </div>
                    <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-200">
                      <Wallet className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-slate-400">Income</p>
                      <p className="mt-2 text-xl font-black text-emerald-300">₹58,000</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-slate-400">Expenses</p>
                      <p className="mt-2 text-xl font-black text-rose-300">₹15,150</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-black">Monthly Trend</p>
                      <LineChart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex h-36 items-end gap-3">
                      {[38, 62, 45, 80, 52, 90, 66, 74].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t-xl bg-blue-100">
                          <div
                            className="rounded-t-xl bg-blue-600"
                            style={{ height: height + "%" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="float-card absolute -left-4 top-12 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Saved this month</p>
                    <p className="font-black text-slate-950">₹12,400</p>
                  </div>
                </div>
              </div>

              <div className="float-card absolute -right-2 bottom-16 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">Top category</p>
                    <p className="font-black text-slate-950">Food & Travel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="reveal-up text-sm font-black uppercase tracking-[0.28em] text-blue-600">
                Features
              </p>
              <h2 className="section-title mt-4 overflow-hidden text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                {splitWords("Everything needed to manage daily money flow.")}
              </h2>
              <p className="reveal-up mt-5 text-lg leading-8 text-slate-600">
                Built like a real product, not just a simple CRUD demo.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="feature-card group rounded-[1.7rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-600/10"
                  >
                    <div className="mb-6 flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="analytics" className="analytics-section overflow-hidden bg-slate-950 py-24 text-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <p className="reveal-up text-sm font-black uppercase tracking-[0.28em] text-blue-300">
              Analytics
            </p>
            <h2 className="section-title mt-4 max-w-4xl overflow-hidden text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              {splitWords("Visual reports that make expenses easy to understand.")}
            </h2>
          </div>

          <div className="analytics-strip mt-14 flex w-[180vw] gap-5 px-5 lg:px-8">
            {[
              ["Income", "₹58,000", "text-emerald-300"],
              ["Expenses", "₹15,150", "text-rose-300"],
              ["Balance", "₹42,850", "text-blue-300"],
              ["Savings Rate", "73.8%", "text-amber-300"],
              ["Categories", "12 active", "text-cyan-300"],
              ["Reports", "Monthly", "text-violet-300"],
            ].map(([label, value, color]) => (
              <div key={label} className="min-w-[280px] rounded-[1.7rem] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
                <p className="text-sm font-bold text-slate-400">{label}</p>
                <p className={"mt-4 text-4xl font-black " + color}>{value}</p>
                <div className="mt-7 h-2 rounded-full bg-white/10">
                  <div className="h-full w-2/3 rounded-full bg-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="workflow-section px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="reveal-up text-sm font-black uppercase tracking-[0.28em] text-blue-600">
                  Workflow
                </p>
                <h2 className="section-title mt-4 overflow-hidden text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  {splitWords("A simple flow for better financial decisions.")}
                </h2>
                <p className="reveal-up mt-5 text-lg leading-8 text-slate-600">
                  Add data once, then let the dashboard show your progress.
                </p>
              </div>

              <div className="space-y-5">
                {workflow.map((item) => (
                  <div key={item.step} className="pin-card rounded-[1.7rem] border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="mb-5 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-600">
                      Step {item.step}
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] bg-blue-600 px-7 py-14 text-center text-white shadow-2xl shadow-blue-600/25 lg:px-12">
            <p className="reveal-up text-sm font-black uppercase tracking-[0.28em] text-blue-100">
              Ready
            </p>
            <h2 className="section-title mx-auto mt-4 max-w-4xl overflow-hidden text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              {splitWords("Turn your expenses into clear financial insight.")}
            </h2>
            <p className="reveal-up mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-50">
              Start tracking your money with a clean, animated, production-style MERN app.
            </p>
            <div className="reveal-up mt-8 flex justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center rounded-full bg-white px-7 py-4 text-sm font-black text-blue-700 shadow-xl transition hover:-translate-y-1"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="px-5 pb-24 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="reveal-up text-sm font-black uppercase tracking-[0.28em] text-blue-600">
                FAQ
              </p>
              <h2 className="section-title mt-4 overflow-hidden text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                {splitWords("Questions before you start?")}
              </h2>
            </div>

            <div className="mt-12 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="reveal-up rounded-[1.4rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-black text-slate-950">{faq.q}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 ExpenseTracker. Built with MERN, Redux Toolkit and GSAP.</p>
          <div className="flex gap-5">
            <button onClick={() => scrollToSection("features")} className="hover:text-blue-600">
              Features
            </button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-blue-600">
              FAQ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
`;

fs.writeFileSync("src/pages/LandingPage.jsx", landing, "utf8");

let css = fs.readFileSync("src/index.css", "utf8");

if (!css.includes("/* Premium GSAP Landing Page START */")) {
  css += `

/* Premium GSAP Landing Page START */
.landing-shell {
  scroll-behavior: smooth;
}

.landing-grid {
  background-image:
    linear-gradient(to right, rgba(37, 99, 235, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: linear-gradient(to bottom, black, transparent 88%);
}

.reveal-word {
  display: inline-block;
  transform: translateY(0);
  will-change: transform, opacity;
}

.hero-line {
  vertical-align: top;
}

.feature-card {
  will-change: transform, opacity;
}

.dashboard-mockup {
  will-change: transform;
}

.analytics-strip {
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .landing-shell *,
  .landing-shell *::before,
  .landing-shell *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
/* Premium GSAP Landing Page END */
`;
}

fs.writeFileSync("src/index.css", css, "utf8");

console.log("✅ Premium GSAP landing page added.");
