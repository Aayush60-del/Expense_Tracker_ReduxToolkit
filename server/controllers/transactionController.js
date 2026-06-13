import Transaction from "../models/Transaction.js";

// @desc    Get all transactions for user
// @route   GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const { search, type, category, startDate, endDate, page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };

    // Filter by type
    if (type && type !== "all") {
      query.type = type;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Search by description or category
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      transactions,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, notes, date } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: "Amount, type, and category are required" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      amount: Number(amount),
      type,
      category,
      description: description || "",
      notes: notes || "",
      date: date || new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Verify ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction stats (totals, category breakdown, monthly trends)
// @route   GET /api/transactions/stats
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month totals
    const currentMonthTotals = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    // Last month totals
    const lastMonthTotals = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    // Category breakdown for expenses
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: userId, type: "Expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // Monthly trends (last 12 months)
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Parse totals
    const getTotal = (arr, type) => {
      const found = arr.find((item) => item._id === type);
      return found ? found.total : 0;
    };

    const currentIncome = getTotal(currentMonthTotals, "Income");
    const currentExpense = getTotal(currentMonthTotals, "Expense");
    const lastIncome = getTotal(lastMonthTotals, "Income");
    const lastExpense = getTotal(lastMonthTotals, "Expense");

    // Calculate percentage changes
    const incomeChange = lastIncome > 0 ? (((currentIncome - lastIncome) / lastIncome) * 100).toFixed(1) : 0;
    const expenseChange = lastExpense > 0 ? (((currentExpense - lastExpense) / lastExpense) * 100).toFixed(1) : 0;
    const balance = currentIncome - currentExpense;
    const lastBalance = lastIncome - lastExpense;
    const balanceChange = lastBalance !== 0 ? (((balance - lastBalance) / Math.abs(lastBalance)) * 100).toFixed(1) : 0;

    res.json({
      currentMonth: {
        income: currentIncome,
        expense: currentExpense,
        balance,
      },
      lastMonth: {
        income: lastIncome,
        expense: lastExpense,
        balance: lastBalance,
      },
      changes: {
        income: Number(incomeChange),
        expense: Number(expenseChange),
        balance: Number(balanceChange),
      },
      categoryBreakdown,
      monthlyTrends,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
