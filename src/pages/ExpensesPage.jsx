import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Plus, Search, Filter, Edit, Trash2, ArrowUpDown } from 'lucide-react';

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('transactionDate');
  const [sortDir, setSortDir] = useState('desc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    transactionDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Credit Card',
    description: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await expenseService.getExpenses({
        query: query || undefined,
        category: category || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        size: 10,
        sortBy,
        sortDir,
      });
      setExpenses(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, category, sortBy, sortDir]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchExpenses();
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setFormData({
      title: '',
      amount: '',
      category: EXPENSE_CATEGORIES[0],
      transactionDate: new Date().toISOString().slice(0, 10),
      paymentMethod: PAYMENT_METHODS[0],
      description: '',
      notes: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp);
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      transactionDate: exp.transactionDate,
      paymentMethod: exp.paymentMethod || PAYMENT_METHODS[0],
      description: exp.description || '',
      notes: exp.notes || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title || !formData.amount || !formData.category || !formData.transactionDate) {
      setFormError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, formData);
      } else {
        await expenseService.createExpense(formData);
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      setFormError(err.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await expenseService.deleteExpense(deleteId);
      setDeleteId(null);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Expenses ({totalElements})</h2>
          <p className="text-xs text-slate-500">Track and categorize your daily outgoing expenses</p>
        </div>
        <Button onClick={openAddModal} variant="primary" className="gap-2">
          <Plus className="h-4 w-4" /> Add New Expense
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Input
              placeholder="Search expenses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
            options={EXPENSE_CATEGORIES}
            placeholder="All Categories"
          />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <div className="flex gap-2">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
            <Button type="submit" variant="secondary" className="px-3 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Expenses Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : expenses.length === 0 ? (
          <EmptyState
            title="No expenses found"
            message="No expense entries match your current search or date filters."
            action={
              <Button onClick={openAddModal} variant="primary" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Expense
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('transactionDate')}>
                    <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right cursor-pointer" onClick={() => toggleSort('amount')}>
                    <span className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      <div>{exp.title}</div>
                      {exp.description && <p className="text-[11px] font-normal text-slate-400">{exp.description}</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{formatDate(exp.transactionDate)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{exp.paymentMethod || '—'}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-600 dark:text-rose-400">
                      -{formatCurrency(exp.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 text-rose-500 text-xs rounded-lg font-medium">
              {formError}
            </div>
          )}

          <Input
            label="Expense Title"
            placeholder="e.g. Grocery Shopping"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={EXPENSE_CATEGORIES}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Transaction Date"
              type="date"
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              required
            />
            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              options={PAYMENT_METHODS}
            />
          </div>

          <Input
            label="Description / Details"
            placeholder="Optional short description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {editingExpense ? 'Update Expense' : 'Save Expense'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this expense record? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};
