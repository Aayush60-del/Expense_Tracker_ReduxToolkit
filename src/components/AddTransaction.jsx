import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Calendar as CalendarIcon, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { addTransactionAsync, reset, fetchTransactions } from "../features/ExpenseTrack/ExpenseSlice";import { fetchCategories } from "../features/Category/CategorySlice";
import "react-toastify/dist/ReactToastify.css";

const AddTransaction = () => {
    const [inpMon, setInpMon] = useState("");
    const [inpType, setInpType] = useState("Expense");
    const [inpCategory, setInpCategory] = useState("");
    const [inpInfo, setInpInfo] = useState("");
    const [inpDate, setInpDate] = useState("");
    const [inpNotes, setInpNotes] = useState("");

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isError, isSuccess, message } = useSelector((state) => state.expense);
    const { categories } = useSelector((state) => state.category);

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess) {
            toast.success("Transaction Added Successfully!");
            Garbage_Data();
        }

        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);
    const filteredCategories = (categories || []).filter(
        (cat) => cat.type === inpType
    );
    function Add_Amount_Data(e) {
        e.preventDefault();
        if (
            !inpMon.trim() ||
            !inpCategory.trim() ||
            !inpInfo.trim() ||
            !inpDate.trim()
        ) {
            toast.error("Please fill all fields!");
            return;
        }
        const transactionData = {
            amount: Number(inpMon),
            type: inpType,
            category: inpCategory,
            description: inpInfo,
            notes: inpNotes,
            date: inpDate
        };

dispatch(addTransactionAsync(transactionData))
  .unwrap()
  .then(() => {
    toast.success("Transaction Added Successfully!");

    // 🔥 IMPORTANT: refresh global state
    dispatch(fetchTransactions());
    dispatch(fetchStats());

    Garbage_Data();
  })
  .catch((err) => toast.error(err));    }

    function Garbage_Data() {
        setInpMon("");
        setInpType("Expense");
        setInpCategory("");
        setInpInfo("");
        setInpDate("");
    }

    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add Transaction</h1>
                    <p className="text-slate-500 text-sm mt-1">Add a new income or expense.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        <span>{currentMonth}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 font-bold">
                        {user ? (user.name ? user.name.charAt(0).toUpperCase() : "U") : "G"}
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 max-w-2xl">
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={Add_Amount_Data} className="space-y-8">

                            {/* Type Toggle */}
                            <div className="space-y-3">
                                <Label className="text-slate-700">Type</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${inpType === "Income"
                                            ? "border-green-500 bg-green-50 text-green-700 font-semibold shadow-sm"
                                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                            }`}
                                        onClick={() => {
                                            setInpType("Income");
                                            setInpCategory("");
                                        }}
                                    >
                                        <ArrowDownCircle className={`w-5 h-5 ${inpType === 'Income' ? 'text-green-500' : 'text-slate-400'}`} />
                                        Income
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${inpType === "Expense"
                                            ? "border-red-500 bg-red-50 text-red-700 font-semibold shadow-sm"
                                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                            }`}
                                        onClick={() => {
                                            setInpType("Expense");
                                            setInpCategory("");
                                        }}
                                    >
                                        <ArrowUpCircle className={`w-5 h-5 ${inpType === 'Expense' ? 'text-red-500' : 'text-slate-400'}`} />
                                        Expense
                                    </button>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="space-y-3">
                                <Label htmlFor="amount" className="text-slate-700">Amount</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={inpMon}
                                        onChange={(e) => setInpMon(e.target.value)}
                                        className="pl-8 h-12 text-lg rounded-xl border-slate-200 focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-slate-700">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    placeholder="Enter description"
                                    value={inpInfo}
                                    onChange={(e) => setInpInfo(e.target.value)}
                                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500"
                                />
                            </div>

                            {/* Category & Date Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="category" className="text-slate-700">Category</Label>
                                    <select
                                        id="category"
                                        value={inpCategory}
                                        onChange={(e) => setInpCategory(e.target.value)}
                                        className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select category</option>
                                        {filteredCategories.map((cat) => (
                                            <option key={cat._id || cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="date" className="text-slate-700">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={inpDate}
                                        onChange={(e) => setInpDate(e.target.value)}
                                        className="h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-3">
                                <Label htmlFor="notes" className="text-slate-700">Notes (optional)</Label>
                                <textarea
                                    id="notes"
                                    placeholder="Add any notes..."
                                    value={inpNotes}
                                    onChange={(e) => setInpNotes(e.target.value)}
                                    className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={Garbage_Data}
                                    className="flex-1 h-12 rounded-xl text-slate-600 font-semibold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-200"
                                >
                                    Add Transaction
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AddTransaction;