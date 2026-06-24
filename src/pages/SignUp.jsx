import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { guestLogin, register, reset } from "../features/Auth/AuthSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, guestMode, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.auth || {});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user || guestMode) navigate("/");

    dispatch(reset());
  }, [user, guestMode, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(register(form));
  };

  const handleGuest = () => {
    dispatch(guestLogin());
  };

  const benefits = [
    "Secure personal finance dashboard",
    "Track income, expenses and categories",
    "Reports, CSV export and analytics",
    "OTP reset and protected data",
  ];

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#f8fbff] text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.45),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.22),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:54px_54px]" />

          <div className="relative flex h-full items-center justify-center p-12">
            <div className="auth-animate max-w-xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-blue-200 backdrop-blur-xl">
                <Sparkles className="h-4 w-4" />
                Start your finance operating system
              </div>

              <h2 className="text-5xl font-black leading-[0.96] tracking-[-0.07em] text-white xl:text-6xl">
                Build better money habits with clarity.
              </h2>

              <p className="mt-7 text-lg font-medium leading-8 text-slate-300">
                Record transactions, understand spending, export reports, and keep your financial data protected.
              </p>

              <div className="mt-10 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-xl">
                    <CheckCircle2 className="h-5 w-5 text-blue-300" />
                    <span className="font-bold">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
                Create account
              </p>
              <h1 className="text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl dark:text-white">
                Start tracking your money today
              </h1>
              <p className="mt-4 text-base font-medium leading-7 text-slate-500 dark:text-slate-400">
                No billing. No pricing. Just a clean personal finance tracker.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-animate mt-9 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Name
                </label>
                <div className="relative">
                  <User className="auth-left-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Ayush Negi"
                    className="app-input auth-input-with-icon"
                  />
                </div>
              </div>

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
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="auth-left-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="Minimum 6 characters"
                    className="app-input auth-input-with-icon"
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="app-btn-primary auth-submit-btn w-full">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            <div className="auth-animate mt-7">
              <button onClick={handleGuest} className="app-btn-secondary auth-submit-btn w-full">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Try Guest Mode First
              </button>
            </div>

            <p className="auth-animate mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-black text-blue-700 dark:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
