import Category from "../models/Category.js";

const defaultCategories = [
  // Expense categories
  { name: "Food & Dining", icon: "🍔", color: "#ef4444", type: "Expense", isDefault: true },
  { name: "Transport", icon: "🚗", color: "#f59e0b", type: "Expense", isDefault: true },
  { name: "Shopping", icon: "🛍️", color: "#ec4899", type: "Expense", isDefault: true },
  { name: "Entertainment", icon: "🎬", color: "#8b5cf6", type: "Expense", isDefault: true },
  { name: "Bills & Utilities", icon: "💡", color: "#06b6d4", type: "Expense", isDefault: true },
  { name: "Health", icon: "🏥", color: "#10b981", type: "Expense", isDefault: true },
  { name: "Education", icon: "📚", color: "#3b82f6", type: "Expense", isDefault: true },
  { name: "Other", icon: "📂", color: "#64748b", type: "Expense", isDefault: true },
  // Income categories
  { name: "Salary", icon: "💰", color: "#22c55e", type: "Income", isDefault: true },
  { name: "Freelance", icon: "💻", color: "#3b82f6", type: "Income", isDefault: true },
  { name: "Investments", icon: "📈", color: "#f59e0b", type: "Income", isDefault: true },
  { name: "Business", icon: "🏢", color: "#8b5cf6", type: "Income", isDefault: true },
  { name: "Gifts", icon: "🎁", color: "#ec4899", type: "Income", isDefault: true },
  { name: "Other", icon: "📂", color: "#64748b", type: "Income", isDefault: true },
];

export const seedCategoriesForUser = async (userId) => {
  try {
    const categories = defaultCategories.map((cat) => ({
      ...cat,
      user: userId,
    }));
    await Category.insertMany(categories);
  } catch (error) {
    console.error("Error seeding categories:", error.message);
  }
};

export default defaultCategories;
