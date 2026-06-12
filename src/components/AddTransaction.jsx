import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';






const AddTransaction = (props) => {
    const [IncShow, setInc] = useState(true);
    const [ExpShow, setExp] = useState(false);

    const [inpMon, setInpMon] = useState("");
    const [inpType, setInpType] = useState("Income");
    const [inpCategory, setInpCategory] = useState("");
    const [inpInfo, setInpInfo] = useState("");
    const [inpDate, setInpDate] = useState("");

    const categories = inpType === "Income"
        ? ["Finance", "Job", "Market", "Gaming"]
        : ["Food", "Movie", "Traveling", "Clothes"];

    function Add_Amount_Data() {
        if (
            inpMon.trim() === "" ||
            inpCategory.trim() === "" ||
            inpInfo.trim() === "" ||
            inpDate.trim() === ""
        ) {
            toast.error("Please fill all fields!");
            return;
        }

        props.addData(
            Date.now(),
            inpMon,
            inpType,
            inpCategory,
            inpInfo,
            inpDate
        );

        toast.success("Transaction Added Successfully!");
        Garbage_Data();
    }

    function Garbage_Data() {
        setInpMon("");
        setInpType("Income");
        setInpCategory("");
        setInpInfo("");
        setInpDate("");

        setInc(true);
        setExp(false);
    }
    return (
        <div className="container">
            <div className="heading">
                <h1>
                    <strong>Add Transaction</strong>
                </h1>

                <input type="date" />

                <span className="img">
                    <img src="" alt="" />
                </span>
            </div>

            {/* Income Form */}

            {IncShow && (
                <div className="Form">
                    <h2>Transaction Details</h2>

                    <h3>
                        Type: <strong className={inpType === "Income" ? "income-text" : "expense-text"}>{inpType}</strong>
                    </h3>
                    <button
                        className="income"
                        onClick={() => {
                            setInc(true);
                            setExp(false);
                            setInpType("Income");
                        }}
                    >
                        💸 Income
                    </button>

                    <button
                        className="expense"
                        onClick={() => {
                            setInc(false);
                            setExp(true);
                            setInpType("Expense");
                        }}
                    >
                        💳 Expense
                    </button>

                    <br />
                    <br />

                    <input
                        type="number"
                        placeholder="₹ 0.00"
                        value={inpMon}
                        onChange={(e) => setInpMon(e.target.value)}
                    />

                    <br />
                    <br />

                    <input
                        type="text"
                        placeholder="Enter description"
                        value={inpInfo}
                        onChange={(e) => setInpInfo(e.target.value)}
                    />

                    <br />
                    <br />

                    <select
                        value={inpCategory}
                        onChange={(e) => setInpCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>

                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <br />
                    <br />

                    <input
                        type="date"
                        value={inpDate}
                        onChange={(e) => setInpDate(e.target.value)}
                    />
                </div>
            )}

            {/* Expense Form */}

            {ExpShow && (
                <div className="Form">
                    <h2>Transaction Details</h2>

                    <h3>
                        Type: <strong className={inpType === "Income" ? "income-text" : "expense-text"}>{inpType}</strong>
                    </h3>
                    <button
                        className="income"
                        onClick={() => {
                            setInc(true);
                            setExp(false);
                            setInpType("Income");
                        }}
                    >
                        💸 Income
                    </button>

                    <button
                        className="expense"
                        onClick={() => {
                            setInc(false);
                            setExp(true);
                            setInpType("Expense");
                        }}
                    >
                        💳 Expense
                    </button>

                    <br />
                    <br />

                    <input
                        type="number"
                        placeholder="₹ 0.00"
                        value={inpMon}
                        onChange={(e) => setInpMon(e.target.value)}
                    />

                    <br />
                    <br />

                    <input
                        type="text"
                        placeholder="Enter description"
                        value={inpInfo}
                        onChange={(e) => setInpInfo(e.target.value)}
                    />

                    <br />
                    <br />

                    <select
                        value={inpCategory}
                        onChange={(e) => setInpCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>

                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <br />
                    <br />

                    <input
                        type="date"
                        value={inpDate}
                        onChange={(e) => setInpDate(e.target.value)}
                    />
                </div>
            )}

            <br />

            <div className="bottom-btns">
                <button onClick={Garbage_Data}>Cancel</button>
                <button onClick={Add_Amount_Data}>Add Transaction</button>
            </div>
        </div>
    );
};

export default AddTransaction;