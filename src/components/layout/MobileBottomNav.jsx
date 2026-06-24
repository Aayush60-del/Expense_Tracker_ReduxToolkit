import { Link, useLocation } from "react-router-dom";
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
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-black transition ${
                active
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
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
