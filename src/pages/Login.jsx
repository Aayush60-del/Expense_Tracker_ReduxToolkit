import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ArrowRight,
  BarChart3,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { guestLogin, login, reset } from "../features/Auth/AuthSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, guestMode, isLoading, isError, isSuccess, message, requiresOtp } =
    useSelector((state) => state.auth || {});

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isError) toast.error(message);
    if (requiresOtp) navigate("/verify-otp");
    else if (isSuccess || user || guestMode) navigate("/");

    dispatch(reset());
  }, [user, guestMode, isError, isSuccess, requiresOtp, message, navigate, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(login(form));
  };

  const handleGuest = () => {
    dispatch(guestLogin());
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#f8fbff] text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[430px]">
            <Link to="/landing" className="auth-animate mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight">ExpenseTracker</span>
            </Link>

            <div className="auth-animate">
              <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300">
                Welcome back
              </p>
              <h1 className="text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl dark:text-white">
                Sign in to your finance dashboard
              </h1>
              <p className="mt-4 text-base font-medium leading-7 text-slate-500 dark:text-slate-400">
                Continue tracking income, expenses, categories and reports.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-animate mt-9 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Email
                </label>
                <div className="relative">
                  <Mail className="auth-left-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="you@example.com"
                    className="app-input auth-input-with-icon"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm font-black text-blue-700 hover:text-blue-800 dark:text-blue-300">
                    Forgot?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="auth-left-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="••••••••"
                    className="app-input auth-input-with-icon"
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="app-btn-primary auth-submit-btn w-full">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            <div className="auth-animate mt-7">
              <button onClick={handleGuest} className="app-btn-secondary auth-submit-btn w-full">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Try Guest Mode
              </button>
            </div>

            <p className="auth-animate mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-black text-blue-700 dark:text-blue-300">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(37,99,235,0.42),transparent_30%),radial-gradient(circle_at_75%_75%,rgba(14,165,233,0.25),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:54px_54px]" />

          <div className="relative flex h-full items-center justify-center p-12">
            <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
              <div className="mb-8 flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-bold text-slate-400">Total balance</p>
                  <h2 className="mt-2 text-5xl font-black tracking-tight">₹42,850</h2>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/20 text-blue-200">
                  <Wallet className="h-8 w-8" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm font-bold text-slate-400">Income</p>
                  <p className="mt-3 text-2xl font-black text-emerald-300">₹58,000</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm font-bold text-slate-400">Expenses</p>
                  <p className="mt-3 text-2xl font-black text-rose-300">₹15,150</p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-white p-6 text-slate-950 shadow-2xl">
                <div className="flex items-center justify-between">
                  <p className="font-black">Spending analytics</p>
                  <BarChart3 className="h-5 w-5 text-blue-700" />
                </div>

                <div className="mt-8 flex h-44 items-end gap-3">
                  {[45, 70, 38, 88, 56, 96, 65, 78].map((height, index) => (
                    <div
                      key={index}
                      className="relative h-full flex-1 overflow-hidden rounded-t-2xl bg-blue-100"
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-blue-700"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between text-xs font-black text-slate-400">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-slate-300">
                <ShieldCheck className="h-5 w-5 text-blue-300" />
                Secure JWT auth · OTP reset · Private records
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
