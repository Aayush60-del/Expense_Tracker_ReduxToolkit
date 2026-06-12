import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import '../App.css';



const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

const DashBoard = (props) => {
  const IncData = props?.IncData || [];
  const ExpData = props?.ExpData || [];

  const allData = [IncData, ExpData];

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthlyMap = {};

  allData.forEach((arr) => {
    (arr || []).forEach((item) => {
      const d = new Date(item.date);
      const month = monthNames[d.getMonth()];

      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 };
      }

      if (item.type === "Income") {
        monthlyMap[month].income += Number(item.amount);
      } else {
        monthlyMap[month].expense += Number(item.amount);
      }
    });
  });

  const data = monthNames.map((month) => ({
    month,
    income: monthlyMap[month]?.income || 0,
    expense: monthlyMap[month]?.expense || 0,
  }));



  const balance = props.Tincome - props.Texpense;

  const savingRate = props.Tincome ? ((balance / props.Tincome) * 100).toFixed(1) : 0;

  const pieData = [
    { name: "Income", value: props.Tincome },
    { name: "Expense", value: props.Texpense },
  ];

  const DateData = [];

  IncData.forEach((data) => {
    DateData.push({
      id: data.id,
      description: data.description,
      category: data.category,
      type: data.type,
      amount: data.amount,
      date: data.date,
    });
  });

  ExpData.forEach((data) => {
    DateData.push({
      id: data.id,
      description: data.description,
      category: data.category,
      type: data.type,
      amount: data.amount,
      date: data.date,
    });
  });

  DateData.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="dashContainer">

      {/* HEADER */}
      <div className="dash">
        <div>
          <h1><strong>Dashboard</strong></h1>
          <p>Welcome back! Here's your financial overview.</p>
        </div>

        <input type="month" />
        <img src="" alt="user" />
      </div>

      {/* CARDS */}
      <div className="cardContainer">
        <div className="box">
          <h3>Total Income</h3>
          <h2>₹{props.Tincome}</h2>
        </div>

        <div className="box">
          <h3>Total Expense</h3>
          <h2>₹{props.Texpense}</h2>
        </div>

        <div className="box">
          <h3>Balance</h3>
          <h2>₹{balance}</h2>
        </div>

        <div className="box">
          <h3>Saving Rate</h3>
          <h2>{savingRate}%</h2>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="Overview">

        {/* PIE CHART */}
        <div className="box1">
          <div>
            <h1><strong>Expense Overview</strong></h1>
            <input type="month" />
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            {(props.ExpData || []).map((item) => (
              <div key={item.id} className="row">
                <span>{item.category}</span>
                <span>₹{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT */}
        <div className="box2">
          <h1><strong>Recent Transactions</strong></h1>
          <a href="/transactions">View All</a>

          {DateData.slice(0, 5).map((item) => (

            <div key={item.id} className="txn">

              <p>
                {item.description || item.category}
              </p>


              <span
                style={{
                  color:
                    item.type === "Income"
                      ? "green"
                      : "red"
                }}
              >

                {item.type === "Income" ? "+" : "-"}
                ₹{item.amount}

              </span>


            </div>

          ))}
        </div>
      </div>

      {/* LINE CHART */}
      <div className="line">
        <div>
          <h1><strong>Monthly Trend</strong></h1>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line type="monotone" dataKey="income" stroke="green" />
              <Line type="monotone" dataKey="expense" stroke="red" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashBoard;