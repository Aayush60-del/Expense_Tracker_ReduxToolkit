import fs from "fs";

const file = "src/components/Transactions.jsx";

if (!fs.existsSync(file)) {
  console.error("❌ src/components/Transactions.jsx not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

// Remove old broken handler if duplicate exists
code = code.replace(/\n\s*const escapeCsvCell[\s\S]*?toast\.success\("CSV exported successfully"\);\s*};/g, "");

// Add CSV handler after currentMonth line
if (!code.includes("const handleExportCSV = () => {")) {
  code = code.replace(
    /const currentMonth = new Date\(\)\.toLocaleDateString\([^;]+;\s*/,
    (match) => `${match}

  const escapeCsvCell = (value) => {
    const safeValue = value === null || value === undefined ? "" : String(value);
    return \`"\${safeValue.replace(/"/g, '""')}"\`;
  };

  const formatCsvDate = (value) => {
    const date = new Date(value || Date.now());
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-IN");
  };

  const getCategoryName = (category) => {
    if (!category) return "";
    if (typeof category === "string") return category;
    return category.name || category.title || "";
  };

  const handleExportCSV = () => {
    if (!displayData || displayData.length === 0) {
      toast.info("No transactions available to export");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount", "Notes"];

    const rows = displayData.map((item) => [
      formatCsvDate(item?.date),
      item?.description || "",
      getCategoryName(item?.category),
      item?.type || "",
      Number(item?.amount || 0),
      item?.notes || "",
    ]);

    const csvContent = [
      headers.map(escapeCsvCell).join(","),
      ...rows.map((row) => row.map(escapeCsvCell).join(",")),
    ].join("\\n");

    const blob = new Blob(["\\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const today = new Date().toISOString().slice(0, 10);
    const filterName = String(typeFilter || "all").toLowerCase();
    const fileName = \`expense-transactions-\${filterName}-\${today}.csv\`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  };
`
  );
}

// Replace Export CSV button with functional button
const buttonRegex = /<Button\s+variant="outline"\s+className="w-full sm:w-auto"\s*>\s*<FileDown className="w-4 h-4 mr-2" \/>\s*Export CSV\s*<\/Button>/;

const newButton = `<Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleExportCSV}
                disabled={!displayData || displayData.length === 0}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export CSV
              </Button>`;

if (buttonRegex.test(code)) {
  code = code.replace(buttonRegex, newButton);
} else if (!code.includes("onClick={handleExportCSV}")) {
  console.error("❌ Export CSV button pattern not found. Send me Transactions.jsx output.");
  process.exit(1);
}

fs.writeFileSync(file, code, "utf8");

console.log("✅ Export CSV button connected successfully.");
