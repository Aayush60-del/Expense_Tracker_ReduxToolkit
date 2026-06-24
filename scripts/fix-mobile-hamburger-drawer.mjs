import fs from "fs";

fs.mkdirSync("src/components/layout", { recursive: true });

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

const TopBar = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth || {});
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex h-[64px] items-center justify-between gap-3 px-3 sm:h-[70px] sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20 transition active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>

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
          <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 sm:h-11 sm:w-11 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-100 sm:h-11 sm:w-11 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/20"
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

const mobileDrawer = `import { Link, useLocation, useNavigate } from "react-router-dom";
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
  X,
} from "lucide-react";
import { logout, reset } from "../../features/Auth/AuthSlice";

const navItems = [
  { label: "Dashboard", path: "/", icon: Grid2X2 },
  { label: "Transactions", path: "/transactions", icon: ReceiptText },
  { label: "Add Transaction", path: "/addtransaction", icon: PlusCircle },
  { label: "Categories", path: "/categories", icon: FolderOpen },
  { label: "Reports", path: "/report", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

const MobileDrawer = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    onClose();
    navigate("/landing");
  };

  return (
    <div
      className={\`fixed inset-0 z-[70] lg:hidden \${
        open ? "pointer-events-auto" : "pointer-events-none"
      }\`}
    >
      <button
        type="button"
        aria-label="Close menu overlay"
        onClick={onClose}
        className={\`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-200 \${
          open ? "opacity-100" : "opacity-0"
        }\`}
      />

      <aside
        className={\`absolute left-0 top-0 flex h-dvh w-[82vw] max-w-[320px] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 \${
          open ? "translate-x-0" : "-translate-x-full"
        }\`}
      >
        <div className="flex h-[70px] items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
              ExpenseTracker
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
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
                onClick={onClose}
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
    </div>
  );
};

export default MobileDrawer;
`;

const pageShell = `import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import SideNav from "../SideNav";
import MobileBottomNav from "./MobileBottomNav";
import MobileDrawer from "./MobileDrawer";

const PageShell = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <SideNav />

      <div className="min-w-0 lg:pl-[255px]">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="mx-auto w-full max-w-[1180px] px-3 pb-28 pt-5 sm:px-5 md:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <MobileBottomNav />
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </div>
  );
};

export default PageShell;
`;

fs.writeFileSync("src/components/layout/TopBar.jsx", topbar, "utf8");
fs.writeFileSync("src/components/layout/MobileDrawer.jsx", mobileDrawer, "utf8");
fs.writeFileSync("src/components/layout/PageShell.jsx", pageShell, "utf8");

console.log("✅ Hamburger mobile drawer fixed.");
