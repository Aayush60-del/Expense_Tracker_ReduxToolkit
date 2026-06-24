import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowDownRight,
  ArrowUpRight,
  Save,
  X,
} from "lucide-react";
import {
  addTransactionAsync,
  fetchStats,
  fetchTransactions,
} from "../features/ExpenseTrack/ExpenseSlice";
import { fetchCategories } from "../features/Category/CategorySlice";

const today = new Date().toISOString().slice(0, 10);

const defaultCategoryByType = {
  Expense: "Food",
  Income: "Salary",
};

const getCategoryName = (category) => {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name || category.title || "";
};

const getCategoryType = (category) => {
  const type = String(category?.type || "Expense").toLowerCase();
  return type === "income" ? "Income" : "Expense";
};

const AddTransaction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories = [] } = useSelector((state) => state.category || {});
  const { isLoading } = useSelector((state) => state.expense || {});
  const { user } = useSelector((state) => state.auth || {});

  const [form, setForm] = useState({
    type: "Expense",
    amount: "",
    date: today,
    category: defaultCategoryByType.Expense,
    description: "",
    notes: "",
  });

  const currency = user?.currency || "INR";

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => getCategoryType(category) === form.type);
  }, [categories, form.type]);

  useEffect(() => {
    const exists = filteredCategories.some(
      (category) => getCategoryName(category) === form.category
    );

    if (!exists) {
      setForm((prev) => ({
        ...prev,
        category: getCategoryName(filteredCategories[0]) || defaultCategoryByType[prev.type],
      }));
    }
  }, [filteredCategories, form.category]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setType = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      category:
        getCategoryName(categories.find((category) => getCategoryType(category) === type)) ||
        defaultCategoryByType[type],
    }));
  };

  const resetForm = () => {
    setForm({
      type: "Expense",
      amount: "",
      date: today,
      category: defaultCategoryByType.Expense,
      description: "",
      notes: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const payload = {
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      description: form.description.trim(),
      notes: form.notes.trim(),
      date: form.date,
    };

    try {
      await dispatch(addTransactionAsync(payload)).unwrap();
      await dispatch(fetchTransactions());
      await dispatch(fetchStats());

      toast.success("Transaction saved successfully");
      resetForm();
      navigate("/transactions");
    } catch (error) {
      toast.error(error || "Failed to save transaction");
    }
  };

  const isIncome = form.type === "Income";
  const previewTitle = form.description.trim() || (isIncome ? "New income" : "New expense");

  return (
    <div className="space-y-7 pb-10">
      <div className="add-animate">
        <h1 className="app-page-title">Add Transaction</h1>
        <p className="app-page-subtitle">Record income or expense in a few seconds.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[1fr_330px]">
        <div className="space-y-6">
          <div className="add-animate app-card p-5 sm:p-6">
            <p className="mb-4 text-sm font-black text-slate-950 dark:text-white">
              Transaction type
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  type: "Expense",
                  title: "Expense",
                  desc: "Money spent",
                  icon: ArrowDownRight,
                  activeClass:
                    "border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-200",
                  iconClass: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
                },
                {
                  type: "Income",
                  title: "Income",
                  desc: "Money received",
                  icon: ArrowUpRight,
                  activeClass:
                    "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-200",
                  iconClass:
                    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
                },
              ].map((item) => {
                const Icon = item.icon;
                const active = form.type === item.type;

                return (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setType(item.type)}
                    className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 ${
                      active
                        ? item.activeClass
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    }`}
                  >
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconClass}`}>
                      <Icon className="h-5 w-5" />
                    </span>

                    <span>
                      <span className="block font-black">{item.title}</span>
                      <span className="mt-1 block text-sm font-medium opacity-70">{item.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="add-animate app-card p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => updateForm("amount", event.target.value)}
                  placeholder="0.00"
                  className="app-input text-lg font-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => updateForm("date", event.target.value)}
                  className="app-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                  className="app-input"
                >
                  {filteredCategories.length ? (
                    filteredCategories.map((category) => {
                      const name = getCategoryName(category);

                      return (
                        <option key={category._id || category.id || name} value={name}>
                          {name}
                        </option>
                      );
                    })
                  ) : (
                    <option value={defaultCategoryByType[form.type]}>
                      {defaultCategoryByType[form.type]}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Description
                </label>
                <input
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder={isIncome ? "e.g. Salary credited" : "e.g. Lunch at cafe"}
                  className="app-input"
                />
              </div>
            </div>

            <div className="mt-7">
              <label className="mb-3 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Quick categories
              </label>

              <div className="flex flex-wrap gap-2">
                {filteredCategories.slice(0, 10).map((category) => {
                  const name = getCategoryName(category);
                  const active = form.category === name;

                  return (
                    <button
                      type="button"
                      key={category._id || category.id || name}
                      onClick={() => updateForm("category", name)}
                      className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                        active
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                Notes optional
              </label>
              <textarea
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
                placeholder="Add any details about this transaction..."
                rows={5}
                className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 xl:pt-0">
          <div className="add-animate app-card p-5 sm:p-6 xl:sticky xl:top-24">
            <p className="mb-5 text-sm font-black text-slate-950 dark:text-white">Preview</p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-13 w-13 items-center justify-center rounded-full ${
                    isIncome
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                  }`}
                >
                  {isIncome ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
                </div>

                <div>
                  <p className="font-black text-slate-950 dark:text-white">{previewTitle}</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{form.category}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
                <p className={`text-3xl font-black ${isIncome ? "text-emerald-600" : "text-slate-950 dark:text-white"}`}>
                  {isIncome ? "+" : "-"}
                  {money(form.amount || 0)}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {form.date || today}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <button type="submit" className="app-btn-primary h-12" disabled={isLoading}>
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save transaction"}
              </button>

              <button type="button" onClick={resetForm} className="app-btn-secondary h-12">
                <X className="h-4 w-4" />
                Clear form
              </button>

              <Link to="/transactions" className="app-btn-secondary h-12">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
