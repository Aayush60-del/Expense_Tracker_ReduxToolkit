import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const DashBoard = () => {
  const { transactions = [], stats = {} } = useSelector(
    (state) => state.expense || {}
  ); const { user } = useSelector((state) => state.auth);

  const IncData = (transactions || []).filter((t) => t.type === "Income");
  const ExpData = (transactions || []).filter((t) => t.type === "Expense");

  const allData = [...IncData, ...ExpData];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const monthlyMap = {};

  allData.forEach((item) => {
    if (!item.date) return;

    const d = new Date(item.date);
    if (isNaN(d)) return;

    const month = d.getMonth();
    const year = d.getFullYear();

    const key = `${year}-${month}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        month: monthNames[month],
        income: 0,
        expense: 0,
        order: year * 100 + month
      };
    }

    if (item.type === "Income") {
      monthlyMap[key].income += Number(item.amount || 0);
    } else {
      monthlyMap[key].expense += Number(item.amount || 0);
    }
  });

  const data = monthNames.map((month) => ({
    month,
    income: monthlyMap[month]?.income || 0,
    expense: monthlyMap[month]?.expense || 0,
  }))

  const chartData = Object.values(monthlyMap)
    .sort((a, b) => a.order - b.order);

  const totalIncome =
    stats?.totalIncome ??
    IncData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalExpense =
    stats?.totalExpense ??
    ExpData.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const balance =
    stats?.balance ??
    (totalIncome - totalExpense);
  const savingRate = totalIncome ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Group expenses by category for Pie Chart
  const expByCategory = {};
  ExpData.forEach(item => {
    expByCategory[item.category] = (expByCategory[item.category] || 0) + Number(item.amount);
  });

  let pieData = Object.keys(expByCategory).map(key => ({
    name: key,
    value: expByCategory[key]
  }));

  if (pieData.length === 0) {
    pieData = [];
  }

  const DateData = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {user ? `Welcome back, ${user.name}! Here's your financial overview.` : "Welcome! Here's your financial overview."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>This Month</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Income</p>
                  <h3 className="text-2xl font-bold text-slate-900">₹{totalIncome || 0}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded text-xs">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 12.5%
                </span>
                <span className="text-slate-400 ml-2 text-xs">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Expenses</p>
                  <h3 className="text-2xl font-bold text-slate-900">₹{totalExpense || 0}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-red-600 font-medium bg-red-50 px-1.5 py-0.5 rounded text-xs">
                  <ArrowDownRight className="w-3 h-3 mr-1" /> 8.2%
                </span>
                <span className="text-slate-400 ml-2 text-xs">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Balance</p>
                  <h3 className="text-2xl font-bold text-slate-900">₹{balance || 0}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded text-xs">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 15.3%
                </span>
                <span className="text-slate-400 ml-2 text-xs">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Savings Rate</p>
                  <h3 className="text-2xl font-bold text-slate-900">{savingRate || 0}%</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded text-xs">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 5.2%
                </span>
                <span className="text-slate-400 ml-2 text-xs">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CHARTS AND LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PIE CHART */}
        <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
          <Card className="h-full border-0 shadow-sm ring-1 ring-slate-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800">Expense Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${value}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="text-xl font-bold text-slate-900">₹{totalExpense || 0}</span>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {pieData.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-900 font-semibold">₹{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* LINE CHART */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
          <Card className="h-full border-0 shadow-sm ring-1 ring-slate-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
        <Card className="border-0 shadow-sm ring-1 ring-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-bold text-slate-800">Recent Transactions</CardTitle>
            <Link to="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
          </CardHeader>
          <div className="divide-y divide-slate-100">
            {DateData.length > 0 ? DateData.slice(0, 5).map((item) => (
              <div key={item.id || item._id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.type === 'Income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.description || item.category}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${item.type === 'Income' ? 'text-green-600' : 'text-slate-900'}`}>
                    {item.type === 'Income' ? '+' : '-'}₹{item.amount}
                  </p>
                  <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500">
                No recent transactions.
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashBoard;