import fs from "fs";

fs.mkdirSync("src/components/layout", { recursive: true });

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

const MobileDrawer = ({ open, onClose }) => {
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
    <div
      className="fixed inset-0 z-[99999] lg:hidden"
      style={{
        pointerEvents: open ? "auto" : "none",
        visibility: open ? "visible" : "hidden",
      }}
    >
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={onClose}
        className="absolute inset-0 z-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-200"
        style={{
          opacity: open ? 1 : 0,
        }}
      />

      <aside
        className="absolute left-0 top-0 z-10 flex h-dvh w-[84vw] max-w-[330px] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-950"
        style={{
          transform: open ? "translateX(0)" : "translateX(-105%)",
        }}
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
                type="button"
                onClick={handleLogout}
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

fs.writeFileSync("src/components/layout/MobileDrawer.jsx", drawer, "utf8");

// Fix password autocomplete warnings
const autocompleteFixes = [
  ["src/pages/Login.jsx", [
    [`type="password"\n                    value={form.password}`, `type="password"\n                    autoComplete="current-password"\n                    value={form.password}`],
  ]],
  ["src/pages/SignUp.jsx", [
    [`type="password"\n                    value={form.password}`, `type="password"\n                    autoComplete="new-password"\n                    value={form.password}`],
  ]],
  ["src/pages/ResetPassword.jsx", [
    [`type="password"\n                  value={form.newPassword}`, `type="password"\n                  autoComplete="new-password"\n                  value={form.newPassword}`],
    [`type="password"\n                  value={form.confirmPassword}`, `type="password"\n                  autoComplete="new-password"\n                  value={form.confirmPassword}`],
  ]],
  ["src/components/Settings.jsx", [
    [`type="password"\n                    value={security.currentPassword}`, `type="password"\n                    autoComplete="current-password"\n                    value={security.currentPassword}`],
    [`type="password"\n                    value={security.newPassword}`, `type="password"\n                    autoComplete="new-password"\n                    value={security.newPassword}`],
  ]],
];

for (const [file, fixes] of autocompleteFixes) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, "utf8");

  for (const [from, to] of fixes) {
    if (!code.includes("autoComplete") && code.includes(from)) {
      code = code.replace(from, to);
    } else if (code.includes(from) && !code.includes(to)) {
      code = code.replace(from, to);
    }
  }

  fs.writeFileSync(file, code, "utf8");
}

// Fix Recharts width/height warning by adding min dimensions
const chartFiles = ["src/components/DashBoard.jsx", "src/components/Reports.jsx"];

for (const file of chartFiles) {
  if (!fs.existsSync(file)) continue;

  let code = fs.readFileSync(file, "utf8");

  code = code.replaceAll(
    `<ResponsiveContainer width="100%" height="100%">`,
    `<ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>`
  );

  code = code.replaceAll(
    `className="responsive-chart h-[280px] sm:h-[315px]"`,
    `className="responsive-chart min-w-0 h-[280px] sm:h-[315px]"`
  );

  code = code.replaceAll(
    `className="responsive-chart h-[280px] sm:h-[350px]"`,
    `className="responsive-chart min-w-0 h-[280px] sm:h-[350px]"`
  );

  code = code.replaceAll(
    `className="responsive-chart h-[260px] sm:h-[300px]"`,
    `className="responsive-chart min-w-0 h-[260px] sm:h-[300px]"`
  );

  code = code.replaceAll(
    `className="responsive-chart h-[220px] sm:h-[245px]"`,
    `className="responsive-chart min-w-0 h-[220px] sm:h-[245px]"`
  );

  code = code.replaceAll(
    `className="responsive-chart h-[220px] sm:h-[240px]"`,
    `className="responsive-chart min-w-0 h-[220px] sm:h-[240px]"`
  );

  fs.writeFileSync(file, code, "utf8");
}

let css = fs.existsSync("src/index.css") ? fs.readFileSync("src/index.css", "utf8") : "";

if (!css.includes("/* Mobile Drawer and Chart Stability START */")) {
  css += `

/* Mobile Drawer and Chart Stability START */
.responsive-chart {
  min-width: 1px;
  min-height: 220px;
}

.responsive-chart > div {
  min-width: 1px;
  min-height: 1px;
}

@media (max-width: 640px) {
  .responsive-chart {
    min-height: 220px;
  }
}
/* Mobile Drawer and Chart Stability END */
`;
}

fs.writeFileSync("src/index.css", css, "utf8");

console.log("✅ Mobile drawer, autocomplete warnings, and chart warnings fixed.");
