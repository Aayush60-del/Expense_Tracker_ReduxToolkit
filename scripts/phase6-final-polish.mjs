import fs from "fs";

fs.mkdirSync("src/components/layout", { recursive: true });

const mobileBottomNav = `import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  FolderOpen,
  Grid2X2,
  PlusCircle,
  ReceiptText,
} from "lucide-react";

const items = [
  { label: "Home", path: "/", icon: Grid2X2 },
  { label: "Txns", path: "/transactions", icon: ReceiptText },
  { label: "Add", path: "/addtransaction", icon: PlusCircle },
  { label: "Cats", path: "/categories", icon: FolderOpen },
  { label: "Reports", path: "/report", icon: BarChart3 },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 px-2 py-2 backdrop-blur-2xl lg:hidden dark:border-slate-800 dark:bg-slate-950/90">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={\`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-black transition \${
                active
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              }\`}
            >
              <Icon className="mb-1 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
`;

const topbar = `import { Bell, Menu, PlusCircle, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const pageTitleMap = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/addtransaction": "Add Transaction",
  "/categories": "Categories",
  "/report": "Reports",
  "/settings": "Settings",
};

const getPageTitle = (pathname) => {
  const exact = pageTitleMap[pathname];
  if (exact) return exact;

  const match = Object.entries(pageTitleMap).find(([path]) => {
    if (path === "/") return false;
    return pathname.startsWith(path);
  });

  return match?.[1] || "ExpenseTracker";
};

const TopBar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex h-[70px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
            <Menu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950 dark:text-white">
              {getPageTitle(location.pathname)}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              ExpenseTracker
            </p>
          </div>
        </div>

        <div className="relative hidden w-full max-w-xl md:block">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, categories..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500/10"
          />
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          <Link
            to="/addtransaction"
            className="hidden h-11 items-center gap-2 rounded-2xl bg-blue-700 px-5 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 sm:inline-flex"
          >
            <PlusCircle className="h-4 w-4" />
            New
          </Link>

          <Link
            to="/settings"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/20"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
`;

const pageShell = `import { useEffect, useRef } from "react";
import gsap from "gsap";
import TopBar from "./TopBar";
import SideNav from "../SideNav";
import MobileBottomNav from "./MobileBottomNav";

const PageShell = ({ children }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 18, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out" }
    );
  }, [children]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <SideNav />

      <div className="lg:pl-[255px]">
        <TopBar />

        <main ref={contentRef} className="mx-auto w-full max-w-[1180px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default PageShell;
`;

fs.writeFileSync("src/components/layout/MobileBottomNav.jsx", mobileBottomNav, "utf8");
fs.writeFileSync("src/components/layout/TopBar.jsx", topbar, "utf8");
fs.writeFileSync("src/components/layout/PageShell.jsx", pageShell, "utf8");

const filesToNormalize = [
  "src/App.jsx",
  "src/components/SideNav.jsx",
  "src/components/layout/TopBar.jsx",
  "src/components/layout/MobileBottomNav.jsx",
  "src/components/DashBoard.jsx",
  "src/components/Transactions.jsx",
  "src/components/AddTransaction.jsx",
  "src/components/Categories.jsx",
  "src/components/Reports.jsx",
  "src/components/Settings.jsx",
];

for (const file of filesToNormalize) {
  if (!fs.existsSync(file)) continue;

  let code = fs.readFileSync(file, "utf8");

  code = code
    .replaceAll("/add-transaction", "/addtransaction")
    .replaceAll("/addTransaction", "/addtransaction")
    .replaceAll("/reports", "/report");

  fs.writeFileSync(file, code, "utf8");
}

let css = fs.existsSync("src/index.css") ? fs.readFileSync("src/index.css", "utf8") : "";

if (!css.includes("/* Final SaaS Polish START */")) {
  css += `

/* Final SaaS Polish START */
* {
  -webkit-tap-highlight-color: transparent;
}

html {
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
}

.app-card {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

.app-card:hover {
  border-color: rgb(191 219 254);
}

.dark .app-card:hover {
  border-color: rgba(96, 165, 250, 0.25);
}

.app-btn-primary:disabled,
.app-btn-secondary:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none !important;
}

.app-input::placeholder {
  color: rgb(148 163 184);
}

.dark .app-input::placeholder {
  color: rgb(100 116 139);
}

.recharts-wrapper * {
  outline: none;
}

@media (max-width: 768px) {
  .app-page-title {
    font-size: 28px;
  }

  .app-card {
    border-radius: 18px;
  }
}

@media print {
  body,
  html,
  #root {
    background: white !important;
    color: black !important;
  }

  aside,
  header,
  nav,
  button,
  .Toastify,
  .no-print {
    display: none !important;
  }

  main {
    padding: 0 !important;
    max-width: none !important;
  }

  .app-card {
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
    break-inside: avoid;
  }
}
/* Final SaaS Polish END */
`;
}

fs.writeFileSync("src/index.css", css, "utf8");

console.log("✅ Phase 6 applied: mobile nav, final polish, route consistency.");
