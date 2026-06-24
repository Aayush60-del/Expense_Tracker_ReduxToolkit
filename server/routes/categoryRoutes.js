import express from "express";
import { body } from "express-validator";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import protect from "../middleware/auth.js";
import { validateRequest } from "../middleware/validator.js";

const router = express.Router();

router.route("/").get(protect, getCategories).post(
  protect,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("type").isIn(["Income", "Expense"]).withMessage("Type must be either Income or Expense"),
  ],
  validateRequest,
  createCategory
);

router.route("/:id").put(
  protect,
  [
    body("type").optional().isIn(["Income", "Expense"]).withMessage("Type must be either Income or Expense"),
  ],
  validateRequest,
  updateCategory
).delete(protect, deleteCategory);

export default router;
