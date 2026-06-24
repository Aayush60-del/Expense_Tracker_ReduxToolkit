import fs from "fs";

const candidates = ["server/index.js", "server/server.js", "server/src/app.js"];

for (const file of candidates) {
  if (!fs.existsSync(file)) continue;

  let code = fs.readFileSync(file, "utf8");

  if (code.includes("ExpenseTracker API is running")) {
    console.log(`✅ ${file} already has root route`);
    continue;
  }

  const routeCode = `
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExpenseTracker API is running",
    health: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server healthy",
    timestamp: new Date().toISOString(),
  });
});
`;

  const patterns = [
    "app.use(express.json());",
    "app.use(cors(corsOptions));",
    "app.use(cors());",
  ];

  let inserted = false;

  for (const pattern of patterns) {
    if (code.includes(pattern)) {
      code = code.replace(pattern, `${pattern}\n${routeCode}`);
      inserted = true;
      break;
    }
  }

  if (!inserted && code.includes("const app = express();")) {
    code = code.replace("const app = express();", `const app = express();\n${routeCode}`);
    inserted = true;
  }

  if (inserted) {
    fs.writeFileSync(file, code, "utf8");
    console.log(`✅ Added root/health route in ${file}`);
  }
}
