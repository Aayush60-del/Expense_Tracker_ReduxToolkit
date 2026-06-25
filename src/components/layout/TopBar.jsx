import { Bell, Menu, Search } from "lucide-react";
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
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
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
