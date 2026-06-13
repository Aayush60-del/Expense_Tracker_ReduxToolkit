import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add a category name"],
      trim: true,
    },
    icon: {
      type: String,
      default: "📂",
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
    type: {
      type: String,
      required: true,
      enum: ["Income", "Expense"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

categorySchema.index({ user: 1, type: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;
