import '../App.css';


const Transactions = ({ IncData, ExpData }) => {
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
    <div className="transactionsPage">

      {/* Header */}
      <div className="transactionsHeader">
        <div>
          <h1>
            <strong>Transactions</strong>
          </h1>
          <p>All your income and expenses in one place</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <input type="month" />

          <img
            src="https://via.placeholder.com/40"
            alt="user"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filterBar">
        <button>All Transactions</button>

        <input
          type="search"
          placeholder="Search Transactions..."
        />

        <input type="month" />
      </div>

      {/* Table */}
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {DateData.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>

                <td>{item.description}</td>

                <td>{item.category}</td>

                <td
                  className={
                    item.type.toLowerCase() === "income"
                      ? "income"
                      : "expense"
                  }
                >
                  {item.type}
                </td>

                <td
                  className={
                    item.type.toLowerCase() === "income"
                      ? "incomeAmount"
                      : "expenseAmount"
                  }
                >
                  {item.type.toLowerCase() === "income"
                    ? "+"
                    : "-"}
                  ₹{Number(item.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Transactions;