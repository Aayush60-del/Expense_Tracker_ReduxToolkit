import { useNavigate } from "react-router-dom";
import '../App.css';


const SideNav = () => {

  const navigate = useNavigate();

  return (
    <div className="sideNav">

      <div className="logo">
        <img src="" alt="logo" />

        <h1>
          <strong>Expense Tracker</strong>
        </h1>
      </div>


      <ul>

        <li>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Dashboard
          </button>
        </li>


        <li>
          <button
            onClick={() => {
              navigate("/transactions");
            }}
          >
            Transactions
          </button>
        </li>


        <li>
          <button
            onClick={() => {
              navigate("/addtransaction");
            }}
          >
            Add Transaction
          </button>
        </li>


        <li>
          <button
            onClick={() => {
              navigate("/categories");
            }}
          >
            Categories
          </button>
        </li>


        <li>
          <button
            onClick={() => {
              navigate("/report");
            }}
          >
            Reports
          </button>
        </li>


        <li>
          <button
            onClick={() => {
              navigate("/settings");
            }}
          >
            Settings
          </button>
        </li>


      </ul>

    </div>
  );
};

export default SideNav;