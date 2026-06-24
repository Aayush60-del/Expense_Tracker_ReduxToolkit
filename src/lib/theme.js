
export const THEME_KEY = "expense-theme";

export const normalizeTheme = (theme) => {
  return ["light", "dark", "system"].includes(theme) ? theme : "system";
};

export const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyAppTheme = (theme = "system") => {
  if (typeof window === "undefined") return "system";

  const selectedTheme = normalizeTheme(theme);
  const resolvedTheme = selectedTheme === "system" ? getSystemTheme() : selectedTheme;

  localStorage.setItem(THEME_KEY, selectedTheme);
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.removeAttribute("data-accent");
  document.body.classList.remove("dark");

  return selectedTheme;
};

export const getStoredTheme = () => {
  if (typeof window === "undefined") return "system";
  return normalizeTheme(localStorage.getItem(THEME_KEY) || "system");
};

export const applyStoredTheme = () => {
  return applyAppTheme(getStoredTheme());
};

export const subscribeToSystemTheme = () => {
  if (typeof window === "undefined") return;

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (getStoredTheme() === "system") applyAppTheme("system");
  };

  media.addEventListener?.("change", handler);
};
