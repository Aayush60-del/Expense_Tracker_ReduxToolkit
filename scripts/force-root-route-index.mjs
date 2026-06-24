import fs from "fs";

const file = "server/index.js";

if (!fs.existsSync(file)) {
  console.error("❌ server/index.js not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

if (code.includes('message: "ExpenseTracker API is running"')) {
  console.log("✅ Root route already exists in server/index.js");
  process.exit(0);
}

const routeCode = `
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExpenseTracker API is running",
    health: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server healthy",
    timestamp: new Date().toISOString()
  });
});
`;

// Insert before app.listen, so routes are definitely registered
const listenIndex = code.search(/app\.listen\s*\(/);

if (listenIndex === -1) {
  console.error("❌ app.listen not found in server/index.js");
  process.exit(1);
}

code = code.slice(0, listenIndex) + routeCode + "\n" + code.slice(listenIndex);

fs.writeFileSync(file, code, "utf8");

console.log("✅ Root and health routes added to server/index.js");
