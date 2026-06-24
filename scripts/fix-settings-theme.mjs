import fs from "fs";

const file = "src/components/Settings.jsx";

if (!fs.existsSync(file)) {
  console.error("❌ src/components/Settings.jsx not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

code = code.replace(
`  const applyTheme = (theme) => {
    localStorage.setItem("expense-theme", theme);

    const shouldUseDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", shouldUseDark);
  };`,
`  const applyTheme = () => {
    localStorage.setItem("expense-theme", "light");
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
  };`
);

code = code.replace(
`  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];`,
`  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
  ];`
);

code = code.replaceAll(
`theme: settings.theme || "light",`,
`theme: "light",`
);

code = code.replaceAll(
`theme: "light",`,
`theme: "light",`
);

code = code.replaceAll(
`setPreferences((prev) => ({ ...prev, theme: item.id }))`,
`setPreferences((prev) => ({ ...prev, theme: "light" }))`
);

code = code.replace(
`                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"`,
`                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 disabled:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"`
);

code = code.replaceAll(
`className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"`,
`className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 disabled:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"`
);

code = code.replace(
`                        className="rounded-xl border-slate-200"
                        disabled={disabled}`,
`                        className="rounded-xl border-slate-200 text-slate-900 disabled:bg-slate-50 disabled:text-slate-600 disabled:opacity-100"
                        disabled={disabled}`
);

fs.writeFileSync(file, code, "utf8");

console.log("✅ Dark mode removed. Settings page locked to clean light SaaS theme.");
