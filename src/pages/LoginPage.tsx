import React, { useState } from 'react';
import { api } from '../api/client';
import { User } from '../types';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  Info,
  X,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onGoToRegister: () => void;
  onGoToLanding: () => void;
  onGoToResetPassword: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onGoToRegister,
  onGoToLanding,
  onGoToResetPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Please provide both institutional email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await api.login(email, password);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <button
          onClick={onGoToLanding}
          className="inline-flex items-center gap-2 mb-2 focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg shadow-xs">
            G
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            GRIEVORA
          </span>
        </button>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Your Campus Portal
        </h2>
        <p className="text-xs text-slate-500">
          “Your Voice. Our Campus. Better Together.”
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-slate-200/80 sm:px-10 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email or Student / Admin ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rakshana@grievora.edu or 310625205222"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onGoToResetPassword}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Institutional Accounts Quick Selector */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
              Authorized Institutional Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => {
                  setEmail('rakshana@grievora.edu');
                  setPassword('Password@123');
                }}
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 transition-colors text-left group"
              >
                <div className="text-[11px] font-bold text-indigo-900 group-hover:text-indigo-700">
                  Student Portal
                </div>
                <div className="text-[10px] text-slate-600 font-medium">Rakshana</div>
                <div className="text-[9px] text-slate-400 font-mono">310625205222</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@grievora.edu');
                  setPassword('Password@123');
                }}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left group"
              >
                <div className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-600">
                  Admin Portal
                </div>
                <div className="text-[10px] text-slate-600 font-medium">Chief Warden</div>
                <div className="text-[9px] text-slate-400 font-mono">ADM-001</div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Click an account above to auto-fill credentials, then click Sign In.
            </p>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
            Don't have an institutional account yet?{' '}
            <button
              onClick={onGoToRegister}
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
