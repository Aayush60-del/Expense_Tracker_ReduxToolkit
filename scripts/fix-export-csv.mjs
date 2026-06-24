import fs from "fs";

const file = "src/components/Transactions.jsx";

if (!fs.existsSync(file)) {
  console.error("❌ src/components/Transactions.jsx not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

if (!code.includes("const handleExportCSV = () => {")) {
  code = code.replace(
`  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });`,
`  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const escapeCsvCell = (value) => {
    const safeValue = value === null || value === undefined ? "" : String(value);
    return \`"\${safeValue.replace(/"/g, '""')}"\`;
  };

  const formatCsvDate = (value) => {
    const date = new Date(value || Date.now());
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN");
  };

  const handleExportCSV = () => {
    if (!displayData.length) {
      toast.info("No transactions available to export");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount", "Notes"];

    const rows = displayData.map((item) => [
      formatCsvDate(item?.date),
      item?.description || "",
      item?.category?.name || item?.category || "",
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
    const fileName = \`expense-transactions-\${typeFilter.toLowerCase()}-\${today}.csv\`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  };`
  );
}

code = code.replace(
`              <Button variant="outline" className="w-full sm:w-auto">
                <FileDown className="w-4 h-4 mr-2" />
                Export CSV
              </Button>`,
`              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleExportCSV}
                disabled={displayData.length === 0}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export CSV
              </Button>`
);

fs.writeFileSync(file, code, "utf8");

console.log("✅ Export CSV button is now functional on Transactions page.");
