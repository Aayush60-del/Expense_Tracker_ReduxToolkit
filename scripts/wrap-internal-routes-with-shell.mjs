import fs from "fs";

const file = "src/App.jsx";

if (!fs.existsSync(file)) {
  console.error("❌ src/App.jsx not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

if (!code.includes("components/layout/PageShell")) {
  const imports = [...code.matchAll(/^import[\s\S]*?;\s*$/gm)];
  if (imports.length) {
    const lastImport = imports[imports.length - 1];
    const insertAt = lastImport.index + lastImport[0].length;
    code =
      code.slice(0, insertAt) +
      `\nimport PageShell from "./components/layout/PageShell";` +
      code.slice(insertAt);
  } else {
    code = `import PageShell from "./components/layout/PageShell";\n` + code;
  }
}

const publicRoutes = [
  "/landing",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

const isPublicRoute = (path) => {
  if (!path) return true;
  if (path === "*") return true;
  return publicRoutes.some((route) => path === route || path.startsWith(route + "/") || path.startsWith(route + ":"));
};

let wrappedCount = 0;

code = code.replace(
  /<Route\s+([^>]*?\bpath=(["'])(.*?)\2[^>]*?)\belement=\{\s*(<[^{}]+\/>)\s*\}([^>]*)\/>/gs,
  (match, before, quote, path, element, after) => {
    if (isPublicRoute(path)) return match;
    if (match.includes("PageShell")) return match;
    if (element.includes("Navigate")) return match;

    wrappedCount++;

    return `<Route ${before}element={<PageShell>${element}</PageShell>}${after}/>`;
  }
);

fs.writeFileSync(file, code, "utf8");

console.log(`✅ App routes patched. Wrapped internal routes: ${wrappedCount}`);

if (wrappedCount === 0) {
  console.log("⚠️ No routes were wrapped. Your App.jsx route format is different. Send App.jsx output.");
}
