import fs from "fs";

function patch(file, fn) {
  if (!fs.existsSync(file)) {
    console.log("skip", file);
    return;
  }

  const oldCode = fs.readFileSync(file, "utf8");
  const newCode = fn(oldCode);

  if (newCode !== oldCode) {
    fs.writeFileSync(file, newCode, "utf8");
    console.log("patched", file);
  }
}

patch("src/components/Settings.jsx", (code) => {
  code = code.replace(
`  const applyTheme = () => {
    localStorage.setItem("expense-theme", "light");
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
  };`,
`  const normalizeTheme = (theme) => {
    const allowed = ["blue", "emerald", "violet", "rose"];
    return allowed.includes(theme) ? theme : "blue";
  };

  const applyTheme = (theme = "blue") => {
    const selectedTheme = normalizeTheme(theme);

    localStorage.setItem("expense-theme", selectedTheme);
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.documentElement.setAttribute("data-accent", selectedTheme);
  };`
  );

  code = code.replaceAll(`theme: "light",`, `theme: localStorage.getItem("expense-theme") || "blue",`);
  code = code.replaceAll(`theme: settings.theme || "light",`, `theme: localStorage.getItem("expense-theme") || settings.theme || "blue",`);

  code = code.replace(
`  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
  ];`,
`  const themeOptions = [
    { id: "blue", label: "Blue", icon: Sun },
    { id: "emerald", label: "Emerald", icon: Monitor },
    { id: "violet", label: "Violet", icon: Moon },
    { id: "rose", label: "Rose", icon: Bell },
  ];`
  );

  code = code.replaceAll(
`setPreferences((prev) => ({ ...prev, theme: "light" }))`,
`setPreferences((prev) => ({ ...prev, theme: item.id }))`
  );

  return code;
});

patch("src/features/Settings/SettingsSlice.js", (code) => {
  return code.replaceAll(`theme: "light",`, `theme: "blue",`);
});

patch("server/models/UserSettings.js", (code) => {
  code = code.replace(
    /enum:\s*\[\s*"light"\s*,\s*"dark"\s*,\s*"system"\s*\]/g,
    `enum: ["blue", "emerald", "violet", "rose"]`
  );

  code = code.replace(/default:\s*"light"/g, `default: "blue"`);

  return code;
});

patch("src/features/Auth/AuthSlice.js", (code) => {
  code = code.replace(
/(export const updateProfile = createAsyncThunk\([\s\S]*?const response = await axios\.[\s\S]*?;\s*)return response\.data;/,
`$1const currentUser = thunkAPI.getState().auth.user;
      const updatedUser = response.data?.user || response.data;
      return {
        ...currentUser,
        ...updatedUser,
        token: updatedUser?.token || currentUser?.token,
      };`
  );

  code = code.replace(
/(export const uploadAvatar = createAsyncThunk\([\s\S]*?const response = await axios\.[\s\S]*?;\s*)return response\.data;/,
`$1const currentUser = thunkAPI.getState().auth.user;
      const updatedUser = response.data?.user || response.data;
      return {
        ...currentUser,
        ...updatedUser,
        token: updatedUser?.token || currentUser?.token,
      };`
  );

  return code;
});

patch("src/index.css", (code) => {
  if (code.includes("/* ExpenseTracker Accent Themes */")) return code;

  return code + `

/* ExpenseTracker Accent Themes */
:root {
  --accent-50: #eff6ff;
  --accent-100: #dbeafe;
  --accent-200: #bfdbfe;
  --accent-500: #3b82f6;
  --accent-600: #2563eb;
  --accent-700: #1d4ed8;
}

:root[data-accent="emerald"] {
  --accent-50: #ecfdf5;
  --accent-100: #d1fae5;
  --accent-200: #a7f3d0;
  --accent-500: #10b981;
  --accent-600: #059669;
  --accent-700: #047857;
}

:root[data-accent="violet"] {
  --accent-50: #f5f3ff;
  --accent-100: #ede9fe;
  --accent-200: #ddd6fe;
  --accent-500: #8b5cf6;
  --accent-600: #7c3aed;
  --accent-700: #6d28d9;
}

:root[data-accent="rose"] {
  --accent-50: #fff1f2;
  --accent-100: #ffe4e6;
  --accent-200: #fecdd3;
  --accent-500: #f43f5e;
  --accent-600: #e11d48;
  --accent-700: #be123c;
}

:root[data-accent] .bg-blue-50 { background-color: var(--accent-50) !important; }
:root[data-accent] .bg-blue-100 { background-color: var(--accent-100) !important; }
:root[data-accent] .bg-blue-600 { background-color: var(--accent-600) !important; }
:root[data-accent] .hover\\:bg-blue-700:hover { background-color: var(--accent-700) !important; }

:root[data-accent] .text-blue-500 { color: var(--accent-500) !important; }
:root[data-accent] .text-blue-600 { color: var(--accent-600) !important; }
:root[data-accent] .text-blue-700 { color: var(--accent-700) !important; }

:root[data-accent] .border-blue-200 { border-color: var(--accent-200) !important; }
:root[data-accent] .border-blue-500 { border-color: var(--accent-500) !important; }
:root[data-accent] .ring-blue-500 { --tw-ring-color: var(--accent-500) !important; }
:root[data-accent] .focus-visible\\:ring-blue-500:focus-visible { --tw-ring-color: var(--accent-500) !important; }
`;
});

console.log("✅ Avatar token preservation + light color themes patched.");
