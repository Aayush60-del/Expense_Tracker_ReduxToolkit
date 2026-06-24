import RouteThemeGuard from "./components/RouteThemeGuard";
import { RouterProvider, createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu } from "lucide-react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import AddTransaction from "./components/AddTransaction";
import Reports from "./components/Reports";
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from "./components/Settings";
import DashBoard from "./components/DashBoard";
import Transactions from "./components/Transactions";
import Categories from "./components/Categories";
import SideNav from "./components/SideNav";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { fetchTransactions, fetchStats } from "./features/ExpenseTrack/ExpenseSlice";
import { fetchCategories } from "./features/Category/CategorySlice";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, guestMode } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user || guestMode) {
      dispatch(fetchTransactions());
      dispatch(fetchStats());
      dispatch(fetchCategories());
    }
  }, [user, guestMode, dispatch]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <SideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto md:ml-64 transition-all duration-300 relative w-full">
        <div className="md:hidden flex items-center justify-between bg-white border-b p-4 sticky top-0 z-20">
          <div className="font-bold text-lg text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">E</div>
            Expense Tracker
          </div>
          <button className="p-2 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto flex-1">
          <Outlet />
        </div>
      </div>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: "/landing", element: <LandingPage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/verify-otp", element: <VerifyOtp /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <DashBoard /> },
          { path: "/report", element: <Reports /> },
          { path: "/settings", element: <Settings /> },
          { path: "/transactions", element: <Transactions /> },
          { path: "/addtransaction", element: <AddTransaction /> },
          { path: "/categories", element: <Categories /> }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
