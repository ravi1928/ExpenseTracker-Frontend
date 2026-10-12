import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { User, Mail, ShieldCheck, Calendar, Lock } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await authService.getProfile();
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">User Profile & Security</h2>
        <p className="text-xs text-slate-500">Manage your account details and authentication settings</p>
      </div>

      <Card className="divide-y divide-slate-100 dark:divide-slate-800">
        <div className="flex items-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-emerald-900/20">
            {profile?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{profile?.fullName}</h3>
            <p className="text-xs text-slate-500">{profile?.email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full mt-1.5">
              <ShieldCheck className="h-3 w-3" /> Verified Account
            </span>
          </div>
        </div>

        <div className="py-4 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <User className="h-4 w-4 text-slate-400" />
            <span className="font-semibold w-32">Full Name:</span>
            <span>{profile?.fullName}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="font-semibold w-32">Email Address:</span>
            <span>{profile?.email}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="font-semibold w-32">Member Since:</span>
            <span>{formatDate(profile?.createdAt)}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Lock className="h-4 w-4 text-slate-400" />
            <span className="font-semibold w-32">Authentication:</span>
            <span>Spring Security (BCrypt Hashed + JWT Stateless Token)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
