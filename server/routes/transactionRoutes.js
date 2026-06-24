import express from "express";
import { body } from "express-validator";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
} from "../controllers/transactionController.js";
import protect from "../middleware/auth.js";
import { validateRequest } from "../middleware/validator.js";

const router = express.Router();

// Stats must be before /:id to avoid route conflict
router.get("/stats", protect, getStats);

router.route("/").get(protect, getTransactions).post(
  protect,
  [
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    body("type").isIn(["Income", "Expense"]).withMessage("Type must be either Income or Expense"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  validateRequest,
  createTransaction
);

router.route("/:id").put(
  protect,
  [
    body("amount").optional().isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    body("type").optional().isIn(["Income", "Expense"]).withMessage("Type must be either Income or Expense"),
  ],
  validateRequest,
  updateTransaction
).delete(protect, deleteTransaction);

export default router;
