import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  deleteTransactionAsync,
  fetchStats,
  fetchTransactions,
} from "../features/ExpenseTrack/ExpenseSlice";

const getCategoryName = (transaction) => {
  const category = transaction?.category;
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  return category.name || category.title || "Uncategorized";
};

const getType = (transaction) => String(transaction?.type || "").toLowerCase();

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions = [], isLoading } = useSelector((state) => state.expense || {});
  const { user } = useSelector((state) => state.auth || {});

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [month, setMonth] = useState("");

  const currency = user?.currency || "INR";

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const displayData = useMemo(() => {
    return [...transactions]
      .filter((item) => {
        const itemType = getType(item);
        if (typeFilter !== "all" && itemType !== typeFilter) return false;

        if (month) {
          const date = new Date(item.date || Date.now());
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (key !== month) return false;
        }

        const query = search.trim().toLowerCase();
        if (!query) return true;

        const haystack = [
          item.description,
          getCategoryName(item),
          item.type,
          item.amount,
          item.notes,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [transactions, search, typeFilter, month]);

  const escapeCsvCell = (value) => {
    const safeValue = value === null || value === undefined ? "" : String(value);
    return `"${safeValue.replace(/"/g, '""')}"`;
  };

  const handleExportCSV = () => {
    if (!displayData.length) {
      toast.info("No transactions available to export");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount", "Notes"];

    const rows = displayData.map((item) => [
      formatDate(item.date),
      item.description || "",
      getCategoryName(item),
      item.type || "",
      Number(item.amount || 0),
      item.notes || "",
    ]);

    const csvContent = [
      headers.map(escapeCsvCell).join(","),
      ...rows.map((row) => row.map(escapeCsvCell).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const today = new Date().toISOString().slice(0, 10);
    const fileName = `expense-transactions-${typeFilter}-${today}.csv`;

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

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm("Delete this transaction?");
    if (!confirmed) return;

    try {
      await dispatch(deleteTransactionAsync(id)).unwrap();
      dispatch(fetchTransactions());
      dispatch(fetchStats());
      toast.success("Transaction deleted");
    } catch (error) {
      toast.error(error || "Failed to delete transaction");
    }
  };

  const currentMonthLabel = month
    ? new Date(month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "All months";

  return (
    <div className="space-y-7 pb-10">
      <div className="tx-animate flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="app-page-title">Transactions</h1>
          <p className="app-page-subtitle">Browse, filter and export all your activity.</p>
        </div>

        <div className="flex w-full flex-wrap gap-3 sm:w-auto">
          <button onClick={handleExportCSV} className="app-btn-secondary flex-1 sm:flex-none" disabled={!displayData.length}>
            <Download className="h-4 w-4" />
            Export CSV
          </button>

          <Link to="/addtransaction" className="app-btn-primary flex-1 sm:flex-none">
            <Plus className="h-4 w-4" />
            Add
          </Link>
        </div>
      </div>

      <div className="tx-animate app-card p-5">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.2fr_0.85fr_0.65fr]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or category"
              className="app-input pl-12"
            />
          </div>

          <div className="grid grid-cols-3 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            {[
              ["all", "All"],
              ["income", "Income"],
              ["expense", "Expense"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                  typeFilter === value
                    ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300"
                    : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="app-input"
            title={currentMonthLabel}
          />
        </div>
      </div>

      <div className="tx-animate app-card overflow-hidden">
        <div className="hidden grid-cols-[1.5fr_1fr_0.7fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 lg:grid">
          <div>Description</div>
          <div>Category</div>
          <div>Type</div>
          <div>Date</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="px-6 py-16 text-center font-bold text-slate-500 dark:text-slate-400">
            Loading transactions...
          </div>
        ) : displayData.length ? (
          <div>
            {displayData.map((item) => {
              const isIncome = getType(item) === "income";
              const id = item._id || item.id;

              return (
                <div
                  key={id}
                  className="tx-animate border-b border-slate-100 px-6 py-5 last:border-b-0 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  <div className="hidden grid-cols-[1.5fr_1fr_0.7fr_0.8fr_0.8fr_0.7fr] items-center gap-4 lg:grid">
                    <div>
                      <p className="font-black text-slate-950 dark:text-white">
                        {item.description || "Untitled transaction"}
                      </p>
                      {item.notes ? (
                        <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{item.notes}</p>
                      ) : null}
                    </div>

                    <div className="font-semibold text-slate-600 dark:text-slate-300">{getCategoryName(item)}</div>

                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                        }`}
                      >
                        {isIncome ? "income" : "expense"}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-500 dark:text-slate-400">{formatDate(item.date)}</div>

                    <div
                      className={`text-right font-black ${
                        isIncome ? "text-emerald-600 dark:text-emerald-300" : "text-slate-950 dark:text-white"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {money(item.amount)}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
                        title="Edit transaction"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-300"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:hidden">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                              : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                        </div>

                        <div>
                          <p className="font-black text-slate-950 dark:text-white">
                            {item.description || "Untitled transaction"}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                            {getCategoryName(item)} · {formatDate(item.date)}
                          </p>
                        </div>
                      </div>

                      <p className={`font-black ${isIncome ? "text-emerald-600" : "text-slate-950 dark:text-white"}`}>
                        {isIncome ? "+" : "-"}
                        {money(item.amount)}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button className="app-btn-secondary px-3 py-2">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(id)} className="app-btn-secondary px-3 py-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-20 text-center">
            <p className="text-lg font-black text-slate-950 dark:text-white">No transactions found</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try changing your filters or add a new transaction.
            </p>
            <Link to="/addtransaction" className="app-btn-primary mt-6">
              <Plus className="h-4 w-4" />
              Add transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
