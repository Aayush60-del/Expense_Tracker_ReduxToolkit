import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, ShieldCheck, Wallet } from "lucide-react";
import { resendOtp, reset, verifyOtp } from "../features/Auth/AuthSlice";

const VerifyOtp = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { otpEmail, isLoading, isError, isSuccess, message, user } =
    useSelector((state) => state.auth || {});

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!otpEmail) navigate("/login");
  }, [otpEmail, navigate]);

  useEffect(() => {
    if (isError) toast.error(message);
    if (user && isSuccess) {
      toast.success("Login successful");
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  useEffect(() => {
    const timer = countdown > 0 ? setInterval(() => setCountdown((count) => count - 1), 1000) : null;
    return () => timer && clearInterval(timer);
  }, [countdown]);

  const handleVerify = (codeValue) => {
    const code = codeValue || otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    dispatch(verifyOtp({ email: otpEmail, otp: code }));
  };

  const handleChange = (index, event) => {
    const value = event.target.value.replace(/\D/g, "");

    const nextOtp = [...otp];

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      pasted.forEach((digit, i) => {
        nextOtp[i] = digit;
      });
      setOtp(nextOtp);

      if (pasted.length === 6) handleVerify(pasted.join(""));
      else inputRefs.current[Math.min(pasted.length, 5)]?.focus();

      return;
    }

    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5 && nextOtp.every(Boolean)) handleVerify(nextOtp.join(""));
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;

    dispatch(resendOtp({ email: otpEmail }));
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
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
            Verify your login
          </h1>
          <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
            We sent a 6-digit code to{" "}
            <span className="font-black text-slate-950 dark:text-white">{otpEmail}</span>
          </p>

          <div className="mt-8 grid grid-cols-6 gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                inputMode="numeric"
                maxLength={6}
                className="h-14 rounded-2xl border border-slate-200 bg-slate-50 text-center text-2xl font-black outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-500/10"
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={isLoading || otp.some((digit) => !digit)}
            className="app-btn-primary mt-8 h-13 w-full"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Code"}
          </button>

          <div className="mt-6 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Didn&apos;t receive it?{" "}
            {countdown > 0 ? (
              <span>Resend in {countdown}s</span>
            ) : (
              <button onClick={handleResend} className="font-black text-blue-700 dark:text-blue-300">
                Resend code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
