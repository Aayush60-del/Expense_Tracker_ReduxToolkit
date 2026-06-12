import { createSlice } from "@reduxjs/toolkit";


const ExpenseSlice = createSlice({

  name: "expense",

  initialState: {
    IncomeData: [],
    ExpenseData: [],
  },


  reducers: {


    addTransaction: (state, action) => {


      if (action.payload.type === "Income") {
        state.IncomeData.push(action.payload);
      }
      else {
        state.ExpenseData.push(action.payload);
      }


    },



    deleteTransaction: (state, action) => {


      if (action.payload.type === "Income") {

        state.IncomeData =
          state.IncomeData.filter(
            (data) =>
              data.id !== action.payload.id
          );


      }
      else {

        state.ExpenseData =
          state.ExpenseData.filter(
            (data) =>
              data.id !== action.payload.id
          );

      }


    },


  },


});


export const {
  addTransaction,
  deleteTransaction

} = ExpenseSlice.actions;


export default ExpenseSlice.reducer;