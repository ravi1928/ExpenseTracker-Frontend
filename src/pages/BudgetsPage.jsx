import React, { useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import { formatCurrency, EXPENSE_CATEGORIES } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Plus, AlertTriangle, Trash2, PiggyBank } from 'lucide-react';

export const BudgetsPage = () => {
  const now = new Date();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: EXPENSE_CATEGORIES[0],
    monthlyLimit: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await budgetService.getBudgets(month, year);
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const openAddModal = () => {
    setFormData({
      category: EXPENSE_CATEGORIES[0],
      monthlyLimit: '',
      month,
      year,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.monthlyLimit || parseFloat(formData.monthlyLimit) <= 0) {
      setFormError('Please enter a valid monthly limit amount');
      return;
    }

    setSubmitting(true);
    try {
      await budgetService.saveBudget(formData);
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      setFormError(err.message || 'Failed to save budget');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await budgetService.deleteBudget(deleteId);
      setDeleteId(null);
      fetchBudgets();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Category Budgets</h2>
          <p className="text-xs text-slate-500">Set monthly spending limits and monitor budget consumption</p>
        </div>
        <Button onClick={openAddModal} variant="primary" className="gap-2">
          <Plus className="h-4 w-4" /> Set Category Budget
        </Button>
      </div>

      {/* Month Filter Bar */}
      <Card className="p-4 flex flex-wrap items-center gap-4">
        <div className="w-44">
          <Select
            label="Select Month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            options={[
              { value: 1, label: 'January' },
              { value: 2, label: 'February' },
              { value: 3, label: 'March' },
              { value: 4, label: 'April' },
              { value: 5, label: 'May' },
              { value: 6, label: 'June' },
              { value: 7, label: 'July' },
              { value: 8, label: 'August' },
              { value: 9, label: 'September' },
              { value: 10, label: 'October' },
              { value: 11, label: 'November' },
              { value: 12, label: 'December' },
            ]}
            placeholder=""
          />
        </div>
        <div className="w-36">
          <Input
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
        </div>
      </Card>

      {/* Budget Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : budgets.length === 0 ? (
        <EmptyState
          title="No budgets configured"
          message={`No monthly budgets set for ${month}/${year}. Create one now!`}
          action={
            <Button onClick={openAddModal} variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Create Budget
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => (
            <Card key={b.id} className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <PiggyBank className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{b.category}</h4>
                </div>
                <button
                  onClick={() => setDeleteId(b.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                  title="Remove Budget"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Monthly Limit:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(b.monthlyLimit)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Spent so far:</span>
                  <span className={`font-bold ${b.isExceeded ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {formatCurrency(b.spentAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Remaining:</span>
                  <span className={`font-bold ${b.remainingAmount < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {formatCurrency(b.remainingAmount)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.isExceeded ? 'bg-rose-500' : b.isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(b.percentageConsumed, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-slate-400 font-medium">{b.percentageConsumed.toFixed(1)}% Consumed</span>
                  {b.isExceeded && (
                    <span className="flex items-center gap-1 font-bold text-rose-500">
                      <AlertTriangle className="h-3 w-3" /> Exceeded!
                    </span>
                  )}
                  {!b.isExceeded && b.isWarning && (
                    <span className="font-bold text-amber-500">Warning (80%+)</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set Category Budget">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-500/10 text-rose-500 text-xs rounded-lg font-medium">
              {formError}
            </div>
          )}

          <Select
            label="Expense Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={EXPENSE_CATEGORIES}
            required
          />

          <Input
            label="Monthly Spending Limit ($)"
            type="number"
            step="0.01"
            placeholder="e.g. 500.00"
            value={formData.monthlyLimit}
            onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              options={[
                { value: 1, label: 'January' },
                { value: 2, label: 'February' },
                { value: 3, label: 'March' },
                { value: 4, label: 'April' },
                { value: 5, label: 'May' },
                { value: 6, label: 'June' },
                { value: 7, label: 'July' },
                { value: 8, label: 'August' },
                { value: 9, label: 'September' },
                { value: 10, label: 'October' },
                { value: 11, label: 'November' },
                { value: 12, label: 'December' },
              ]}
              required
            />
            <Input
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to remove this budget limit?"
        loading={deleting}
      />
    </div>
  );
};
