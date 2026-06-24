import fs from "fs";

const file = "src/components/AddTransaction.jsx";

if (!fs.existsSync(file)) {
  console.error("❌ src/components/AddTransaction.jsx not found");
  process.exit(1);
}

let code = fs.readFileSync(file, "utf8");

// Remove unused field icons from lucide import
code = code.replace(/,\s*CalendarDays/g, "");
code = code.replace(/,\s*FileText/g, "");
code = code.replace(/,\s*IndianRupee/g, "");
code = code.replace(/,\s*Tag/g, "");

// Amount field: remove absolute rupee icon wrapper
code = code.replace(
`                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) => updateForm("amount", event.target.value)}
                    placeholder="0.00"
                    className="app-input pl-12 text-lg font-black"
                  />
                </div>`,
`                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  placeholder="0.00"
                  className="app-input text-lg font-black"
                />`
);

// Date field: remove left calendar icon
code = code.replace(
`                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => updateForm("date", event.target.value)}
                    className="app-input pl-12"
                  />
                </div>`,
`                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => updateForm("date", event.target.value)}
                  className="app-input"
                />`
);

// Category field: remove left tag icon and remove emoji from options
code = code.replace(
`                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.category}
                    onChange={(event) => updateForm("category", event.target.value)}
                    className="app-input pl-12"
                  >
                    {filteredCategories.length ? (
                      filteredCategories.map((category) => {
                        const name = getCategoryName(category);

                        return (
                          <option key={category._id || category.id || name} value={name}>
                            {category.icon ? category.icon + " " : ""}
                            {name}
                          </option>
                        );
                      })
                    ) : (
                      <option value={defaultCategoryByType[form.type]}>
                        {defaultCategoryByType[form.type]}
                      </option>
                    )}
                  </select>
                </div>`,
`                <select
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                  className="app-input"
                >
                  {filteredCategories.length ? (
                    filteredCategories.map((category) => {
                      const name = getCategoryName(category);

                      return (
                        <option key={category._id || category.id || name} value={name}>
                          {name}
                        </option>
                      );
                    })
                  ) : (
                    <option value={defaultCategoryByType[form.type]}>
                      {defaultCategoryByType[form.type]}
                    </option>
                  )}
                </select>`
);

// Description field: remove left file icon
code = code.replace(
`                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
                    placeholder={isIncome ? "e.g. Salary credited" : "e.g. Lunch at cafe"}
                    className="app-input pl-12"
                  />
                </div>`,
`                <input
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder={isIncome ? "e.g. Salary credited" : "e.g. Lunch at cafe"}
                  className="app-input"
                />`
);

// Quick category chips: remove emoji prefix
code = code.replaceAll(
`                      {category.icon ? category.icon + " " : ""}
                      {name}`,
`                      {name}`
);

// Also fix any remaining pl-12 on these simple fields if leftover
code = code.replaceAll(`className="app-input pl-12"`, `className="app-input"`);

fs.writeFileSync(file, code, "utf8");

console.log("✅ Add Transaction input icon overlap fixed.");
