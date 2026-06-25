const THEME_KEY = "expense_tracker_theme";

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


export const applyStoredTheme = () => {
  // Compatibility for main.jsx.
  // Do not apply global html.dark because landing/auth pages must stay light.
  document.documentElement.classList.remove("dark");

  const theme = getStoredTheme();

  window.dispatchEvent(
    new CustomEvent("expense-theme-change", {
      detail: {
        theme,
        resolvedTheme: getResolvedTheme(theme),
      },
    })
  );

  return theme;
};

export const subscribeToSystemTheme = () => {
  // Compatibility for main.jsx.
  // Only notify internal PageShell when system theme changes.
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");

  if (!media) return () => {};

  const handler = () => {
    const theme = getStoredTheme();

    window.dispatchEvent(
      new CustomEvent("expense-theme-change", {
        detail: {
          theme,
          resolvedTheme: getResolvedTheme(theme),
        },
      })
    );

    document.documentElement.classList.remove("dark");
  };

  media.addEventListener?.("change", handler);

  return () => {
    media.removeEventListener?.("change", handler);
  };
};
