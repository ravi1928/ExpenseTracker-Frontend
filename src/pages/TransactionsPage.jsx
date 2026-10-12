import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { reportService } from '../services/reportService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { TrendingUp, TrendingDown, Download, Search } from 'lucide-react';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [expRes, incRes] = await Promise.all([
        expenseService.getExpenses({ size: 100 }),
        incomeService.getIncomes({ size: 100 }),
      ]);

      const expList = (expRes.data.content || []).map((e) => ({
        id: e.id,
        type: 'EXPENSE',
        title: e.title,
        amount: e.amount,
        category: e.category,
        date: e.transactionDate,
        paymentMethod: e.paymentMethod,
        description: e.description,
      }));

      const incList = (incRes.data.content || []).map((i) => ({
        id: i.id,
        type: 'INCOME',
        title: i.source,
        amount: i.amount,
        category: i.category,
        date: i.dateReceived,
        paymentMethod: 'Direct',
        description: i.description,
      }));

      const combined = [...expList, ...incList];
      combined.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      await reportService.exportCsv();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tx.title.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        (tx.description && tx.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Unified Transaction History</h2>
          <p className="text-xs text-slate-500">Complete chronological audit log of income and expense transactions</p>
        </div>
        <Button onClick={handleExportCsv} variant="outline" className="gap-2" loading={exporting}>
          <Download className="h-4 w-4" /> Export CSV Report
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search all transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Transactions' },
                { value: 'INCOME', label: 'Income Only' },
                { value: 'EXPENSE', label: 'Expenses Only' },
              ]}
              placeholder=""
            />
          </div>
        </div>
      </Card>

      {/* Unified Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState title="No transactions" message="No matching transactions found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Title / Source</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((tx) => (
                  <tr key={`${tx.type}-${tx.id}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          tx.type === 'INCOME'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type === 'INCOME' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      <div>{tx.title}</div>
                      {tx.description && <p className="text-[11px] font-normal text-slate-400">{tx.description}</p>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">{tx.category}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(tx.date)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{tx.paymentMethod || '—'}</td>
                    <td
                      className={`py-3.5 px-4 text-right font-extrabold ${
                        tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
