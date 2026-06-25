import { useEffect } from "react";

const ThemeBootstrap = () => {
  useEffect(() => {
    // Public pages should never inherit global dark mode.
    // Internal pages handle dark mode inside PageShell only.
    document.documentElement.classList.remove("dark");
  }, []);

  return null;
};

export default ThemeBootstrap;
