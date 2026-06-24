import fs from "fs";

fs.mkdirSync("src/components/layout", { recursive: true });

const topbar = `import { Bell, PlusCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const TopBar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex h-[70px] items-center justify-between gap-4 px-6 lg:px-8">
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
            to="/add-transaction"
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-blue-700 px-5 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            <PlusCircle className="h-4 w-4" />
            New
          </Link>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-700 ring-1 ring-blue-100 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/20">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
`;

const sidebar = `import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart3,
  FolderOpen,
  Grid2X2,
  LogOut,
  PlusCircle,
  ReceiptText,
  Settings,
  Wallet,
} from "lucide-react";
import { logout, reset } from "../features/Auth/AuthSlice";

const navItems = [
  { label: "Dashboard", path: "/", icon: Grid2X2 },
  { label: "Transactions", path: "/transactions", icon: ReceiptText },
  { label: "Add Transaction", path: "/add-transaction", icon: PlusCircle },
  { label: "Categories", path: "/categories", icon: FolderOpen },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

const SideNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/landing");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[255px] border-r border-slate-200 bg-white lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-[70px] items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
          <Wallet className="h-5 w-5" />
        </div>
        <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
          ExpenseTracker
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={\`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition \${
                active
                  ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-500/15 dark:text-blue-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              }\`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 text-sm font-black text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-slate-950 dark:text-white">
                {user?.name || "Guest User"}
              </p>
              <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                {user?.email || "guest@local"}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-red-600 dark:hover:bg-slate-800"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
`;

const pageShell = `import { useEffect, useRef } from "react";
import gsap from "gsap";
import TopBar from "./TopBar";
import SideNav from "../SideNav";

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

        <main ref={contentRef} className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageShell;
`;

fs.writeFileSync("src/components/layout/TopBar.jsx", topbar, "utf8");
fs.writeFileSync("src/components/SideNav.jsx", sidebar, "utf8");
fs.writeFileSync("src/components/layout/PageShell.jsx", pageShell, "utf8");

let app = fs.readFileSync("src/App.jsx", "utf8");

if (!app.includes("PageShell")) {
  app = app.replace(
    /import SideNav from "\.\/components\/SideNav";\n?/,
    ""
  );

  const lastImportIndex = app.lastIndexOf("import ");
  const nextLineIndex = app.indexOf("\n", lastImportIndex);
  app = app.slice(0, nextLineIndex + 1) + `import PageShell from "./components/layout/PageShell";\n` + app.slice(nextLineIndex + 1);

  app = app.replace(
    /<SideNav\s*\/>/g,
    ""
  );

  app = app.replace(
    /<main[^>]*>\s*<Routes>/,
    `<PageShell>\n        <Routes>`
  );

  app = app.replace(
    /<\/Routes>\s*<\/main>/,
    `</Routes>\n      </PageShell>`
  );
}

let css = fs.existsSync("src/index.css") ? fs.readFileSync("src/index.css", "utf8") : "";

if (!css.includes("/* Premium Internal App Shell START */")) {
  css += `

/* Premium Internal App Shell START */
.app-card {
  border: 1px solid rgb(226 232 240);
  background: white;
  border-radius: 20px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.05);
}

.dark .app-card {
  border-color: rgb(30 41 59);
  background: rgb(15 23 42);
}

.app-page-title {
  font-size: 32px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.045em;
  color: rgb(2 6 23);
}

.dark .app-page-title {
  color: white;
}

.app-page-subtitle {
  margin-top: 8px;
  color: rgb(71 85 105);
  font-weight: 500;
}

.dark .app-page-subtitle {
  color: rgb(148 163 184);
}

.app-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  background: rgb(29 78 216);
  color: white;
  font-weight: 900;
  padding: 10px 18px;
  transition: 180ms ease;
  box-shadow: 0 12px 30px rgba(29, 78, 216, 0.18);
}

.app-btn-primary:hover {
  transform: translateY(-1px);
  background: rgb(30 64 175);
}

.app-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  border: 1px solid rgb(226 232 240);
  background: white;
  color: rgb(15 23 42);
  font-weight: 800;
  padding: 10px 18px;
  transition: 180ms ease;
}

.app-btn-secondary:hover {
  border-color: rgb(191 219 254);
  color: rgb(29 78 216);
}

.dark .app-btn-secondary {
  border-color: rgb(51 65 85);
  background: rgb(15 23 42);
  color: rgb(226 232 240);
}

.app-input {
  height: 46px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgb(226 232 240);
  background: rgb(248 250 252);
  padding: 0 14px;
  font-weight: 500;
  color: rgb(15 23 42);
  outline: none;
}

.app-input:focus {
  border-color: rgb(147 197 253);
  background: white;
  box-shadow: 0 0 0 4px rgb(219 234 254);
}

.dark .app-input {
  border-color: rgb(51 65 85);
  background: rgb(2 6 23);
  color: white;
}

.dark .app-input:focus {
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}
/* Premium Internal App Shell END */
`;
}

fs.writeFileSync("src/index.css", css, "utf8");

console.log("✅ Premium app shell applied.");
