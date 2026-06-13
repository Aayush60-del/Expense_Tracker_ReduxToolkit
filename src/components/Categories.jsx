import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'react-toastify';
import { fetchCategories, addCategoryAsync, deleteCategoryAsync, resetCategoryState } from '../features/Category/CategorySlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";

const Categories = () => {
  const [activeTab, setActiveTab] = useState('Expense');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("");


  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state.category || {});

  const categories = categoryState.categories || [];
  const isLoading = categoryState.isLoading;
  const isError = categoryState.isError;
  const message = categoryState.message;
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetCategoryState());
    }
  }, [isError, message, dispatch]);

  const handleAddCategory = () => {
    if (!newCatName || !newCatIcon) {
      toast.error("Please provide both name and an emoji icon.");
      return;
    }
    dispatch(addCategoryAsync({
      name: newCatName,
      icon: newCatIcon,
      type: activeTab,
      color: activeTab === 'Expense' ? '#ef4444' : '#22c55e'
    })).unwrap().then(() => {
      toast.success("Category added successfully");
      setIsAddOpen(false);
      setNewCatName("");
      setNewCatIcon("");
    }).catch(err => toast.error(err));
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCategoryAsync(id)).unwrap();
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err || "Delete failed");
    }
  };

  const filteredCategories = (categories || []).filter(
    (c) => c.type === activeTab
  );
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your income and expense categories.</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 gap-2"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {activeTab} Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                placeholder="e.g. Shopping"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Emoji Icon</Label>
              <Input
                placeholder="e.g. 🛍️"
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'Expense' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            onClick={() => setActiveTab('Expense')}
          >
            Expense Categories
            {activeTab === 'Expense' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
          <button
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'Income' ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            onClick={() => setActiveTab('Income')}
          >
            Income Categories
            {activeTab === 'Income' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
              />
            )}
          </button>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length > 0 ? filteredCategories.map((cat, index) => (
                <motion.tr
                  key={cat._id || cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-slate-50/80 transition-all duration-200"                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm">
                        {cat.icon}
                      </div>
                      <span className="font-semibold text-slate-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {cat.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(cat._id || cat.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                    <div className="py-10 text-center">
                      <Tag className="mx-auto mb-2 text-slate-400" />
                      <p className="text-slate-500">No categories found</p>
                      <p className="text-xs text-slate-400">Add your first category to get started</p>
                    </div>                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Categories;
