import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/Auth/AuthSlice";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  Tags,
  X,
  LogOut
} from "lucide-react";

const SideNav = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Transactions", path: "/transactions", icon: Wallet },
    { label: "Add Transaction", path: "/addtransaction", icon: Plus },
    { label: "Categories", path: "/categories", icon: Tags },
    { label: "Reports", path: "/report", icon: BarChart3 },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 py-8">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 font-bold text-xl">
              E
            </div>
            <h1 className="text-xl font-bold tracking-tight">Expense Tracker</h1>
          </motion.div>
          <button className="md:hidden text-white/80 hover:text-white" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 px-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <motion.button
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  onClick={() => {
                    navigate(item.path);
                    onClose?.();
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={20} className={isActive ? "text-blue-600" : "text-white/80"} />
                  <span>{item.label}</span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        <div className="p-6 mt-auto">
          {user ? (
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold">
                (user?.name?.charAt(0) || "U")
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-white">{user.name || "User"}</p>
                <p className="truncate text-xs text-white/70">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/80 text-white font-bold">
                G
              </div>
              <div>
                <p className="text-sm font-medium text-white">Guest User</p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-500/30 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
