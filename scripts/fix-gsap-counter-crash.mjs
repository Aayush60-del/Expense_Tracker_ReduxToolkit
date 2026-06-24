import fs from "fs";

const file = "src/hooks/useAdvancedLandingGSAP.js";

if (!fs.existsSync(file)) {
  console.error("❌ src/hooks/useAdvancedLandingGSAP.js not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

const start = code.indexOf("const animateCounter = (el) => {");
const end = code.indexOf("\n\nexport const useAdvancedLandingGSAP", start);

if (start === -1 || end === -1) {
  console.error("❌ animateCounter function not found");
  process.exit(1);
}

const fixedCounter = `const animateCounter = (el) => {
  if (!el || el.dataset.countAnimated === "true") return;

  const raw = el.textContent.trim();
  const numeric = Number(raw.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(numeric)) return;

  const prefix = raw.startsWith("$") ? "$" : raw.startsWith("₹") ? "₹" : "";
  const suffix = raw.includes("+")
    ? "+"
    : raw.includes("%")
      ? "%"
      : raw.endsWith("s")
        ? "s"
        : "";

  const hasDecimal = raw.includes(".");
  const counter = { value: 0 };

  el.dataset.countAnimated = "true";

  gsap.to(counter, {
    value: numeric,
    duration: 1.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 88%",
      once: true,
    },
    onUpdate() {
      const formatted = hasDecimal
        ? counter.value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : Math.round(counter.value).toLocaleString("en-IN");

      el.textContent = \`\${prefix}\${formatted}\${suffix}\`;
    },
  });
};`;

code = code.slice(0, start) + fixedCounter + code.slice(end);

fs.writeFileSync(file, code, "utf8");

console.log("✅ GSAP counter crash fixed.");
