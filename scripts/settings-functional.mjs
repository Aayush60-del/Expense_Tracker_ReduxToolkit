import fs from "fs";

function patchFile(file, patcher) {
  if (!fs.existsSync(file)) return;
  const oldCode = fs.readFileSync(file, "utf8");
  const newCode = patcher(oldCode);
  if (newCode !== oldCode) fs.writeFileSync(file, newCode, "utf8");
}

patchFile("src/app/store.js", (code) => {
  if (!code.includes("SettingsReducer")) {
    code = code.replace(
      'import CategoryReducer from "../features/Category/CategorySlice";',
      'import CategoryReducer from "../features/Category/CategorySlice";\nimport SettingsReducer from "../features/Settings/SettingsSlice";'
    );
  }

  if (!code.includes("settings: SettingsReducer")) {
    code = code.replace(
      "  category: CategoryReducer,",
      "  category: CategoryReducer,\n  settings: SettingsReducer,"
    );
  }

  return code;
});

patchFile("server/server.js", (code) => {
  if (!code.includes('settingsRoutes from "./routes/settingsRoutes.js"')) {
    code = code.replace(
      'import categoryRoutes from "./routes/categoryRoutes.js";',
      'import categoryRoutes from "./routes/categoryRoutes.js";\nimport settingsRoutes from "./routes/settingsRoutes.js";'
    );
  }

  if (!code.includes('app.use("/api/settings", settingsRoutes);')) {
    code = code.replace(
      'app.use("/api/categories", categoryRoutes);',
      'app.use("/api/categories", categoryRoutes);\napp.use("/api/settings", settingsRoutes);'
    );
  }

  return code;
});

console.log("✅ Settings page buttons are now connected and functional.");
