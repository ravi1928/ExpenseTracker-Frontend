import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { reportService } from '../services/reportService';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { BarChart3, Download, Award, TrendingUp, TrendingDown, PieChart as PieIcon } from 'lucide-react';
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
  AreaChart,
  Area,
} from 'recharts';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getSummary('this_year');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      await reportService.exportCsv();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Financial Reports & Analytics</h2>
          <p className="text-xs text-slate-500">Comprehensive annual spending trends, category distributions, and CSV downloads</p>
        </div>
        <Button onClick={handleExport} variant="primary" className="gap-2" loading={exporting}>
          <Download className="h-4 w-4" /> Export CSV Data
        </Button>
      </div>

      {/* Top Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Spending Category</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {data?.highestSpendingCategory || 'N/A'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">{formatCurrency(data?.highestSpendingCategoryAmount)} total spent</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Income (This Year)</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(data?.totalIncome)}
            </h4>
            <p className="text-xs text-emerald-500 mt-0.5">Total recorded revenue</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
            <TrendingDown className="h-7 w-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Expenses (This Year)</span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(data?.totalExpenses)}
            </h4>
            <p className="text-xs text-rose-500 mt-0.5">Total outgoing funds</p>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Trend Chart for Savings */}
        <Card title="Savings Trend (Last 6 Months)">
          <div className="h-72 w-full mt-4">
            {data?.monthlyTrends?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                  <Area type="monotone" dataKey="savings" name="Net Savings" stroke="#10b981" fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No trend data" />
            )}
          </div>
        </Card>

        {/* Category Breakdown Table */}
        <Card title="Category Spending Breakdown">
          <div className="space-y-3 mt-4 overflow-y-auto max-h-72 pr-1">
            {data?.categoryBreakdown?.length > 0 ? (
              data.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#64748b' }}
                    ></div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatCurrency(cat.amount)}</span>
                    <span className="text-[11px] text-slate-400 ml-2">({cat.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No expenses recorded" />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
