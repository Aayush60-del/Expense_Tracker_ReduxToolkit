
import './App.css';
import { useSelector, useDispatch } from "react-redux";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { useState } from 'react';
import { useMemo } from "react";

import AddTransaction from "./components/AddTransaction";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import DashBoard from "./components/DashBoard";
import Transactions from "./components/Transactions";
import SideNav from "./components/SideNav";
import { addTransaction } from "./features/ExpenseTrack/ExpenseSlice";
import { ToastContainer } from "react-toastify";


function Layout() {
  return (
    <>
      <SideNav />
      <div className="mainContent">
        <Outlet />
      </div>
    </>
  );
}

function App() {

  const IncData = useSelector(
    (state) => state.IncomeData || []
  );


  const ExpData = useSelector(
    (state) => state.ExpenseData || []
  );

  const dispatch = useDispatch();

  function addData(id, amount, type, category, info, date) {

    dispatch(addTransaction({
      id: Date.now(),
      amount: Number(amount),
      type: type,
      category: category,
      description: info,
      date: date
    }));

  }
  // function deleteData(id, type) {
  //   dispatch(deleteTransaction({
  //     id,
  //     type
  //   }))
  // }
  const Tincome = IncData.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );


  const Texpense = ExpData.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const [theme, setTheme] = useState("true");

  const router = useMemo(() => createBrowserRouter([
    {
      element: <Layout />,

      children: [

        {
          path: "/",
          element:
            <DashBoard
              ExpData={ExpData}
              IncData={IncData}
              Tincome={Tincome}
              Texpense={Texpense}
              theme={theme}
            />
        },


        {
          path: "/report",
          element:
            <Reports
              ExpData={ExpData}
              Tincome={Tincome}
              Texpense={Texpense}
              theme={theme}
            />
        },


        {
          path: "/settings",
          element:
            <Settings
              setTheme={setTheme}
            />
        },


        {
          path: "/transactions",
          element:
            <Transactions
              ExpData={ExpData}
              IncData={IncData}
              theme={theme}
            />
        },


        {
          path: "/addtransaction",
          element:
            <AddTransaction
              addData={addData}
              theme={theme}
            />
        }

      ]
    }

  ]));

  return (
    <>

      <RouterProvider router={router} />
      <ToastContainer/>
    </>
  )
}

export default App
