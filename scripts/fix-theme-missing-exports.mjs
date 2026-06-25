import fs from "fs";

const file = "src/lib/theme.js";

if (!fs.existsSync(file)) {
  console.error("❌ src/lib/theme.js not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

if (!code.includes("export const applyStoredTheme")) {
  code += `

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
`;
}

fs.writeFileSync(file, code, "utf8");

console.log("✅ Missing theme exports restored without global dark mode.");
