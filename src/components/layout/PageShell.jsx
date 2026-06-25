import { useEffect, useMemo, useState } from "react";
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
      className={`${shellClassName} min-h-dvh overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100`}
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
