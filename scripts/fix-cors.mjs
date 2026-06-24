import fs from "fs";

const serverFile = "server/server.js";
const envFile = "server/.env";

if (!fs.existsSync(serverFile)) {
  console.error("❌ server/server.js not found. Run this from project root.");
  process.exit(1);
}

let code = fs.readFileSync(serverFile, "utf8");

const newCorsBlock = `const allowedOrigins = new Set([
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
]);

app.use(
  cors({
    origin(origin, callback) {
      const isLocalDev =
        origin && /^https?:\\/\\/(localhost|127\\.0\\.0\\.1):\\d+$/.test(origin);

      if (!origin || allowedOrigins.has(origin) || isLocalDev) {
        return callback(null, true);
      }

      console.warn("Blocked by CORS:", origin);
      return callback(null, false);
    },
    credentials: true,
  })
);
`;

const corsRegex = /const allowedOrigins =[\s\S]*?app\.use\(\s*cors\(\{[\s\S]*?\}\)\s*\);/;

if (corsRegex.test(code)) {
  code = code.replace(corsRegex, newCorsBlock);
} else if (code.includes("// Middleware")) {
  code = code.replace("// Middleware", `// Middleware\n${newCorsBlock}`);
} else {
  code = code.replace("app.use(express.json());", `${newCorsBlock}\napp.use(express.json());`);
}

fs.writeFileSync(serverFile, code, "utf8");

if (fs.existsSync(envFile)) {
  let env = fs.readFileSync(envFile, "utf8");
  const clientUrlLine = "CLIENT_URL=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175";

  if (/^CLIENT_URL=/m.test(env)) {
    env = env.replace(/^CLIENT_URL=.*/m, clientUrlLine);
  } else {
    env += `\n${clientUrlLine}\n`;
  }

  fs.writeFileSync(envFile, env, "utf8");
}

console.log("✅ CORS fixed for localhost dev ports.");
