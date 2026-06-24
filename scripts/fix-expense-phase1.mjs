import fs from "fs";
import path from "path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, data) => fs.writeFileSync(path.join(root, p), data, "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));

function walk(dir, exts, out = []) {
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (["node_modules", ".git", "dist"].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name).replace(/\\/g, "/");
    if (entry.isDirectory()) walk(rel, exts, out);
    else if (exts.includes(path.extname(entry.name))) out.push(rel);
  }
  return out;
}

function replaceInFile(file, from, to) {
  if (!exists(file)) return false;
  const oldText = read(file);
  const newText = oldText.split(from).join(to);
  if (newText !== oldText) write(file, newText);
  return newText !== oldText;
}

function upsertImport(text, importLine) {
  if (text.includes(importLine)) return text;
  const lines = text.split("\n");
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) lastImport = i;
  }
  lines.splice(lastImport + 1, 0, importLine);
  return lines.join("\n");
}

function upsertLineAfter(text, marker, line) {
  if (text.includes(line)) return text;
  const idx = text.indexOf(marker);
  if (idx === -1) return text;
  const end = text.indexOf("\n", idx);
  return text.slice(0, end + 1) + line + "\n" + text.slice(end + 1);
}

for (const file of walk("src", [".js", ".jsx", ".mjs"]).concat(walk("server", [".js", ".jsx", ".mjs"]))) {
  replaceInFile(file, "\\`", "`");
}

if (exists("server/package.json")) {
  const pkg = JSON.parse(read("server/package.json"));
  pkg.main = "server.js";
  pkg.scripts = {
    ...(pkg.scripts || {}),
    dev: "node --watch server.js",
    start: "node server.js",
  };
  write("server/package.json", JSON.stringify(pkg, null, 2) + "\n");
}

if (exists("server/models/User.js")) {
  let text = read("server/models/User.js");
  text = text.replace(
`userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});`,
`userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});`
  );
  write("server/models/User.js", text);
}

if (exists("server/services/emailService.js")) {
  let text = read("server/services/emailService.js");
  text = text.replace(
    "const sendEmail = async (to, subject, html) => {",
    "export const sendEmail = async (to, subject, html) => {"
  );
  write("server/services/emailService.js", text);
}

if (exists("server/server.js")) {
  let text = read("server/server.js");

  text = upsertImport(text, `import settingsRoutes from "./routes/settingsRoutes.js";`);
  text = upsertImport(text, `import { initCronJobs } from "./services/cronJobs.js";`);
  text = upsertImport(text, `import path from "path";`);
  text = upsertImport(text, `import { fileURLToPath } from "url";`);

  text = text.replace(
`const app = express();
const PORT = process.env.PORT || 5002;`,
`const app = express();
const PORT = process.env.PORT || 5002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);`
  );

  text = text.replace(
`// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));`,
`// Middleware
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));`
  );

  text = upsertLineAfter(text, `app.use("/api/categories", categoryRoutes);`, `app.use("/api/settings", settingsRoutes);`);

  text = text.replace(
`// Error handler
app.use(errorHandler);`,
`// Scheduled jobs
initCronJobs();

// Error handler
app.use(errorHandler);`
  );

  write("server/server.js", text);
}

if (exists("server/routes/transactionRoutes.js")) {
  let text = read("server/routes/transactionRoutes.js");

  text = text.replace(
    `body("amount").isNumeric().withMessage("Amount must be a number"),`,
    `body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),`
  );

  text = text.replace(
    `body("amount").optional().isNumeric().withMessage("Amount must be a number"),`,
    `body("amount").optional().isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),`
  );

  write("server/routes/transactionRoutes.js", text);
}

if (exists("server/controllers/transactionController.js")) {
  let text = read("server/controllers/transactionController.js");

  text = text.replace(
`  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );`,
`  const allowedUpdates = ["amount", "type", "category", "description", "notes", "date"];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (updates.amount !== undefined) updates.amount = Number(updates.amount);

  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );`
  );

  write("server/controllers/transactionController.js", text);
}

if (exists("src/features/Auth/AuthSlice.js")) {
  let text = read("src/features/Auth/AuthSlice.js");
  text = text.replace(
    'const API_URL = "http://localhost:5002/api/auth/";',
    'const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";\nconst API_URL = `${API_BASE_URL}/auth/`;'
  );
  write("src/features/Auth/AuthSlice.js", text);
}

if (exists("src/features/ExpenseTrack/ExpenseSlice.js")) {
  let text = read("src/features/ExpenseTrack/ExpenseSlice.js");
  text = text.replace(
    'const API_URL = "http://localhost:5002/api/transactions/";',
    'const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";\nconst API_URL = `${API_BASE_URL}/transactions/`;'
  );
  write("src/features/ExpenseTrack/ExpenseSlice.js", text);
}

if (exists("src/features/Category/CategorySlice.js")) {
  let text = read("src/features/Category/CategorySlice.js");
  text = text.replace(
    'const API_URL = "http://localhost:5002/api/categories/";',
    'const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";\nconst API_URL = `${API_BASE_URL}/categories/`;'
  );
  write("src/features/Category/CategorySlice.js", text);
}

if (exists("src/App.jsx")) {
  let text = read("src/App.jsx");

  text = text.replace(
    `import { fetchTransactions } from "./features/ExpenseTrack/ExpenseSlice";`,
    `import { fetchTransactions, fetchStats } from "./features/ExpenseTrack/ExpenseSlice";`
  );

  text = text.replace(
`      dispatch(fetchTransactions());
      dispatch(fetchCategories());`,
`      dispatch(fetchTransactions());
      dispatch(fetchStats());
      dispatch(fetchCategories());`
  );

  write("src/App.jsx", text);
}

if (exists("src/components/SideNav.jsx")) {
  let text = read("src/components/SideNav.jsx");

  text = text.replace(
`                (user?.name?.charAt(0) || "U")`,
`                {user?.name?.charAt(0)?.toUpperCase() || "U"}`
  );

  text = text.replace(
    /const isActive = location\.pathname\.startsWith\(item\.path\);/,
    `const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);`
  );

  write("src/components/SideNav.jsx", text);
}

if (exists("src/components/DashBoard.jsx")) {
  let text = read("src/components/DashBoard.jsx");

  text = text.replace(
`  const totalIncome =
    stats?.totalIncome ??
    IncData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalExpense =
    stats?.totalExpense ??
    ExpData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const balance =
    stats?.balance ??
    (totalIncome - totalExpense);`,
`  const totalIncome =
    stats?.currentMonth?.income ??
    IncData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalExpense =
    stats?.currentMonth?.expense ??
    ExpData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const balance =
    stats?.currentMonth?.balance ??
    (totalIncome - totalExpense);`
  );

  write("src/components/DashBoard.jsx", text);
}

const serverEnvExample = `PORT=5002
NODE_ENV=development
CLIENT_URL=http://localhost:5173,http://localhost:5174
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
OTP_EXPIRY=300000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_gmail_app_password
`;

if (!exists("server/.env.example")) write("server/.env.example", serverEnvExample);

const clientEnvExample = `VITE_API_URL=http://localhost:5002/api
`;

if (!exists(".env.example")) write(".env.example", clientEnvExample);

let gitignore = exists(".gitignore") ? read(".gitignore") : "";

for (const line of ["node_modules/", "server/node_modules/", "dist/", ".env", "server/.env", "*.log"]) {
  if (!gitignore.split(/\r?\n/).includes(line)) {
    gitignore += `${gitignore.endsWith("\n") || !gitignore ? "" : "\n"}${line}\n`;
  }
}

write(".gitignore", gitignore);

console.log("✅ Phase 1 fixes applied. Next: npm install, build, and run backend/frontend.");
