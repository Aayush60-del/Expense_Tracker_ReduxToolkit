import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, LockKeyhole, ShieldCheck, Wallet } from "lucide-react";
import { reset, resetPassword } from "../features/Auth/AuthSlice";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { resetEmail, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.auth || {});

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!resetEmail) navigate("/forgot-password");
  }, [resetEmail, navigate]);

  useEffect(() => {
    if (isError) toast.error(message);

    if (isSuccess && message?.includes("successful")) {
      toast.success(message);
      navigate("/login");
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.otp || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(resetPassword({ email: resetEmail, otp: form.otp, newPassword: form.newPassword }));
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-x-hidden bg-[#f8fbff] px-4 py-8 text-slate-950 sm:px-5 sm:py-10 dark:bg-slate-950 dark:text-white">
      <div className="w-full max-w-[520px]">
        <Link to="/landing" className="auth-animate mx-auto mb-8 flex w-fit items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/25">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight">ExpenseTracker</span>
        </Link>

        <div className="auth-animate rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/5 sm:rounded-[28px] sm:p-7 dark:border-slate-800 dark:bg-slate-900">
          <button onClick={() => navigate("/login")} className="mb-7 inline-flex items-center gap-2 text-sm font-black text-slate-500 hover:text-blue-700 dark:text-slate-400">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-white">
            Set new password
          </h1>
          <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
            Enter the OTP sent to{" "}
            <span className="font-black text-slate-950 dark:text-white">{resetEmail}</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Verification OTP
              </label>
              <input
                value={form.otp}
                onChange={(event) => updateForm("otp", event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                inputMode="numeric"
                className="app-input auth-submit-btn"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                New password
              </label>
              <div className="relative">
                <LockKeyhole className="auth-left-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(event) => updateForm("newPassword", event.target.value)}
                  placeholder="••••••••"
                  className="app-input auth-input-with-icon"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Confirm password
              </label>
              <div className="relative">
                <LockKeyhole className="auth-left-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => updateForm("confirmPassword", event.target.value)}
                  placeholder="••••••••"
                  className="app-input auth-input-with-icon"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="app-btn-primary auth-submit-btn w-full">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
