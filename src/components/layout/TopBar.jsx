import { Bell, Menu, PlusCircle, Search } from "lucide-react";
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
