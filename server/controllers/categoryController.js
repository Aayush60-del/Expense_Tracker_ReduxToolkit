import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all categories for user
// @route   GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id }).sort({ type: 1, name: 1 });

  // Optionally add transaction count for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Transaction.countDocuments({
        user: req.user._id,
        category: cat.name,
      });
      return { ...cat.toObject(), transactionCount: count };
    })
  );

  res.json(categoriesWithCount);
});

// @desc    Create category
// @route   POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, color, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Name and type are required" });
  }

  // Check for duplicate
  const exists = await Category.findOne({
    user: req.user._id,
    name,
    type,
  });

  if (exists) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = await Category.create({
    user: req.user._id,
    name,
    icon: icon || "📂",
    color: color || "#3b82f6",
    type,
    isDefault: false,
  });

  res.status(201).json({ ...category.toObject(), transactionCount: 0 });
});

// @desc    Update category
// @route   PUT /api/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (category.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const oldName = category.name;
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  // If category name changed, update all related transactions
  if (req.body.name && req.body.name !== oldName) {
    await Transaction.updateMany(
      { user: req.user._id, category: oldName },
      { category: req.body.name }
    );
  }

  const count = await Transaction.countDocuments({
    user: req.user._id,
    category: updated.name,
  });

  res.json({ ...updated.toObject(), transactionCount: count });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (category.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Reassign transactions using this category to "Other"
  await Transaction.updateMany(
    { user: req.user._id, category: category.name },
    { category: "Other" }
  );

  await Category.findByIdAndDelete(req.params.id);

  res.json({ id: req.params.id });
});
