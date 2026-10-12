import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('this_month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getSummary(
        range,
        range === 'custom' ? startDate : null,
        range === 'custom' ? endDate : null
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [range]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (startDate && endDate) {
      fetchSummary();
    }
  };

  if (loading && !data) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      {/* Date Range Selector Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
          <Calendar className="h-4 w-4 text-emerald-500" /> Filter Period:
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: 'this_year', label: 'This Year' },
            { id: 'custom', label: 'Custom' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                range === item.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {range === 'custom' && (
        <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
            required
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-900"
            required
          />
          <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
            Apply Filter
          </button>
        </form>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Net Balance</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(data?.totalBalance)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lifetime total earnings minus expenses</p>
        </Card>

        {/* Total Income */}
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Income</span>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(data?.totalIncome)}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold mt-1">
            <ArrowUpRight className="h-4 w-4" /> Received in period
          </div>
        </Card>

        {/* Total Expenses */}
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Expenses</span>
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(data?.totalExpenses)}
          </p>
          <div className="flex items-center gap-1 text-xs text-rose-500 font-semibold mt-1">
            <ArrowDownRight className="h-4 w-4" /> Spent in period
          </div>
        </Card>

        {/* Savings Rate */}
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Period Savings</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <PiggyBank className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(data?.monthlySavings)}
          </p>
          <p className="text-xs font-semibold text-indigo-500 mt-1">
            Savings Rate: {data?.savingsRate?.toFixed(1)}%
          </p>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Income vs Expense Bar Chart */}
        <Card className="lg:col-span-2" title="Income vs Expenses (6-Month Trend)">
          <div className="h-72 w-full mt-4">
            {data?.monthlyTrends?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No trend data" message="Add income and expense items to view trends." />
            )}
          </div>
        </Card>

        {/* Expense Category Breakdown Pie Chart */}
        <Card title="Expense Category Breakdown">
          <div className="h-72 w-full mt-4 flex items-center justify-center">
            {data?.categoryBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {data.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No category expenses" message="No expense records found for this period." />
            )}
          </div>
        </Card>
      </div>

      {/* Budget Progress & Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Progress Widget */}
        <Card title="Monthly Budget Progress">
          <div className="space-y-4 mt-2">
            {data?.budgetProgressList?.length > 0 ? (
              data.budgetProgressList.map((b) => (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{b.category}</span>
                    <span className="text-slate-500">
                      {formatCurrency(b.spentAmount)} / {formatCurrency(b.monthlyLimit)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.isExceeded
                          ? 'bg-rose-500'
                          : b.isWarning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(b.percentageConsumed, 100)}%` }}
                    ></div>
                  </div>
                  {b.isExceeded && (
                    <p className="text-[10px] font-bold text-rose-500">⚠️ Budget Exceeded by {formatCurrency(b.spentAmount - b.monthlyLimit)}!</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No budgets set for this month yet.</p>
            )}
          </div>
        </Card>

        {/* Recent Transactions Feed */}
        <Card title="Recent Transactions Feed">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {data?.recentTransactions?.length > 0 ? (
              data.recentTransactions.map((tx) => (
                <div key={`${tx.type}-${tx.id}`} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl text-xs font-bold ${
                        tx.type === 'INCOME'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {tx.type === 'INCOME' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{tx.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {tx.category} • {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-extrabold ${
                      tx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No recent transactions available.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
