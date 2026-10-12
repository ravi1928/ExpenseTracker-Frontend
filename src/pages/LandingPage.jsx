import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, PieChart, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ExpenseTracker</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Zap className="h-3.5 w-3.5" /> Full-Stack Production App
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white max-w-4xl tracking-tight leading-tight">
          Master Your Financial Future with Intelligent Analytics
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Track income, manage category budgets, analyze monthly spending trends, and take control of your financial health with zero hassle.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto px-8 gap-2 font-semibold">
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 text-slate-200 border-slate-700 hover:bg-slate-900">
              Explore Demo Login
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4">
              <PieChart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Insights</h3>
            <p className="text-sm text-slate-400">Interactive charts powered by Recharts calculate your actual income vs expenses instantly.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Spring Security & JWT</h3>
            <p className="text-sm text-slate-400">Stateless JWT authentication ensures strict user data isolation and security.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Budget Threshold Alerts</h3>
            <p className="text-sm text-slate-400">Set monthly limits per category with real-time percentage indicators and alerts.</p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 ExpenseTracker App. Built with Spring Boot 3 & React Vite.
      </footer>
    </div>
  );
};
