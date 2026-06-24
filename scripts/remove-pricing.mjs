import fs from "fs";

const file = "src/pages/LandingPage.jsx";

if (!fs.existsSync(file)) {
  console.error("❌ LandingPage.jsx not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

// Remove Pricing nav button
code = code.replace(
  /\s*<button onClick=\{\(\) => scrollToSection\('pricing'\)\} className="hover:text-blue-600 transition-colors">Pricing<\/button>/g,
  ""
);

// Remove full Pricing section
const start = code.indexOf("      {/* Pricing Section */}");
const end = code.indexOf("      {/* FAQ Section */}", start);

if (start !== -1 && end !== -1) {
  code = code.slice(0, start) + code.slice(end);
}

// Remove footer Pricing link
code = code.replace(
  /\s*<li><button onClick=\{\(\) => scrollToSection\('pricing'\)\} className="hover:text-white transition-colors">Pricing<\/button><\/li>/g,
  ""
);

// Remove paid plan FAQ
code = code.replace(
  /\s*\{\s*question:\s*"Is there a free trial for paid plans\?",\s*answer:\s*"[^"]*"\s*\},?/s,
  ""
);

// Remove unused CheckCircle2 import
code = code.replace(/\s*CheckCircle2,\n/g, "\n");

fs.writeFileSync(file, code, "utf8");

console.log("✅ Billing/Pricing section removed from LandingPage.jsx");
