import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ExpenseReducer from "../features/ExpenseTrack/ExpenseSlice";
import AuthReducer from "../features/Auth/AuthSlice";
import CategoryReducer from "../features/Category/CategorySlice";
import SettingsReducer from "../features/Settings/SettingsSlice";

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
  key: "expense-root",
  storage,
  whitelist: ['expense', 'category'] // we persist expense and category for guest mode
};

const rootReducer = combineReducers({
  expense: ExpenseReducer,
  auth: AuthReducer,
  category: CategoryReducer,
  settings: SettingsReducer,
});

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
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