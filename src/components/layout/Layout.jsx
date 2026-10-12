import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export const Layout = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Financial Overview';
      case '/expenses':
        return 'Expense Management';
      case '/income':
        return 'Income Management';
      case '/transactions':
        return 'Transaction History';
      case '/budgets':
        return 'Budget Planning';
      case '/analytics':
        return 'Financial Analytics & Reports';
      case '/profile':
        return 'Account Settings';
      default:
        return 'Expense Tracker';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header title={getTitle()} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
};
