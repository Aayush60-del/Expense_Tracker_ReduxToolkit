import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FileDown, Search, Filter, Calendar as CalendarIcon, User, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { deleteTransactionAsync } from '../features/ExpenseTrack/ExpenseSlice';
import { toast } from 'react-toastify';

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions = [] } = useSelector((state) => state.expense);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransactionAsync(id))
        .unwrap()
        .then(() => toast.success("Transaction deleted successfully"))
        .catch((err) => toast.error(err || "Failed to delete transaction"));
    }
  };

  const DateData = [...transactions].sort((a, b) => {
    return new Date(b?.date || 0) - new Date(a?.date || 0);
  });

  const displayData = DateData.filter((item) => {
    const matchesSearch =
      item?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "All" || item?.type === typeFilter;

    return matchesSearch && matchesType;
  });
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">All your income and expenses in one place.</p>
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

      {/* Filters and Actions */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex w-full sm:w-auto gap-4 items-center">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[150px]"
              >
                <option value="All">All Transactions</option>
                <option value="Income">Income Only</option>
                <option value="Expense">Expenses Only</option>
              </select>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <FileDown className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayData.length > 0 ? displayData.map((item, index) => (
                <motion.tr
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(item?.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {item.description || item.category}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${item.type === 'Income' ? 'text-green-600' : 'text-slate-900'
                    }`}>
                    {item.type === 'Income' ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                      onClick={() => handleDelete(item._id || item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Transactions;