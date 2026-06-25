import fs from "fs";

fs.mkdirSync("src/components", { recursive: true });

const component = `import {
  BarChart3,
  IndianRupee,
  PieChart,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const bars = [44, 72, 58, 92, 66, 82, 54];

const FinanceHeroIllustration = () => {
  return (
    <div className="dashboard-preview finance-hero-visual relative mx-auto mt-14 w-full max-w-5xl lg:mt-16">
      <div className="absolute -left-6 top-16 hidden h-20 w-20 rounded-full bg-blue-500/15 blur-2xl sm:block" />
      <div className="absolute -right-8 bottom-20 hidden h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl sm:block" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 p-4 shadow-2xl shadow-blue-950/30 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.32),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.22),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="finance-float rounded-[28px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-black text-blue-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart finance overview
                </div>

                <p className="mt-6 text-sm font-bold text-slate-400">Available balance</p>
                <h3 className="mt-2 text-5xl font-black tracking-tight sm:text-6xl">
                  ₹42,850
                </h3>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-500/20">
                <Wallet className="h-8 w-8" />
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                  Income
                </div>
                <p className="mt-3 text-2xl font-black text-emerald-300">₹58,000</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                  <TrendingDown className="h-4 w-4 text-rose-300" />
                  Expenses
                </div>
                <p className="mt-3 text-2xl font-black text-rose-300">₹15,150</p>
              </div>
            </div>

            <div className="mt-7 rounded-3xl bg-white p-5 text-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black">Monthly activity</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">Income vs spending trend</p>
                </div>
                <BarChart3 className="h-5 w-5 text-blue-700" />
              </div>

              <div className="mt-6 flex h-40 items-end gap-3">
                {bars.map((height, index) => (
                  <div
                    key={index}
                    className="relative h-full flex-1 overflow-hidden rounded-t-2xl bg-blue-100"
                  >
                    <div
                      className="finance-bar absolute bottom-0 left-0 right-0 rounded-t-2xl bg-blue-700"
                      style={{
                        height: \`\${height}%\`,
                        animationDelay: \`\${index * 120}ms\`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="finance-float finance-delay-1 rounded-[28px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-400">Category split</p>
                  <h4 className="mt-2 text-2xl font-black">Spending clarity</h4>
                </div>
                <PieChart className="h-7 w-7 text-cyan-200" />
              </div>

              <div className="mt-7 flex items-center gap-6">
                <div className="finance-donut relative h-32 w-32 rounded-full">
                  <div className="absolute inset-8 rounded-full bg-slate-950" />
                </div>

                <div className="flex-1 space-y-3">
                  {[
                    ["Food", "₹8,240", "bg-blue-500"],
                    ["Rent", "₹14,000", "bg-cyan-400"],
                    ["Travel", "₹3,600", "bg-emerald-400"],
                    ["Fun", "₹2,150", "bg-amber-400"],
                  ].map(([label, amount, color]) => (
                    <div key={label} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2 font-bold text-slate-300">
                        <span className={\`h-2.5 w-2.5 rounded-full \${color}\`} />
                        {label}
                      </div>
                      <p className="font-black text-white">{amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="finance-float finance-delay-2 rounded-[28px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="mt-5 text-sm font-bold text-slate-400">Protected data</p>
                <p className="mt-2 text-xl font-black">JWT + OTP</p>
              </div>

              <div className="finance-float finance-delay-3 rounded-[28px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-200">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <p className="mt-5 text-sm font-bold text-slate-400">Savings rate</p>
                <p className="mt-2 text-xl font-black">72%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="finance-coin finance-coin-1">₹</div>
        <div className="finance-coin finance-coin-2">₹</div>
        <div className="finance-coin finance-coin-3">₹</div>
      </div>
    </div>
  );
};

export default FinanceHeroIllustration;
`;

fs.writeFileSync("src/components/FinanceHeroIllustration.jsx", component, "utf8");

const landingFile = "src/pages/LandingPage.jsx";

if (!fs.existsSync(landingFile)) {
  console.error("❌ src/pages/LandingPage.jsx not found");
  process.exit(1);
}

let landing = fs.readFileSync(landingFile, "utf8");

if (!landing.includes("FinanceHeroIllustration")) {
  const importMatches = landing.match(/^import[\s\S]*?;\n/gm);
  const lastImport = importMatches ? importMatches[importMatches.length - 1] : null;

  if (lastImport) {
    const insertAt = landing.lastIndexOf(lastImport) + lastImport.length;
    landing =
      landing.slice(0, insertAt) +
      `import FinanceHeroIllustration from "../components/FinanceHeroIllustration";\n` +
      landing.slice(insertAt);
  } else {
    landing =
      `import FinanceHeroIllustration from "../components/FinanceHeroIllustration";\n` +
      landing;
  }
}

if (landing.includes("<DashboardMockup />")) {
  landing = landing.replaceAll("<DashboardMockup />", "<FinanceHeroIllustration />");
} else if (!landing.includes("<FinanceHeroIllustration />")) {
  console.warn("⚠️ Could not find <DashboardMockup />. Add <FinanceHeroIllustration /> manually in hero section if needed.");
}

fs.writeFileSync(landingFile, landing, "utf8");

const cssFile = "src/index.css";
let css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, "utf8") : "";

if (!css.includes("/* Custom Finance Illustration START */")) {
  css += `

/* Custom Finance Illustration START */
.finance-hero-visual {
  perspective: 1200px;
}

.finance-float {
  animation: financeFloat 5.5s ease-in-out infinite;
}

.finance-delay-1 {
  animation-delay: 0.5s;
}

.finance-delay-2 {
  animation-delay: 1s;
}

.finance-delay-3 {
  animation-delay: 1.4s;
}

.finance-bar {
  transform-origin: bottom;
  animation: financeBarRise 1.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.finance-donut {
  background:
    conic-gradient(
      from 180deg,
      #2563eb 0deg 118deg,
      #38bdf8 118deg 198deg,
      #22c55e 198deg 276deg,
      #f59e0b 276deg 360deg
    );
  box-shadow: 0 20px 45px rgba(37, 99, 235, 0.22);
}

.finance-coin {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: #78350f;
  font-weight: 900;
  box-shadow: 0 18px 35px rgba(245, 158, 11, 0.28);
  animation: financeCoinFloat 4.4s ease-in-out infinite;
}

.finance-coin-1 {
  top: 12%;
  left: 3%;
}

.finance-coin-2 {
  right: 4%;
  top: 36%;
  animation-delay: 0.7s;
}

.finance-coin-3 {
  bottom: 8%;
  left: 43%;
  animation-delay: 1.2s;
}

@keyframes financeFloat {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes financeBarRise {
  from {
    transform: scaleY(0);
    opacity: 0;
  }

  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes financeCoinFloat {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-14px) rotate(8deg);
  }
}

@media (max-width: 640px) {
  .finance-coin {
    width: 34px;
    height: 34px;
    font-size: 13px;
  }

  .finance-coin-2 {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .finance-float,
  .finance-bar,
  .finance-coin {
    animation: none !important;
  }
}
/* Custom Finance Illustration END */
`;
}

fs.writeFileSync(cssFile, css, "utf8");

console.log("✅ Custom free finance illustration added to landing page.");
