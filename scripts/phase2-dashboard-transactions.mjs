import fs from "fs";

const dashboard = `import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import gsap from "gsap";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Eye,
  PieChart as PieIcon,
  Target,
  Wallet,
} from "lucide-react";

const COLORS = ["#1d4ed8", "#2563eb", "#38bdf8", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const getCategoryName = (transaction) => {
  const category = transaction?.category;
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  return category.name || category.title || "Uncategorized";
};

const getType = (transaction) => String(transaction?.type || "").toLowerCase();

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Today";
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const Dashboard = () => {
  const pageRef = useRef(null);
  const { transactions = [], stats = null } = useSelector((state) => state.expense || {});
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current.querySelectorAll(".dash-animate"),
      { opacity: 0, y: 24, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.65,
        stagger: 0.07,
        ease: "power3.out",
      }
    );
  }, [transactions.length]);

  const currency = user?.currency || "INR";

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const incomeTransactions = useMemo(
    () => transactions.filter((item) => getType(item) === "income"),
    [transactions]
  );

  const expenseTransactions = useMemo(
    () => transactions.filter((item) => getType(item) === "expense"),
    [transactions]
  );

  const totalIncome =
    stats?.currentMonth?.income ??
    stats?.totalIncome ??
    incomeTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalExpense =
    stats?.currentMonth?.expense ??
    stats?.totalExpense ??
    expenseTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const balance =
    stats?.currentMonth?.balance ??
    stats?.balance ??
    totalIncome - totalExpense;

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : 0;

  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, "0")}\`;

      months.push({
        key,
        month: date.toLocaleDateString("en-US", { month: "short" }),
        income: 0,
        expense: 0,
      });
    }

    const monthMap = Object.fromEntries(months.map((month) => [month.key, month]));

    transactions.forEach((item) => {
      const date = new Date(item.date || Date.now());
      if (Number.isNaN(date.getTime())) return;

      const key = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, "0")}\`;
      if (!monthMap[key]) return;

      if (getType(item) === "income") monthMap[key].income += Number(item.amount || 0);
      if (getType(item) === "expense") monthMap[key].expense += Number(item.amount || 0);
    });

    return months;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};

    expenseTransactions.forEach((item) => {
      const name = getCategoryName(item);
      map[name] = (map[name] || 0) + Number(item.amount || 0);
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [expenseTransactions]);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  const metricCards = [
    {
      label: "Total Income",
      value: money(totalIncome),
      sub: "+6.2% vs prev period",
      icon: ArrowUpRight,
      iconBg: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
      subColor: "text-emerald-600",
    },
    {
      label: "Total Expense",
      value: money(totalExpense),
      sub: "-2.1% vs prev period",
      icon: ArrowDownRight,
      iconBg: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
      subColor: "text-red-600",
    },
    {
      label: "Balance",
      value: money(balance),
      sub: "Current net cashflow",
      icon: Wallet,
      iconBg: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
      subColor: "text-slate-500 dark:text-slate-400",
    },
    {
      label: "Savings Rate",
      value: \`\${savingsRate}%\`,
      sub: "Income minus expenses",
      icon: Target,
      iconBg: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
      subColor: "text-slate-500 dark:text-slate-400",
    },
  ];

  return (
    <div ref={pageRef} className="space-y-7 pb-10">
      <div className="dash-animate flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="app-page-title">Dashboard</h1>
          <p className="app-page-subtitle">
            Welcome back, {user?.name || "User"}. Here is your financial overview.
          </p>
        </div>

        <Link to="/transactions" className="app-btn-secondary w-fit">
          <Eye className="h-4 w-4" />
          View all
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="dash-animate app-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                  <h3 className="mt-5 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                    {card.value}
                  </h3>
                  <p className={\`mt-2 text-sm font-bold \${card.subColor}\`}>{card.sub}</p>
                </div>

                <div className={\`flex h-11 w-11 items-center justify-center rounded-2xl \${card.iconBg}\`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="dash-animate app-card p-6">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Income vs Expense</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Last 6 months</p>
            </div>
            <BarChart3 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          </div>

          <div className="h-[315px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => money(value)} />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#1d4ed8" fill="url(#incomeFill)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-animate app-card p-6">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Category breakdown</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">This month</p>
            </div>
            <PieIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          </div>

          {categoryData.length ? (
            <>
              <div className="h-[245px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={4}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => money(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-3">
                {categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      {item.name}
                    </div>
                    <p className="font-black text-slate-950 dark:text-white">{money(item.value)}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[315px] items-center justify-center rounded-2xl border border-dashed border-slate-200 text-center dark:border-slate-800">
              <div>
                <p className="font-black text-slate-950 dark:text-white">No expense data yet</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add expenses to see category insights.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dash-animate app-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Recent transactions</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Latest 5 entries</p>
          </div>

          <Link to="/transactions" className="font-black text-blue-700 dark:text-blue-300">
            View all
          </Link>
        </div>

        {recentTransactions.length ? (
          <div>
            {recentTransactions.map((item) => {
              const isIncome = getType(item) === "income";

              return (
                <div
                  key={item._id || item.id}
                  className="flex items-center justify-between border-b border-slate-100 px-6 py-5 last:border-b-0 dark:border-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={\`flex h-11 w-11 items-center justify-center rounded-full \${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                      }\`}
                    >
                      {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    </div>

                    <div>
                      <p className="font-black text-slate-950 dark:text-white">
                        {item.description || "Untitled transaction"}
                      </p>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {getCategoryName(item)} · {formatDate(item.date)}
                      </p>
                    </div>
                  </div>

                  <p className={\`font-black \${isIncome ? "text-emerald-600" : "text-slate-950 dark:text-white"}\`}>
                    {isIncome ? "+" : "-"}
                    {money(item.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="font-black text-slate-950 dark:text-white">No recent transactions</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your latest activity will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
`;

const transactions = `import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
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
  const pageRef = useRef(null);
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
          const key = \`\${date.getFullYear()}-\${String(date.getMonth() + 1).padStart(2, "0")}\`;
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

  useEffect(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current.querySelectorAll(".tx-animate"),
      { opacity: 0, y: 22, filter: "blur(7px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
        stagger: 0.055,
        ease: "power3.out",
      }
    );
  }, [displayData.length, typeFilter, search, month]);

  const escapeCsvCell = (value) => {
    const safeValue = value === null || value === undefined ? "" : String(value);
    return \`"\${safeValue.replace(/"/g, '""')}"\`;
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
    ].join("\\n");

    const blob = new Blob(["\\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const today = new Date().toISOString().slice(0, 10);
    const fileName = \`expense-transactions-\${typeFilter}-\${today}.csv\`;

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
    <div ref={pageRef} className="space-y-7 pb-10">
      <div className="tx-animate flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="app-page-title">Transactions</h1>
          <p className="app-page-subtitle">Browse, filter and export all your activity.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportCSV} className="app-btn-secondary" disabled={!displayData.length}>
            <Download className="h-4 w-4" />
            Export CSV
          </button>

          <Link to="/addtransaction" className="app-btn-primary">
            <Plus className="h-4 w-4" />
            Add
          </Link>
        </div>
      </div>

      <div className="tx-animate app-card p-5">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.85fr_0.65fr]">
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
                className={\`rounded-xl px-4 py-2 text-sm font-black transition \${
                  typeFilter === value
                    ? "bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300"
                    : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }\`}
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
                        className={\`rounded-full px-3 py-1 text-xs font-black \${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                        }\`}
                      >
                        {isIncome ? "income" : "expense"}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-500 dark:text-slate-400">{formatDate(item.date)}</div>

                    <div
                      className={\`text-right font-black \${
                        isIncome ? "text-emerald-600 dark:text-emerald-300" : "text-slate-950 dark:text-white"
                      }\`}
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
                          className={\`flex h-11 w-11 shrink-0 items-center justify-center rounded-full \${
                            isIncome
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                              : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                          }\`}
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

                      <p className={\`font-black \${isIncome ? "text-emerald-600" : "text-slate-950 dark:text-white"}\`}>
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
`;

fs.writeFileSync("src/components/DashBoard.jsx", dashboard, "utf8");
fs.writeFileSync("src/components/Transactions.jsx", transactions, "utf8");

// route/link compatibility
const files = [
  "src/components/layout/TopBar.jsx",
  "src/components/SideNav.jsx",
  "src/App.jsx",
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, "utf8");
  code = code.replaceAll("/add-transaction", "/addtransaction");
  code = code.replaceAll("/reports", "/report");
  fs.writeFileSync(file, code, "utf8");
}

console.log("✅ Phase 2 applied: Dashboard + Transactions premium UI.");
