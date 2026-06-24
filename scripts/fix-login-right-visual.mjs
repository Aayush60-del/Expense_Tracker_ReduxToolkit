import fs from "fs";

const file = "src/pages/Login.jsx";

if (!fs.existsSync(file)) {
  console.error("❌ src/pages/Login.jsx not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

const oldStart = code.indexOf(`<div className="relative hidden overflow-hidden bg-slate-950 lg:block">`);
const oldEnd = code.lastIndexOf(`      </div>
    </div>
  );
};

export default Login;`);

if (oldStart === -1 || oldEnd === -1) {
  console.error("❌ Login right visual block not found");
  process.exit(1);
}

const newRightBlock = `<div className="relative hidden overflow-hidden bg-slate-950 lg:block">
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
                        style={{ height: \`\${height}%\` }}
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
        </div>`;

code = code.slice(0, oldStart) + newRightBlock + "\n" + code.slice(oldEnd);

fs.writeFileSync(file, code, "utf8");

console.log("✅ Login right-side analytics visual fixed.");
