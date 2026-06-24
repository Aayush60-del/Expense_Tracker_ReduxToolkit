import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAdvancedLandingGSAP } from "../hooks/useAdvancedLandingGSAP";
import {
  ArrowRight,
  BarChart3,
  Bell,
  ChevronDown,
  Download,
  LockKeyhole,
  LogIn,
  Menu,
  PieChart,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";


const features = [
  {
    icon: Wallet,
    title: "Income & Expense tracking",
    desc: "Log every transaction in seconds and watch your real balance update instantly.",
  },
  {
    icon: Tags,
    title: "Smart categories",
    desc: "Organize transactions by category and discover where your money actually goes.",
  },
  {
    icon: BarChart3,
    title: "Reports & analytics",
    desc: "Monthly trends, category breakdowns, and cashflow insights you can act on.",
  },
  {
    icon: Download,
    title: "One-click CSV export",
    desc: "Export filtered data for taxes, audits, or your accountant instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Secure login",
    desc: "JWT auth, hashed passwords, and protected MERN routes for user data.",
  },
  {
    icon: LockKeyhole,
    title: "OTP password reset",
    desc: "Recover account access with one-time codes delivered to your inbox.",
  },
  {
    icon: Bell,
    title: "Budget alerts",
    desc: "Set soft limits and get a heads-up before you overspend.",
  },
  {
    icon: Sparkles,
    title: "Clean, fast UI",
    desc: "Keyboard-friendly, responsive, and built for daily finance tracking.",
  },
];

const stats = [
  ["120,000+", "Transactions tracked"],
  ["98%", "Faster monthly reviews"],
  ["24/7", "Encrypted, always-on"],
  ["30s", "Avg. CSV export time"],
];

const workflow = [
  {
    icon: LogIn,
    step: "01",
    title: "Create your account",
    desc: "Sign up in seconds with email and a strong password. OTP reset has your back.",
  },
  {
    icon: PlusCircle,
    step: "02",
    title: "Log income & expenses",
    desc: "Add transactions manually, assign category, amount, date, and notes.",
  },
  {
    icon: Tags,
    step: "03",
    title: "Organize with categories",
    desc: "Apply smart categories and budgets so your data tells a story.",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Watch insights appear",
    desc: "See trends, exports, and reports update across your dashboard.",
  },
];

const faqs = [
  {
    q: "Is ExpenseTracker free to use?",
    a: "Yes. This version is focused on personal finance tracking without billing, pricing, or payment flows.",
  },
  {
    q: "How is my financial data secured?",
    a: "The app uses JWT-based authentication, protected API routes, hashed passwords, and user-scoped MongoDB records.",
  },
  {
    q: "Can I reset my password if I forget it?",
    a: "Yes. The app includes OTP-based password reset through email.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Transactions can be exported as CSV from the transactions page.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. The landing page and app dashboard are responsive across desktop, tablet, and mobile.",
  },
  {
    q: "What stack is it built on?",
    a: "React, Vite, Tailwind CSS, Redux Toolkit, GSAP, Express, MongoDB, Mongoose, JWT, and Nodemailer.",
  },
];

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const DashboardMockup = () => {
  const bars = [42, 88, 25, 34, 18, 12];

  return (
    <div className="dashboard-preview mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_35px_110px_rgba(37,99,235,0.18)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
        <div className="flex items-center gap-4">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="text-sm font-bold text-slate-500">
            app.expensetracker.io / dashboard
          </span>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500 sm:flex">
          <Search className="h-4 w-4" />
          Search transactions
        </div>
      </div>

      <div className="p-7">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Balance", "$12,840.20", "+8.2% this month", Wallet, "text-blue-600"],
            ["Income", "$5,420.00", "vs $4,980 last month", TrendingUp, "text-slate-900"],
            ["Expenses", "$2,210.80", "42% of income", TrendingDown, "text-red-500"],
          ].map(([label, value, sub, Icon, color]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">{value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.75fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-slate-950">Cashflow</p>
                <p className="text-sm font-semibold text-slate-500">Last 9 months</p>
              </div>
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-600">
                ↗ +18.4%
              </span>
            </div>

            <div className="relative h-44 overflow-hidden rounded-xl bg-gradient-to-b from-blue-50 to-white">
              <svg viewBox="0 0 720 190" className="h-full w-full">
                <path
                  d="M0 140 C80 100 130 115 190 125 C260 140 290 70 365 80 C440 90 455 55 535 75 C610 95 630 35 720 45"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 140 C80 100 130 115 190 125 C260 140 290 70 365 80 C440 90 455 55 535 75 C610 95 630 35 720 45 L720 190 L0 190 Z"
                  fill="rgba(37,99,235,0.16)"
                />
              </svg>

              <div className="absolute bottom-3 left-0 right-0 grid grid-cols-9 px-5 text-xs font-semibold text-slate-400">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-lg font-black text-slate-950">Categories</p>
              <span className="text-xl font-black text-slate-400">...</span>
            </div>

            <div className="flex h-44 items-end gap-4">
              {bars.map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-blue-700" style={{ height: `${height}%` }} />
                  <span className="text-xs font-semibold text-slate-500">
                    {["Food", "Rent", "Travel", "Bills", "Fun", "Other"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <p className="font-black text-slate-950">Recent transactions</p>
            <p className="text-sm font-bold text-slate-500">Export CSV</p>
          </div>

          {[
            ["↗", "Salary — Acme Co.", "Income", "Salary", "+$4200.00", "text-slate-900"],
            ["↘", "Whole Foods Market", "Groceries", "Food", "$86.40", "text-slate-900"],
            ["↘", "Uber ride", "Travel", "Travel", "$14.20", "text-slate-900"],
          ].map(([arrow, name, sub, tag, amount, color]) => (
            <div key={name} className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-b-0">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-lg font-black">
                  {arrow}
                </span>
                <div>
                  <p className="font-black text-slate-950">{name}</p>
                  <p className="text-sm font-semibold text-slate-500">{sub}</p>
                </div>
              </div>
              <div className="hidden items-center gap-5 sm:flex">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {tag}
                </span>
                <p className={`font-black ${color}`}>{amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const rootRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  useAdvancedLandingGSAP(rootRef);

  const navItems = [
    ["Features", "features"],
    ["Analytics", "analytics"],
    ["Workflow", "workflow"],
    ["FAQ", "faq"],
  ];

  const goTo = (id) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-[#f8fbff] text-slate-950">
      <header className="fixed left-0 right-0 top-0 z-50 px-3 py-3">
        <nav className="mx-auto flex h-[70px] max-w-[1480px] items-center justify-between rounded-3xl border border-slate-200/80 bg-white/85 px-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:px-6">
          <Link to="/landing" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight">ExpenseTracker</span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {navItems.map(([label, id]) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className="text-base font-bold text-slate-500 transition hover:text-blue-700"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Link to="/login" className="text-base font-bold text-slate-900 hover:text-blue-700">
              Log In
            </Link>
            <Link
              to="/signup"
              className="rounded-2xl bg-blue-700 px-6 py-3 text-base font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
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
          <div className="mx-auto mt-2 max-w-[1480px] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl lg:hidden">
            {navItems.map(([label, id]) => (
              <button
                key={id}
                onClick={() => goTo(id)}
                className="block w-full rounded-2xl px-4 py-3 text-left font-bold text-slate-600 hover:bg-slate-50"
              >
                {label}
              </button>
            ))}
            <Link to="/login" className="block rounded-2xl px-4 py-3 font-bold text-slate-600 hover:bg-slate-50">
              Log In
            </Link>
            <Link to="/signup" className="mt-2 block rounded-2xl bg-blue-700 px-4 py-3 text-center font-black text-white">
              Start Free
            </Link>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 pt-36">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,64,175,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,64,175,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_65%_10%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_50%_75%,rgba(37,99,235,0.18),transparent_34%)]" />

          <div className="relative mx-auto max-w-7xl px-5 pb-24 text-center">
            <div className="hero-chip mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-500 shadow-sm backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-blue-700" />
              Personal finance, beautifully organized
            </div>

            <h1 className="hero-title mx-auto mt-10 max-w-6xl text-[54px] font-black leading-[0.98] tracking-[-0.075em] text-slate-950 sm:text-[74px] lg:text-[92px]">
              Take <span className="text-blue-700">control</span> of every rupee you earn and spend.
            </h1>

            <p className="hero-copy mx-auto mt-8 max-w-3xl text-xl font-medium leading-9 text-slate-500">
              ExpenseTracker is a modern personal finance dashboard that turns your income,
              expenses, and categories into clear, actionable insights — with secure login and
              one-click CSV exports.
            </p>

            <div className="hero-actions mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-8 py-4 text-base font-black text-white shadow-xl shadow-blue-700/20 transition hover:-translate-y-1 hover:bg-blue-800"
              >
                Start Free
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-900 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700"
              >
                Log In
              </Link>
            </div>

            <div className="hero-security mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              Secure JWT auth · OTP password reset · Your data stays yours
            </div>
          </div>

          <div className="relative mx-auto -mb-16 max-w-7xl px-5">
            <DashboardMockup />
          </div>
        </section>

        <section className="px-5 pb-28 pt-36">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="stat-card rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-5xl font-black tracking-tight text-blue-700">{value}</p>
                <p className="mt-3 text-lg font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="px-5 pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="reveal-up mx-auto max-w-4xl text-center">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500">
                Features
              </span>
              <h2 className="mt-7 text-5xl font-black leading-tight tracking-[-0.055em] text-slate-950 md:text-6xl">
                Everything you need to <span className="text-blue-700">master your money</span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-xl font-medium leading-8 text-slate-500">
                Powerful primitives, honest defaults. ExpenseTracker stays out of your way and shows up exactly when you need clarity.
              </p>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="feature-card rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-700/10"
                  >
                    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-slate-950">{feature.title}</h3>
                    <p className="mt-4 text-lg leading-7 text-slate-500">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="analytics" className="analytics-section bg-slate-950 px-5 py-28 text-white">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="reveal-up">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
                Analytics
              </span>
              <h2 className="mt-8 text-5xl font-black leading-tight tracking-[-0.055em] md:text-6xl">
                Insights that read like a <span className="text-blue-600">conversation</span>
              </h2>
              <p className="mt-7 max-w-2xl text-xl font-semibold leading-8 text-slate-400">
                Interactive charts, comparable timeframes, and category-level drilldowns. See where your money goes, week over week.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Category & merchant breakdowns",
                  "Trendlines for income vs. spending",
                  "Month-over-month deltas at a glance",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sky-300">
                      <BarChart3 className="h-5 w-5" />
                    </span>
                    <p className="text-lg font-bold text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-panel rounded-[28px] border border-white/10 bg-[#071225] p-8 shadow-2xl shadow-blue-950/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-400">September spending</p>
                  <p className="mt-2 text-4xl font-black">$2,340.00</p>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-slate-300">
                  +4.1% MoM
                </span>
              </div>

              <div className="mt-12 flex justify-center">
                <div className="relative h-72 w-72 rounded-full bg-[conic-gradient(#1e40af_0_25%,#2563eb_25%_45%,#38bdf8_45%_58%,#22c55e_58%_68%,#f59e0b_68%_74%,#1e40af_74%_100%)]">
                  <div className="absolute inset-14 rounded-full bg-[#071225]" />
                </div>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-5 text-sm font-bold">
                {[
                  ["Housing", "bg-blue-800"],
                  ["Food", "bg-blue-600"],
                  ["Transport", "bg-sky-400"],
                  ["Utilities", "bg-green-500"],
                  ["Leisure", "bg-amber-400"],
                ].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2 text-slate-300">
                    <span className={`h-3 w-5 rounded-sm ${color}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="px-5 py-28">
          <div className="mx-auto max-w-7xl">
            <div className="reveal-up mx-auto max-w-4xl text-center">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500">
                Workflow
              </span>
              <h2 className="mt-7 text-5xl font-black leading-tight tracking-[-0.055em] text-slate-950 md:text-6xl">
                From zero to clarity in <span className="text-blue-700">four steps</span>
              </h2>
            </div>

            <div className="relative mt-20 grid gap-7 md:grid-cols-2 lg:grid-cols-4">
              <div className="absolute left-0 right-0 top-[54px] hidden h-px bg-slate-200 lg:block" />
              {workflow.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.step} className="workflow-card relative rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                      Step {item.step}
                    </p>
                    <h3 className="mt-4 text-xl font-black text-slate-950">{item.title}</h3>
                    <p className="mt-4 text-lg leading-7 text-slate-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-slate-200 px-5 py-28">
          <div className="mx-auto max-w-5xl">
            <div className="reveal-up text-center">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500">
                FAQ
              </span>
              <h2 className="mt-7 text-5xl font-black tracking-[-0.055em] text-slate-950 md:text-6xl">
                Questions, <span className="text-blue-700">answered</span>
              </h2>
            </div>

            <div className="mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {faqs.map((faq, index) => (
                <div key={faq.q} className="border-b border-slate-200 last:border-b-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="flex w-full items-center justify-between px-7 py-6 text-left text-xl font-black text-slate-950"
                  >
                    {faq.q}
                    <ChevronDown className={`h-5 w-5 transition ${openFaq === index ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-7 pb-6 text-lg leading-8 text-slate-500">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24">
          <div className="mx-auto max-w-7xl rounded-[32px] bg-gradient-to-r from-blue-800 to-blue-600 px-8 py-24 text-center text-white shadow-2xl shadow-blue-700/20">
            <h2 className="reveal-up text-5xl font-black tracking-[-0.055em] md:text-6xl">
              Start tracking your money in minutes.
            </h2>
            <p className="reveal-up mx-auto mt-6 max-w-3xl text-xl font-semibold text-blue-100">
              No payment details. No setup fees. Just a clearer view of your finances.
            </p>
            <div className="reveal-up mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-black text-slate-950 transition hover:-translate-y-1"
              >
                Start Free
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-white/15"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <Link to="/landing" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xl font-black">ExpenseTracker</span>
          </Link>

          <div className="flex flex-wrap justify-center gap-8 text-base font-semibold text-slate-500">
            {navItems.map(([label, id]) => (
              <button key={id} onClick={() => goTo(id)} className="hover:text-blue-700">
                {label}
              </button>
            ))}
          </div>

          <p className="text-sm font-semibold text-slate-500">
            © 2026 ExpenseTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
