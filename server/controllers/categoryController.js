import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";

// @desc    Get all categories for user
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
