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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

import '../App.css';



const Reports = ({ ExpData, Tincome, Texpense }) => {
    const netSaving = Tincome - Texpense;

    const savingRate = Tincome
        ? ((netSaving / Tincome) * 100).toFixed(1)
        : 0;

    const categoryTotals = ExpData.reduce((acc, item) => {
        acc[item.category] =
            (acc[item.category] || 0) + Number(item.amount);
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
                cutout: "70%",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div>
            <div className="cardContainer">
                <div className="box">
                    <h3>Total Income</h3>
                    <h2>₹{Tincome}</h2>
                </div>

                <div className="box">
                    <h3>Total Expense</h3>
                    <h2>₹{Texpense}</h2>
                </div>

                <div className="box">
                    <h3>Saving Rate</h3>
                    <h2>{savingRate}%</h2>
                </div>
            </div>

            <div className="reports">
                {/* Box 1 */}
                <div className="reportBox1">
                    <div>
                        <h1>
                            <strong>Spending by Category</strong>
                        </h1>
                        <input type="month" />
                    </div>

                    <Bar
                        data={{
                            labels,
                            datasets: [
                                {
                                    data: values,
                                    backgroundColor: [
                                        "#2563eb",
                                        "#3b82f6",
                                        "#60a5fa",
                                        "#34d399",
                                        "#22c55e",
                                    ],
                                    borderRadius: 5,
                                },
                            ],
                        }}
                        options={{
                            indexAxis: "y",
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                        }}
                    />
                </div>

                {/* Box 2 */}
                <div className="reportBox2">
                    <div>
                        <h1>
                            <strong>Income vs Expense</strong>
                        </h1>
                        <input type="month" />
                    </div>

                    <div className="doughnutWrapper">
                        <Doughnut data={data} options={options} />

                        <div className="centerText">
                            <h2>₹{netSaving.toLocaleString()}</h2>
                            <p>Net Savings</p>
                        </div>
                    </div>

                    <div className="incomeExpenseInfo">
                        <div>
                            <h4>Income</h4>
                            <p>₹{Tincome.toLocaleString()}</p>
                        </div>

                        <div>
                            <h4>Expenses</h4>
                            <p>₹{Texpense.toLocaleString()}</p>
                        </div>
                    </div>

                    <div>
                        <p>Income: ₹{Tincome.toLocaleString()}</p>
                        <p>Expenses: ₹{Texpense.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;