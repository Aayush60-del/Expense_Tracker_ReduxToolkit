import Transaction from "../models/Transaction.js";
import UserSettings from "../models/UserSettings.js";

export const checkBudget = async (userId) => {
  const settings = await UserSettings.findOne({ user: userId });
  
  if (!settings || !settings.monthlyBudget || settings.monthlyBudget <= 0) {
    return { percentage: 0, isWarning: false, isCritical: false, budget: 0, currentSpent: 0 };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const transactions = await Transaction.find({
    user: userId,
    type: "Expense",
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const currentSpent = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
  const percentage = Math.round((currentSpent / settings.monthlyBudget) * 100);

  return {
    percentage,
    budget: settings.monthlyBudget,
    currentSpent,
    isWarning: percentage >= 80 && percentage < 100,
    isCritical: percentage >= 100,
  };
};
