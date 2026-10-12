import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FileQuestion } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4 text-center">
      <div className="p-4 bg-slate-900 rounded-full text-emerald-400 mb-4 border border-slate-800">
        <FileQuestion className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-extrabold mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        The page or resource you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">Return to Dashboard</Button>
      </Link>
    </div>
  );
};
