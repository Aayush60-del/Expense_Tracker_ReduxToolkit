
import { useEffect } from "react";
import { applyStoredTheme, subscribeToSystemTheme } from "../lib/theme";

const ThemeBootstrap = () => {
  useEffect(() => {
    applyStoredTheme();
    subscribeToSystemTheme();
  }, []);

  return null;
};

export default ThemeBootstrap;
