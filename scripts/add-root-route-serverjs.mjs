import fs from "fs";

const file = "server/server.js";
let code = fs.readFileSync(file, "utf8");

if (!code.includes('message: "ExpenseTracker API is running"')) {
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

  const listenIndex = code.search(/app\.listen\s*\(/);

  if (listenIndex === -1) {
    console.error("app.listen not found");
    process.exit(1);
  }

  code = code.slice(0, listenIndex) + routeCode + "\n" + code.slice(listenIndex);
  fs.writeFileSync(file, code, "utf8");
  console.log("✅ Added root + health route to server/server.js");
} else {
  console.log("✅ Root route already exists");
}
