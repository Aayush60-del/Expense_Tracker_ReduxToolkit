import fs from "fs";

const themeFile = "src/lib/theme.js";

const themeCode = `const THEME_KEY = "expense_tracker_theme";

export const normalizeTheme = (theme) => {
  if (["light", "dark", "system"].includes(theme)) return theme;
  return "system";
};

export const getStoredTheme = () => {
  try {
    return normalizeTheme(localStorage.getItem(THEME_KEY) || "system");
  } catch {
    return "system";
  }
};

export const getResolvedTheme = (theme = getStoredTheme()) => {
  const normalized = normalizeTheme(theme);

  if (normalized === "system") {
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  }

  return normalized;
};

export const applyAppTheme = (theme) => {
  const normalized = normalizeTheme(theme);

  try {
    localStorage.setItem(THEME_KEY, normalized);
  } catch {}

  // Important:
  // Do NOT add/remove "dark" on documentElement/html.
  // Theme must affect only internal app shell, not landing/auth pages.
  document.documentElement.classList.remove("dark");

  window.dispatchEvent(
    new CustomEvent("expense-theme-change", {
      detail: {
        theme: normalized,
        resolvedTheme: getResolvedTheme(normalized),
      },
    })
  );

  return normalized;
};
`;

fs.writeFileSync(themeFile, themeCode, "utf8");

const bootstrapFile = "src/components/ThemeBootstrap.jsx";

const bootstrapCode = `import { useEffect } from "react";

const ThemeBootstrap = () => {
  useEffect(() => {
    // Public pages should never inherit global dark mode.
    // Internal pages handle dark mode inside PageShell only.
    document.documentElement.classList.remove("dark");
  }, []);

  return null;
};

export default ThemeBootstrap;
`;

fs.writeFileSync(bootstrapFile, bootstrapCode, "utf8");

const pageShellFile = "src/components/layout/PageShell.jsx";

const pageShellCode = `import { useEffect, useMemo, useState } from "react";
import TopBar from "./TopBar";
import SideNav from "../SideNav";
import MobileBottomNav from "./MobileBottomNav";
import MobileDrawer from "./MobileDrawer";
import { getResolvedTheme, getStoredTheme } from "../../lib/theme";

const PageShell = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeState, setThemeState] = useState(() => ({
    theme: getStoredTheme(),
    resolvedTheme: getResolvedTheme(getStoredTheme()),
  }));

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const syncTheme = () => {
      const theme = getStoredTheme();
      setThemeState({
        theme,
        resolvedTheme: getResolvedTheme(theme),
      });

      document.documentElement.classList.remove("dark");
    };

    const handleThemeChange = (event) => {
      setThemeState({
        theme: event.detail?.theme || getStoredTheme(),
        resolvedTheme: event.detail?.resolvedTheme || getResolvedTheme(getStoredTheme()),
      });

      document.documentElement.classList.remove("dark");
    };

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");

    syncTheme();

    window.addEventListener("expense-theme-change", handleThemeChange);
    media?.addEventListener?.("change", syncTheme);

    return () => {
      window.removeEventListener("expense-theme-change", handleThemeChange);
      media?.removeEventListener?.("change", syncTheme);
    };
  }, []);

  const shellClassName = useMemo(() => {
    return themeState.resolvedTheme === "dark" ? "dark" : "";
  }, [themeState.resolvedTheme]);

  return (
    <div
      data-app-shell
      data-theme={themeState.theme}
      className={\`\${shellClassName} min-h-dvh overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100\`}
    >
      <SideNav />

      <div className="min-w-0 lg:pl-[255px]">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="mx-auto w-full max-w-[1180px] px-3 pb-28 pt-5 sm:px-5 md:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <MobileBottomNav />
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </div>
  );
};

export default PageShell;
`;

fs.writeFileSync(pageShellFile, pageShellCode, "utf8");

const routeGuardFile = "src/components/RouteThemeGuard.jsx";

const routeGuardCode = `import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    // Never allow global html.dark.
    // Public pages stay light. Internal app pages get dark only through PageShell.
    document.documentElement.classList.remove("dark");

    if (isPublicRoute(location.pathname)) {
      document.body.classList.add("public-light-route");
    } else {
      document.body.classList.remove("public-light-route");
    }
  }, [location.pathname]);

  return null;
};

export default RouteThemeGuard;
`;

fs.writeFileSync(routeGuardFile, routeGuardCode, "utf8");

let css = fs.existsSync("src/index.css") ? fs.readFileSync("src/index.css", "utf8") : "";

if (!css.includes("/* Strict Public Theme Lock START */")) {
  css += `

/* Strict Public Theme Lock START */
body.public-light-route {
  background: #f8fbff !important;
  color: #020617 !important;
}

body.public-light-route,
body.public-light-route * {
  color-scheme: light;
}

body.public-light-route input,
body.public-light-route textarea,
body.public-light-route select {
  color-scheme: light;
}

body.public-light-route .dark {
  color-scheme: light;
}
/* Strict Public Theme Lock END */
`;
}

fs.writeFileSync("src/index.css", css, "utf8");

console.log("✅ Theme now affects only internal app pages. Landing/auth stay white.");
