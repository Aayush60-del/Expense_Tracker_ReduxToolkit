import fs from "fs";

const cssFile = "src/index.css";

let css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, "utf8") : "";

if (!css.includes("/* Auth Input Icon Fix START */")) {
  css += `

/* Auth Input Icon Fix START */
.auth-input-with-icon {
  height: 52px !important;
  padding-left: 48px !important;
  padding-right: 14px !important;
}

.auth-submit-btn {
  height: 52px !important;
}

.auth-left-icon {
  pointer-events: none;
  z-index: 2;
}
/* Auth Input Icon Fix END */
`;
}

fs.writeFileSync(cssFile, css, "utf8");

const files = [
  "src/pages/Login.jsx",
  "src/pages/SignUp.jsx",
  "src/pages/ForgotPassword.jsx",
  "src/pages/ResetPassword.jsx",
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  let code = fs.readFileSync(file, "utf8");

  code = code.replaceAll(
    `className="app-input h-13 pl-12"`,
    `className="app-input auth-input-with-icon"`
  );

  code = code.replaceAll(
    `className="app-input pl-12 h-13"`,
    `className="app-input auth-input-with-icon"`
  );

  code = code.replaceAll(
    `className="app-input h-13"`,
    `className="app-input auth-submit-btn"`
  );

  code = code.replaceAll(
    `className="app-btn-primary h-13 w-full"`,
    `className="app-btn-primary auth-submit-btn w-full"`
  );

  code = code.replaceAll(
    `className="app-btn-secondary h-13 w-full"`,
    `className="app-btn-secondary auth-submit-btn w-full"`
  );

  code = code.replaceAll(
    `className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"`,
    `className="auth-left-icon absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"`
  );

  fs.writeFileSync(file, code, "utf8");
}

console.log("✅ Auth input icon overlap fixed.");
