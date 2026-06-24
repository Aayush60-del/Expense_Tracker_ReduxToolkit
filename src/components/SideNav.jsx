import { Link, useLocation, useNavigate } from "react-router-dom";
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
  { label: "Add Transaction", path: "/addtransaction", icon: PlusCircle },
  { label: "Categories", path: "/categories", icon: FolderOpen },
  { label: "Reports", path: "/report", icon: BarChart3 },
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
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                active
                  ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-500/15 dark:text-blue-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
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
