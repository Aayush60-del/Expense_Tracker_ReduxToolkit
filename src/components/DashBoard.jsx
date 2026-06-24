import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
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
  const { transactions = [], stats = null } = useSelector((state) => state.expense || {});
  const { user } = useSelector((state) => state.auth || {});

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
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

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

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
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
      value: `${savingsRate}%`,
      sub: "Income minus expenses",
      icon: Target,
      iconBg: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
      subColor: "text-slate-500 dark:text-slate-400",
    },
  ];

  return (
    <div className="space-y-7 pb-10">
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                  <p className={`mt-2 text-sm font-bold ${card.subColor}`}>{card.sub}</p>
                </div>

                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="dash-animate app-card p-6">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Income vs Expense</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Last 6 months</p>
            </div>
            <BarChart3 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          </div>

          <div className="responsive-chart h-[280px] sm:h-[315px]">
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
              <div className="responsive-chart h-[220px] sm:h-[245px]">
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
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
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
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {getCategoryName(item)} · {formatDate(item.date)}
                      </p>
                    </div>
                  </div>

                  <p className={`font-black ${isIncome ? "text-emerald-600" : "text-slate-950 dark:text-white"}`}>
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
