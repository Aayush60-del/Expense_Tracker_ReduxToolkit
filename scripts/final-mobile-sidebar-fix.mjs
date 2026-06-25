import fs from "fs";

const pageShell = `import { useEffect, useMemo, useState } from "react";
import TopBar from "./TopBar";
import SideNav from "../SideNav";
import MobileBottomNav from "./MobileBottomNav";
import MobileDrawer from "./MobileDrawer";
import { getResolvedTheme, getStoredTheme } from "../../lib/theme";

const PageShell = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeState, setThemeState] = useState(() => ({
    theme: getStoredTheme(),
    resolvedTheme: getResolvedTheme(getStoredTheme()),
  }));

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const syncTheme = () => {
      const theme = getStoredTheme();

      setThemeState({
        theme,
        resolvedTheme: getResolvedTheme(theme),
      });

      document.documentElement.classList.remove("dark");
    };

    const handleThemeChange = (event) => {
      setThemeState({
        theme: event.detail?.theme || getStoredTheme(),
        resolvedTheme: event.detail?.resolvedTheme || getResolvedTheme(getStoredTheme()),
      });

      document.documentElement.classList.remove("dark");
    };

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");

    syncTheme();

    window.addEventListener("expense-theme-change", handleThemeChange);
    media?.addEventListener?.("change", syncTheme);

    return () => {
      window.removeEventListener("expense-theme-change", handleThemeChange);
      media?.removeEventListener?.("change", syncTheme);
    };
  }, []);

  const shellClassName = useMemo(() => {
    return themeState.resolvedTheme === "dark" ? "dark" : "";
  }, [themeState.resolvedTheme]);

  return (
    <div
      data-app-shell
      data-theme={themeState.theme}
      className={\`\${shellClassName} min-h-dvh overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100\`}
    >
      <SideNav />

      <div className="min-w-0 lg:pl-[255px]">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="mx-auto w-full max-w-[1180px] px-3 pb-28 pt-5 sm:px-5 md:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <MobileBottomNav />

      {mobileMenuOpen && (
        <MobileDrawer onClose={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
};

export default PageShell;
`;

fs.writeFileSync("src/components/layout/PageShell.jsx", pageShell, "utf8");

const topBar = `import { Bell, Menu, Search } from "lucide-react";
import { useSelector } from "react-redux";

const TopBar = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth || {});

  return (
    <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-[70px] w-full max-w-[1180px] items-center gap-3 px-3 sm:px-5 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Expense overview
          </p>
          <h1 className="truncate text-lg font-black text-slate-950 dark:text-white sm:text-xl">
            Welcome back{user?.name ? \`, \${user.name.split(" ")[0]}\` : ""}
          </h1>
        </div>

        <div className="hidden h-11 min-w-[260px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-400 dark:border-slate-800 dark:bg-slate-900 md:flex">
          <Search className="h-4 w-4" />
          <span className="text-sm font-medium">Search transactions...</span>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-black text-white sm:flex">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
`;

fs.writeFileSync("src/components/layout/TopBar.jsx", topBar, "utf8");

const drawer = `import { Link, useLocation, useNavigate } from "react-router-dom";
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

const MobileDrawer = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    onClose();
    navigate("/landing");
  };

  return (
    <div className="fixed inset-0 z-[999999] lg:hidden">
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
      />

      <aside className="absolute left-0 top-0 z-[1000000] flex h-dvh w-[86vw] max-w-[340px] flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <p className="text-base font-black text-slate-950 dark:text-white">
                ExpenseTracker
              </p>
              <p className="text-xs font-bold text-slate-400">Finance control</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
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

        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-black text-white">
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
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-red-600 dark:hover:bg-slate-800"
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

fs.writeFileSync("src/components/layout/MobileDrawer.jsx", drawer, "utf8");

console.log("✅ Final mobile sidebar patch applied. Drawer is now conditionally mounted.");
