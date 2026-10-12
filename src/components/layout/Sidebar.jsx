import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  Receipt,
  PiggyBank,
  BarChart3,
  User,
  LogOut,
  Sun,
  Moon,
  Wallet,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Expenses', path: '/expenses', icon: TrendingDown },
    { label: 'Income', path: '/income', icon: TrendingUp },
    { label: 'Transactions', path: '/transactions', icon: Receipt },
    { label: 'Budgets', path: '/budgets', icon: PiggyBank },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 border-r border-slate-800 h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
          <Wallet className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">ExpenseTracker</h1>
          <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Pro Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      {/* Footer User Profile & Controls */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-500">{isDark ? 'ON' : 'OFF'}</span>
        </button>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
