import fs from "fs";

const files = [
  "src/components/DashBoard.jsx",
  "src/components/Transactions.jsx",
  "src/components/AddTransaction.jsx",
  "src/components/Categories.jsx",
  "src/components/Reports.jsx",
  "src/components/Settings.jsx",
  "src/pages/Login.jsx",
  "src/pages/SignUp.jsx",
  "src/pages/VerifyOtp.jsx",
  "src/pages/ForgotPassword.jsx",
  "src/pages/ResetPassword.jsx",
];

function removeInternalGsap(file) {
  if (!fs.existsSync(file)) return;

  let code = fs.readFileSync(file, "utf8");

  code = code.replace(/import gsap from "gsap";\n/g, "");

  code = code.replace(/\n\s*const pageRef = useRef\(null\);\n/g, "\n");
  code = code.replace(/\n\s*const rootRef = useRef\(null\);\n/g, "\n");

  code = code.replace(/\sref=\{pageRef\}/g, "");
  code = code.replace(/\sref=\{rootRef\}/g, "");

  code = code.replace(
    /\n\s*useEffect\(\(\) => \{\s*if \(!pageRef\.current\) return;\s*gsap\.fromTo\([\s\S]*?\);\s*\}, \[[^\]]*\]\);\n/g,
    "\n"
  );

  code = code.replace(
    /\n\s*useEffect\(\(\) => \{\s*if \(!rootRef\.current\) return;\s*gsap\.fromTo\([\s\S]*?\);\s*\}, \[[^\]]*\]\);\n/g,
    "\n"
  );

  fs.writeFileSync(file, code, "utf8");
}

files.forEach(removeInternalGsap);

// PageShell se bhi GSAP page transition remove
const shellFile = "src/components/layout/PageShell.jsx";

if (fs.existsSync(shellFile)) {
  const shell = `import TopBar from "./TopBar";
import SideNav from "../SideNav";
import MobileBottomNav from "./MobileBottomNav";

const PageShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <SideNav />

      <div className="lg:pl-[255px]">
        <TopBar />

        <main className="mx-auto w-full max-w-[1180px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default PageShell;
`;

  fs.writeFileSync(shellFile, shell, "utf8");
}

console.log("✅ GSAP removed from internal pages. Landing page GSAP untouched.");
