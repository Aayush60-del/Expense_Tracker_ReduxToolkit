import fs from "fs";

const app = `import RouteThemeGuard from "./components/RouteThemeGuard";
import { RouterProvider, createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddTransaction from "./components/AddTransaction";
import Reports from "./components/Reports";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./components/Settings";
import DashBoard from "./components/DashBoard";
import Transactions from "./components/Transactions";
import Categories from "./components/Categories";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import PageShell from "./components/layout/PageShell";

import { fetchTransactions, fetchStats } from "./features/ExpenseTrack/ExpenseSlice";
import { fetchCategories } from "./features/Category/CategorySlice";

function RootLayout() {
  return (
    <>
      <RouteThemeGuard />
      <Outlet />
    </>
  );
}

function AppLayout() {
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
    <PageShell>
      <Outlet />
    </PageShell>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: "/landing", element: <LandingPage /> },
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <SignUp /> },
          { path: "/verify-otp", element: <VerifyOtp /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password", element: <ResetPassword /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: "/", element: <DashBoard /> },
              { path: "/report", element: <Reports /> },
              { path: "/settings", element: <Settings /> },
              { path: "/transactions", element: <Transactions /> },
              { path: "/addtransaction", element: <AddTransaction /> },
              { path: "/categories", element: <Categories /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
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
`;

fs.writeFileSync("src/App.jsx", app, "utf8");

console.log("✅ App.jsx fixed: internal routes now use PageShell.");
