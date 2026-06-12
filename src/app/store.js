import { configureStore } from "@reduxjs/toolkit";
import ExpenseReducer from "../features/ExpenseTrack/ExpenseSlice";

import {
  persistReducer,
  persistStore
} from "redux-persist";


// custom storage
const storage = {
  getItem: (key) => {
    const value = localStorage.getItem(key);
    return Promise.resolve(value);
  },

  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};



const persistConfig = {
  key: "expense",
  storage,
};



const persistedReducer = persistReducer(
  persistConfig,
  ExpenseReducer
);



const store = configureStore({

  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

});



const persistor = persistStore(store);


export { store, persistor };

export default store;