import fs from "fs";

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function replaceInFile(file, replacers) {
  if (!fs.existsSync(file)) return;

  let code = fs.readFileSync(file, "utf8");

  for (const [from, to] of replacers) {
    code = code.replaceAll(from, to);
  }

  fs.writeFileSync(file, code, "utf8");
}

// 1. Ensure viewport meta exists
const indexFile = "index.html";
if (fs.existsSync(indexFile)) {
  let html = fs.readFileSync(indexFile, "utf8");

  if (!html.includes('name="viewport"')) {
    html = html.replace(
      "<head>",
      `<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />`
    );
  }

  fs.writeFileSync(indexFile, html, "utf8");
}

// 2. PageShell responsive spacing
const shellFile = "src/components/layout/PageShell.jsx";
if (fs.existsSync(shellFile)) {
  const shell = `import TopBar from "./TopBar";
import SideNav from "../SideNav";
import MobileBottomNav from "./MobileBottomNav";

const PageShell = ({ children }) => {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <SideNav />

      <div className="min-w-0 lg:pl-[255px]">
        <TopBar />

        <main className="mx-auto w-full max-w-[1180px] px-3 pb-28 pt-5 sm:px-5 md:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default PageShell;
`;

  write(shellFile, shell);
}

// 3. Topbar responsive search
const topbarFile = "src/components/layout/TopBar.jsx";
if (fs.existsSync(topbarFile)) {
  replaceInFile(topbarFile, [
    [
      `className="flex h-[70px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"`,
      `className="flex h-[64px] items-center justify-between gap-3 px-3 sm:h-[70px] sm:px-6 lg:px-8"`
    ],
    [
      `className="relative hidden w-full max-w-xl md:block"`,
      `className="relative hidden w-full max-w-xl md:block"`
    ],
    [
      `className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"`,
      `className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 sm:h-11 sm:w-11 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"`
    ],
    [
      `className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/20"`,
      `className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100 sm:h-11 sm:w-11 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/20"`
    ],
  ]);
}

// 4. Make dashboard/report chart cards mobile-safe
const chartFiles = [
  "src/components/DashBoard.jsx",
  "src/components/Reports.jsx",
];

for (const file of chartFiles) {
  if (!fs.existsSync(file)) continue;

  let code = fs.readFileSync(file, "utf8");

  code = code.replaceAll(
    `className="h-[315px]"`,
    `className="responsive-chart h-[280px] sm:h-[315px]"`
  );

  code = code.replaceAll(
    `className="h-[350px]"`,
    `className="responsive-chart h-[280px] sm:h-[350px]"`
  );

  code = code.replaceAll(
    `className="h-[300px]"`,
    `className="responsive-chart h-[260px] sm:h-[300px]"`
  );

  code = code.replaceAll(
    `className="h-[245px]"`,
    `className="responsive-chart h-[220px] sm:h-[245px]"`
  );

  code = code.replaceAll(
    `className="h-[240px]"`,
    `className="responsive-chart h-[220px] sm:h-[240px]"`
  );

  code = code.replaceAll(
    `className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"`,
    `className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"`
  );

  code = code.replaceAll(
    `className="grid gap-5 md:grid-cols-3"`,
    `className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"`
  );

  code = code.replaceAll(
    `className="grid gap-6 xl:grid-cols-[1.45fr_0.7fr]"`,
    `className="grid gap-5 xl:grid-cols-[1.45fr_0.7fr]"`
  );

  code = code.replaceAll(
    `className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]"`,
    `className="grid gap-5 xl:grid-cols-[1.5fr_0.8fr]"`
  );

  fs.writeFileSync(file, code, "utf8");
}

// 5. Transactions mobile filter stack fix
replaceInFile("src/components/Transactions.jsx", [
  [
    `className="grid gap-4 lg:grid-cols-[1.2fr_0.85fr_0.65fr]"`,
    `className="grid gap-3 sm:gap-4 lg:grid-cols-[1.2fr_0.85fr_0.65fr]"`
  ],
  [
    `className="tx-animate flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"`,
    `className="tx-animate flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between"`
  ],
  [
    `className="flex flex-wrap gap-3"`,
    `className="flex w-full flex-wrap gap-3 sm:w-auto"`
  ],
  [
    `className="app-btn-secondary" disabled={!displayData.length}`,
    `className="app-btn-secondary flex-1 sm:flex-none" disabled={!displayData.length}`
  ],
  [
    `className="app-btn-primary"`,
    `className="app-btn-primary flex-1 sm:flex-none"`
  ],
]);

// 6. Add Transaction responsive sidebar/form fix
replaceInFile("src/components/AddTransaction.jsx", [
  [
    `className="grid gap-6 xl:grid-cols-[1fr_330px]"`,
    `className="grid gap-5 xl:grid-cols-[1fr_330px]"`
  ],
  [
    `className="grid gap-4 md:grid-cols-2"`,
    `className="grid gap-3 sm:grid-cols-2"`
  ],
  [
    `className="grid gap-6 md:grid-cols-2"`,
    `className="grid gap-5 sm:grid-cols-2"`
  ],
  [
    `className="space-y-4"`,
    `className="space-y-4 xl:pt-0"`
  ],
  [
    `className="add-animate app-card p-6 xl:sticky xl:top-24"`,
    `className="add-animate app-card p-5 sm:p-6 xl:sticky xl:top-24"`
  ],
  [
    `className="add-animate app-card p-6"`,
    `className="add-animate app-card p-5 sm:p-6"`
  ],
]);

// 7. Categories responsive grid fix
replaceInFile("src/components/Categories.jsx", [
  [
    `className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"`,
    `className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"`
  ],
  [
    `className="cat-animate app-card group min-h-[185px] p-6 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-700/10"`,
    `className="cat-animate app-card group min-h-[165px] p-5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-700/10 sm:min-h-[185px] sm:p-6"`
  ],
  [
    `className="cat-animate flex min-h-[185px] flex-col items-center justify-center rounded-[20px] border border-dashed border-blue-400 bg-blue-50/60 p-6 text-center text-blue-700 transition hover:-translate-y-1 hover:bg-blue-50 dark:border-blue-400/50 dark:bg-blue-500/10 dark:text-blue-300"`,
    `className="cat-animate flex min-h-[165px] flex-col items-center justify-center rounded-[20px] border border-dashed border-blue-400 bg-blue-50/60 p-5 text-center text-blue-700 transition hover:-translate-y-1 hover:bg-blue-50 sm:min-h-[185px] sm:p-6 dark:border-blue-400/50 dark:bg-blue-500/10 dark:text-blue-300"`
  ],
]);

// 8. Settings mobile tabs horizontal scroll fix
replaceInFile("src/components/Settings.jsx", [
  [
    `className="grid gap-6 lg:grid-cols-[255px_1fr]"`,
    `className="grid gap-5 lg:grid-cols-[255px_1fr]"`
  ],
  [
    `className="settings-animate app-card h-fit p-3"`,
    `className="settings-animate app-card h-fit overflow-x-auto p-2 lg:p-3"`
  ],
  [
    `{tabs.map((tab) => {`,
    `<div className="flex min-w-max gap-1 lg:block">
          {tabs.map((tab) => {`
  ],
  [
    `          })}
        </div>`,
    `          })}
          </div>
        </div>`
  ],
  [
    `className={\`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition last:mb-0 \${`,
    `className={\`mb-1 flex min-w-fit items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition last:mb-0 lg:w-full \${`
  ],
  [
    `className="mt-7 grid gap-5 md:grid-cols-2"`,
    `className="mt-7 grid gap-5 sm:grid-cols-2"`
  ],
  [
    `className="grid gap-3 md:grid-cols-3"`,
    `className="grid gap-3 sm:grid-cols-3"`
  ],
]);

// 9. Auth pages mobile spacing + prevent horizontal overflow
const authFiles = [
  "src/pages/Login.jsx",
  "src/pages/SignUp.jsx",
  "src/pages/VerifyOtp.jsx",
  "src/pages/ForgotPassword.jsx",
  "src/pages/ResetPassword.jsx",
];

for (const file of authFiles) {
  if (!fs.existsSync(file)) continue;

  let code = fs.readFileSync(file, "utf8");

  code = code.replaceAll(
    `className="min-h-screen bg-[#f8fbff] text-slate-950 dark:bg-slate-950 dark:text-white"`,
    `className="min-h-dvh overflow-x-hidden bg-[#f8fbff] text-slate-950 dark:bg-slate-950 dark:text-white"`
  );

  code = code.replaceAll(
    `className="flex min-h-screen items-center justify-center bg-[#f8fbff] px-5 py-10 text-slate-950 dark:bg-slate-950 dark:text-white"`,
    `className="flex min-h-dvh items-center justify-center overflow-x-hidden bg-[#f8fbff] px-4 py-8 text-slate-950 sm:px-5 sm:py-10 dark:bg-slate-950 dark:text-white"`
  );

  code = code.replaceAll(
    `className="text-4xl font-black tracking-[-0.055em] text-slate-950 dark:text-white"`,
    `className="text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl dark:text-white"`
  );

  code = code.replaceAll(
    `className="text-6xl font-black leading-[0.96] tracking-[-0.07em] text-white"`,
    `className="text-5xl font-black leading-[0.96] tracking-[-0.07em] text-white xl:text-6xl"`
  );

  code = code.replaceAll(
    `className="auth-animate rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900"`,
    `className="auth-animate rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/5 sm:rounded-[28px] sm:p-7 dark:border-slate-800 dark:bg-slate-900"`
  );

  fs.writeFileSync(file, code, "utf8");
}

// 10. Global responsive CSS
const cssFile = "src/index.css";
let css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, "utf8") : "";

if (!css.includes("/* Responsive Audit Patch START */")) {
  css += `

/* Responsive Audit Patch START */
html,
body,
#root {
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
}

img,
video,
canvas,
svg {
  max-width: 100%;
}

button,
a,
input,
select,
textarea {
  touch-action: manipulation;
}

.responsive-chart {
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

.responsive-chart .recharts-wrapper,
.responsive-chart .recharts-surface {
  max-width: 100% !important;
}

@media (max-width: 640px) {
  .app-page-title {
    font-size: 26px !important;
    line-height: 1.12 !important;
    letter-spacing: -0.045em !important;
  }

  .app-page-subtitle {
    font-size: 14px !important;
    line-height: 1.6 !important;
  }

  .app-card {
    border-radius: 18px !important;
  }

  .app-btn-primary,
  .app-btn-secondary {
    min-height: 44px;
    padding-left: 14px;
    padding-right: 14px;
  }

  .app-input {
    min-height: 44px;
    font-size: 14px;
  }

  table {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .app-page-title {
    font-size: 24px !important;
  }

  .app-btn-primary,
  .app-btn-secondary {
    font-size: 13px;
  }
}
/* Responsive Audit Patch END */
`;
}

fs.writeFileSync(cssFile, css, "utf8");

console.log("✅ Responsive audit patch applied.");
