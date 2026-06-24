import fs from "fs";

fs.mkdirSync("src/components", { recursive: true });

const guard = `import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyAppTheme, getStoredTheme } from "../lib/theme";

const publicRoutes = [
  "/landing",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

const isPublicRoute = (pathname) => {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
};

const RouteThemeGuard = () => {
  const location = useLocation();

  useEffect(() => {
    const publicPage = isPublicRoute(location.pathname);

    if (publicPage) {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("public-light-route");
      return;
    }

    document.body.classList.remove("public-light-route");
    applyAppTheme(getStoredTheme());
  }, [location.pathname]);

  return null;
};

export default RouteThemeGuard;
`;

fs.writeFileSync("src/components/RouteThemeGuard.jsx", guard, "utf8");

const appFile = "src/App.jsx";

if (!fs.existsSync(appFile)) {
  console.error("❌ src/App.jsx not found");
  process.exit(1);
}

let app = fs.readFileSync(appFile, "utf8");

if (!app.includes("RouteThemeGuard")) {
  const importLines = app.match(/^import[\s\S]*?;\n/gm);
  const lastImport = importLines ? importLines[importLines.length - 1] : null;

  if (lastImport) {
    const insertAt = app.lastIndexOf(lastImport) + lastImport.length;
    app = app.slice(0, insertAt) + `import RouteThemeGuard from "./components/RouteThemeGuard";\n` + app.slice(insertAt);
  } else {
    app = `import RouteThemeGuard from "./components/RouteThemeGuard";\n` + app;
  }

  app = app.replace(
    /<Routes>/,
    `<RouteThemeGuard />\n      <Routes>`
  );
}

fs.writeFileSync(appFile, app, "utf8");

// Make public pages immune from global dark styles
const cssFile = "src/index.css";
let css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, "utf8") : "";

if (!css.includes("/* Public Pages Theme Isolation START */")) {
  css += `

/* Public Pages Theme Isolation START */
body.public-light-route {
  background: #f8fbff !important;
  color: #020617 !important;
}

body.public-light-route * {
  color-scheme: light;
}

body.public-light-route input,
body.public-light-route textarea,
body.public-light-route select {
  color-scheme: light;
}
/* Public Pages Theme Isolation END */
`;
}

fs.writeFileSync(cssFile, css, "utf8");

console.log("✅ Theme isolated: landing/auth pages stay unaffected.");
