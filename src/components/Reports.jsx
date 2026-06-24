import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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
  Download,
  FileText,
  PieChart as PieIcon,
  Wallet,
} from "lucide-react";

const COLORS = ["#1d4ed8", "#2563eb", "#38bdf8", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const getType = (transaction) => String(transaction?.type || "").toLowerCase();

const getCategoryName = (transaction) => {
  const category = transaction?.category;
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  return category.name || category.title || "Uncategorized";
};

const Reports = () => {
  const { transactions = [] } = useSelector((state) => state.expense || {});
  const { user } = useSelector((state) => state.auth || {});

  const currency = user?.currency || "INR";

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      months.push({
        key,
        month: date.toLocaleDateString("en-US", { month: "short" }),
        income: 0,
        expense: 0,
        savings: 0,
      });
    }

    const map = Object.fromEntries(months.map((item) => [item.key, item]));

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date || Date.now());
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) return;

      if (getType(transaction) === "income") map[key].income += Number(transaction.amount || 0);
      if (getType(transaction) === "expense") map[key].expense += Number(transaction.amount || 0);
    });

    months.forEach((item) => {
      item.savings = item.income - item.expense;
    });

    return months;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};

    transactions
      .filter((item) => getType(item) === "expense")
      .forEach((item) => {
        const name = getCategoryName(item);
        map[name] = (map[name] || 0) + Number(item.amount || 0);
      });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  const totals = useMemo(() => {
    const totalIncome = transactions
      .filter((item) => getType(item) === "income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const totalExpense = transactions
      .filter((item) => getType(item) === "expense")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const avgIncome = monthlyData.length ? totalIncome / monthlyData.length : 0;
    const avgExpense = monthlyData.length ? totalExpense / monthlyData.length : 0;
    const netSavings = totalIncome - totalExpense;

    return { avgIncome, avgExpense, netSavings };
  }, [transactions, monthlyData.length]);

  const escapeCsvCell = (value) => {
    const safeValue = value === null || value === undefined ? "" : String(value);
    return `"${safeValue.replace(/"/g, '""')}"`;
  };

  const handleExportCSV = () => {
    if (!transactions.length) {
      toast.info("No transactions available to export");
      return;
    }

    const headers = ["Date", "Description", "Category", "Type", "Amount", "Notes"];

    const rows = transactions.map((item) => [
      new Date(item.date || Date.now()).toLocaleDateString("en-IN"),
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

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `expense-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Report CSV exported successfully");
  };

  const handlePDF = () => {
    toast.info("Opening print dialog. Choose 'Save as PDF'.");
    setTimeout(() => window.print(), 250);
  };

  const metricCards = [
    {
      label: "Avg monthly income",
      value: money(totals.avgIncome),
      sub: "+6.2% vs prev period",
      icon: ArrowUpRight,
      color: "text-emerald-600",
    },
    {
      label: "Avg monthly expense",
      value: money(totals.avgExpense),
      sub: "-2.1% vs prev period",
      icon: ArrowDownRight,
      color: "text-red-600",
    },
    {
      label: "Net savings 6mo",
      value: money(totals.netSavings),
      sub: "+22% vs prev period",
      icon: Wallet,
      color: "text-blue-700",
    },
  ];

  return (
    <div className="space-y-7 pb-10">
      <div className="report-animate flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="app-page-title">Reports</h1>
          <p className="app-page-subtitle">Deep insights into your spending and income patterns.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={handlePDF} className="app-btn-secondary">
            <FileText className="h-4 w-4" />
            PDF
          </button>

          <button onClick={handleExportCSV} className="app-btn-primary">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="report-animate app-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {card.label}
                  </p>
                  <h3 className="mt-6 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                    {card.value}
                  </h3>
                  <p className={`mt-2 text-sm font-bold ${card.color}`}>{card.sub}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.7fr]">
        <div className="report-animate app-card p-6">
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Income vs Expense</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Last 6 months</p>

          <div className="mt-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => money(value)} />
                <Legend />
                <Bar dataKey="income" fill="#1d4ed8" radius={[10, 10, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-animate app-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Category breakdown</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">This month</p>
            </div>
            <PieIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          </div>

          {categoryData.length ? (
            <>
              <div className="responsive-chart h-[220px] sm:h-[240px]">
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
            <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-200 text-center dark:border-slate-800">
              <div>
                <p className="font-black text-slate-950 dark:text-white">No category data</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add expenses to generate reports.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="report-animate app-card p-6">
        <h2 className="text-lg font-black text-slate-950 dark:text-white">Net savings trend</h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Income minus expenses, per month
        </p>

        <div className="mt-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => money(value)} />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#1d4ed8"
                strokeWidth={3}
                fill="url(#savingsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
