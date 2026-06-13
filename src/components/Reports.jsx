import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Download, Calendar as CalendarIcon, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Reports = () => {
    const { transactions = [], stats = null } = useSelector((state) => state.expense); const { user } = useSelector((state) => state.auth);

    const IncData = transactions.filter((t) => t.type === 'Income');
    const ExpData = transactions.filter((t) => t.type === 'Expense');

    const Tincome =
        stats?.totalIncome ?? IncData.reduce((a, c) => a + Number(c.amount), 0);

    const Texpense =
        stats?.totalExpense ?? ExpData.reduce((a, c) => a + Number(c.amount), 0);

    const netSaving = stats?.balance ?? (Tincome - Texpense);
    const savingRate = Tincome
        ? ((netSaving / Tincome) * 100).toFixed(1)
        : 0;

    const displayExpData = ExpData;

    const categoryTotals = displayExpData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const data = {
        datasets: [
            {
                data: [Tincome, Texpense],
                backgroundColor: ["#22c55e", "#ef4444"],
                borderWidth: 0,
                cutout: "75%",
                hoverOffset: 4
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 13 },
                bodyFont: { size: 14, weight: 'bold' },
                displayColors: true,
                cornerRadius: 8,
            }
        },
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Detailed insights into your financial habits.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 text-slate-600 border-slate-200">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </Button>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 font-bold">
                        {user ? (user.name ? user.name.charAt(0).toUpperCase() : "U") : "G"}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Card className="border-0 shadow-sm ring-1 ring-slate-200/50">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Total Income</p>
                                    <h3 className="text-3xl font-bold text-slate-900">₹{Tincome.toLocaleString()}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    <Card className="border-0 shadow-sm ring-1 ring-slate-200/50">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Total Expense</p>
                                    <h3 className="text-3xl font-bold text-slate-900">₹{Texpense.toLocaleString()}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                    <Card className="border-0 shadow-sm ring-1 ring-slate-200/50">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Saving Rate</p>
                                    <h3 className="text-3xl font-bold text-slate-900">{savingRate}%</h3>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                    <Card className="h-full border-0 shadow-sm ring-1 ring-slate-200/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-slate-800">Spending by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4">
                                <Bar
                                    data={{
                                        labels,
                                        datasets: [
                                            {
                                                data: values,
                                                backgroundColor: [
                                                    "#3b82f6",
                                                    "#8b5cf6",
                                                    "#ec4899",
                                                    "#10b981",
                                                    "#f59e0b",
                                                ],
                                                borderRadius: 6,
                                                barThickness: 24,
                                            },
                                        ],
                                    }}
                                    options={{
                                        indexAxis: "y",
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                backgroundColor: '#1e293b',
                                                padding: 10,
                                                cornerRadius: 8,
                                                callbacks: {
                                                    label: (context) => `₹${context.raw}`
                                                }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                grid: {
                                                    color: '#f1f5f9',
                                                    drawBorder: false
                                                },
                                                ticks: { font: { family: "'Inter', sans-serif" } }
                                            },
                                            y: {
                                                grid: { display: false, drawBorder: false },
                                                ticks: { font: { family: "'Inter', sans-serif" }, color: '#64748b' }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Doughnut Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                    <Card className="h-full border-0 shadow-sm ring-1 ring-slate-200/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-slate-800">Income vs Expense</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6">
                            <div className="relative h-[240px] w-[240px]">
                                <Doughnut data={data} options={options} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-sm font-medium text-slate-500">Net Savings</p>
                                    <h2 className="text-2xl font-bold text-slate-900">₹{netSaving.toLocaleString()}</h2>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-8 mt-8 w-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="text-sm text-slate-500">Income</p>
                                        <p className="font-bold text-slate-900">₹{Tincome.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-slate-200"></div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                    <div>
                                        <p className="text-sm text-slate-500">Expense</p>
                                        <p className="font-bold text-slate-900">₹{Texpense.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Reports;