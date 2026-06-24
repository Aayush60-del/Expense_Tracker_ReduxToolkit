import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Coffee,
  FolderPlus,
  Pencil,
  Plus,
  Tag,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import {
  addCategoryAsync,
  deleteCategoryAsync,
  fetchCategories,
  updateCategoryAsync,
} from "../features/Category/CategorySlice";

const emojiOptions = ["🍔", "🏠", "🚗", "⚡", "🎬", "❤️", "🛍️", "💼", "💰", "📚", "✈️", "☕"];
const colorOptions = ["#1d4ed8", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

const getCategoryName = (category) => {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name || category.title || "";
};

const getCategoryType = (category) => {
  const type = String(category?.type || "Expense").toLowerCase();
  return type === "income" ? "Income" : "Expense";
};

const getTransactionCategoryName = (transaction) => {
  const category = transaction?.category;
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name || category.title || "";
};

const Categories = () => {
  const dispatch = useDispatch();

  const { categories = [], isLoading } = useSelector((state) => state.category || {});
  const { transactions = [] } = useSelector((state) => state.expense || {});

  const [activeTab, setActiveTab] = useState("Expense");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    icon: "🍔",
    color: "#1d4ed8",
    type: "Expense",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const categoryCounts = useMemo(() => {
    const map = {};

    transactions.forEach((transaction) => {
      const name = getTransactionCategoryName(transaction);
      if (!name) return;
      map[name] = (map[name] || 0) + 1;
    });

    return map;
  }, [transactions]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => getCategoryType(category) === activeTab);
  }, [categories, activeTab]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      icon: activeTab === "Income" ? "💰" : "🍔",
      color: activeTab === "Income" ? "#22c55e" : "#1d4ed8",
      type: activeTab,
    });
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: getCategoryName(category),
      icon: category.icon || "📁",
      color: category.color || "#1d4ed8",
      type: getCategoryType(category),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setForm({
      name: "",
      icon: "🍔",
      color: "#1d4ed8",
      type: activeTab,
    });
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      icon: form.icon || "📁",
      color: form.color || "#1d4ed8",
      type: form.type,
    };

    try {
      if (editingCategory) {
        await dispatch(
          updateCategoryAsync({
            id: editingCategory._id || editingCategory.id,
            categoryData: payload,
          })
        ).unwrap();

        toast.success("Category updated");
      } else {
        await dispatch(addCategoryAsync(payload)).unwrap();
        toast.success("Category added");
      }

      closeModal();
    } catch (error) {
      toast.error(error || "Failed to save category");
    }
  };

  const handleDelete = async (category) => {
    const id = category?._id || category?.id;
    if (!id) return;

    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;

    try {
      await dispatch(deleteCategoryAsync(id)).unwrap();
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-7 pb-10">
      <div className="cat-animate flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="app-page-title">Categories</h1>
          <p className="app-page-subtitle">Organize your transactions for sharper insights.</p>
        </div>

        <button onClick={openCreateModal} className="app-btn-primary w-fit">
          <Plus className="h-4 w-4" />
          New category
        </button>
      </div>

      <div className="cat-animate app-card p-2">
        <div className="grid grid-cols-2 gap-2">
          {["Expense", "Income"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                activeTab === type
                  ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              }`}
            >
              {type} categories
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="cat-animate app-card px-6 py-16 text-center font-bold text-slate-500 dark:text-slate-400">
          Loading categories...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => {
            const name = getCategoryName(category);
            const count = categoryCounts[name] || 0;
            const type = getCategoryType(category);
            const color = category.color || (type === "Income" ? "#22c55e" : "#1d4ed8");

            return (
              <div
                key={category._id || category.id || name}
                className="cat-animate app-card group min-h-[165px] p-5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-700/10 sm:min-h-[185px] sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                    style={{
                      backgroundColor: color + "18",
                      color,
                    }}
                  >
                    {category.icon || "📁"}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                      type === "Income"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                    }`}
                  >
                    {type}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-black text-slate-950 dark:text-white">{name}</h3>
                  <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {count} {count === 1 ? "transaction" : "transactions"}
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:hover:bg-blue-500/15 dark:hover:text-blue-300"
                    title="Edit category"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(category)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:hover:bg-red-500/15 dark:hover:text-red-300"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={openCreateModal}
            className="cat-animate flex min-h-[165px] flex-col items-center justify-center rounded-[20px] border border-dashed border-blue-400 bg-blue-50/60 p-5 text-center text-blue-700 transition hover:-translate-y-1 hover:bg-blue-50 sm:min-h-[185px] sm:p-6 dark:border-blue-400/50 dark:bg-blue-500/10 dark:text-blue-300"
          >
            <FolderPlus className="h-8 w-8" />
            <p className="mt-4 font-black">Add new category</p>
          </button>
        </div>
      )}

      {!filteredCategories.length && !isLoading ? (
        <div className="cat-animate app-card px-6 py-16 text-center">
          <Tag className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-4 font-black text-slate-950 dark:text-white">No {activeTab.toLowerCase()} categories yet</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create your first category to organize transactions.
          </p>
        </div>
      ) : null}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {editingCategory ? "Edit category" : "Add category"}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Create clean categories for better reports.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Category name
                </label>
                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="e.g. Food"
                  className="app-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Expense", "Income"].map((type) => (
                    <button
                      key={type}
                      onClick={() => updateForm("type", type)}
                      type="button"
                      className={`rounded-2xl border px-4 py-3 font-black transition ${
                        form.type === type
                          ? "border-blue-700 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-200"
                          : "border-slate-200 text-slate-600 hover:border-blue-200 dark:border-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => updateForm("icon", emoji)}
                      className={`flex h-12 items-center justify-center rounded-2xl border text-xl transition ${
                        form.icon === emoji
                          ? "border-blue-700 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/15"
                          : "border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => updateForm("color", color)}
                      className={`h-10 w-10 rounded-full border-4 transition ${
                        form.color === color
                          ? "border-slate-950 dark:border-white"
                          : "border-white dark:border-slate-950"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button onClick={closeModal} className="app-btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="app-btn-primary">
                <Wallet className="h-4 w-4" />
                {editingCategory ? "Save changes" : "Add category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
