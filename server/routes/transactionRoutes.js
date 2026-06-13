import express from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
} from "../controllers/transactionController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Stats must be before /:id to avoid route conflict
router.get("/stats", protect, getStats);

router.route("/").get(protect, getTransactions).post(protect, createTransaction);
router.route("/:id").put(protect, updateTransaction).delete(protect, deleteTransaction);

export default router;
