import fs from "fs";

const file = "src/index.css";

if (!fs.existsSync(file)) {
  console.error("❌ src/index.css not found");
  process.exit(1);
}

let css = fs.readFileSync(file, "utf8");

const markerStart = "/* ExpenseTracker Global Dark Theme Fix START */";
const markerEnd = "/* ExpenseTracker Global Dark Theme Fix END */";

const darkThemeCss = `
${markerStart}

/* Base */
html.dark,
html.dark body,
html.dark #root {
  background: #020617 !important;
  color: #f8fafc !important;
  color-scheme: dark;
}

/* Main page backgrounds */
html.dark main,
html.dark section,
html.dark .bg-slate-50,
html.dark .bg-gray-50,
html.dark .bg-slate-100,
html.dark .bg-gray-100,
html.dark .bg-slate-50\\/50,
html.dark .bg-slate-50\\/70,
html.dark .bg-white\\/50,
html.dark .bg-white\\/60,
html.dark .bg-white\\/70,
html.dark .bg-white\\/80,
html.dark .bg-white\\/90 {
  background-color: #020617 !important;
}

/* Cards / panels */
html.dark .bg-white,
html.dark .bg-card,
html.dark .shadow-sm,
html.dark .shadow,
html.dark .shadow-md,
html.dark .shadow-lg {
  background-color: #0f172a !important;
  color: #f8fafc !important;
}

/* Deep dashboard cards */
html.dark .bg-slate-900,
html.dark .bg-gray-900,
html.dark .bg-black {
  background-color: #0b1120 !important;
  color: #f8fafc !important;
}

/* Borders and rings */
html.dark .border,
html.dark .border-slate-100,
html.dark .border-slate-200,
html.dark .border-gray-100,
html.dark .border-gray-200,
html.dark .ring-1 {
  border-color: #1e293b !important;
  --tw-ring-color: rgba(51, 65, 85, 0.7) !important;
}

/* Primary text */
html.dark .text-black,
html.dark .text-slate-950,
html.dark .text-slate-900,
html.dark .text-gray-950,
html.dark .text-gray-900 {
  color: #f8fafc !important;
}

/* Secondary text */
html.dark .text-slate-800,
html.dark .text-slate-700,
html.dark .text-gray-800,
html.dark .text-gray-700 {
  color: #e2e8f0 !important;
}

/* Muted text */
html.dark .text-slate-600,
html.dark .text-slate-500,
html.dark .text-gray-600,
html.dark .text-gray-500 {
  color: #94a3b8 !important;
}

/* Inputs, selects, textareas */
html.dark input,
html.dark select,
html.dark textarea {
  background-color: #020617 !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

html.dark input::placeholder,
html.dark textarea::placeholder {
  color: #64748b !important;
}

html.dark input:disabled,
html.dark select:disabled,
html.dark textarea:disabled {
  background-color: #0f172a !important;
  color: #94a3b8 !important;
  opacity: 1 !important;
}

/* Tables / rows / list items */
html.dark table,
html.dark thead,
html.dark tbody,
html.dark tr {
  background-color: transparent !important;
  color: #f8fafc !important;
}

html.dark th,
html.dark td {
  border-color: #1e293b !important;
  color: #e2e8f0 !important;
}

/* Hover states */
html.dark .hover\\:bg-slate-50:hover,
html.dark .hover\\:bg-gray-50:hover,
html.dark .hover\\:bg-slate-100:hover,
html.dark .hover\\:bg-gray-100:hover {
  background-color: #1e293b !important;
}

/* Buttons should stay readable */
html.dark button {
  color: inherit;
}

html.dark .bg-blue-600,
html.dark .hover\\:bg-blue-700:hover {
  color: #ffffff !important;
}

/* Recharts / charts */
html.dark .recharts-text,
html.dark .recharts-cartesian-axis-tick-value,
html.dark .recharts-legend-item-text {
  fill: #cbd5e1 !important;
  color: #cbd5e1 !important;
}

html.dark .recharts-cartesian-grid line {
  stroke: #334155 !important;
}

html.dark .recharts-tooltip-wrapper,
html.dark .recharts-default-tooltip {
  background: #0f172a !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

/* Toast readable in dark */
html.dark .Toastify__toast {
  background: #0f172a !important;
  color: #f8fafc !important;
}

/* Keep blue sidebar premium */
html.dark aside,
html.dark nav.bg-blue-600,
html.dark .bg-blue-600 {
  color: #ffffff;
}

${markerEnd}
`;

const start = css.indexOf(markerStart);
const end = css.indexOf(markerEnd);

if (start !== -1 && end !== -1) {
  css = css.slice(0, start) + darkThemeCss + css.slice(end + markerEnd.length);
} else {
  css += "\n" + darkThemeCss;
}

fs.writeFileSync(file, css, "utf8");

console.log("✅ Global dark theme fixed for dashboard, transactions, categories, reports, and settings.");
