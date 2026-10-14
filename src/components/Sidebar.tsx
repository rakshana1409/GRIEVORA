import React from 'react';
import { Role } from '../types';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Search,
  Building2,
  BarChart3,
  Users,
  ShieldAlert,
  Clock,
  HelpCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type NavView =
  | 'user_overview'
  | 'user_submit'
  | 'user_my_complaints'
  | 'user_track'
  | 'admin_overview'
  | 'admin_all_complaints'
  | 'admin_urgent'
  | 'admin_pending'
  | 'admin_reports'
  | 'departments'
  | 'help_support';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  currentRole: Role;
  urgentCount?: number;
  newCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  currentRole,
  urgentCount = 0,
  newCount = 0,
}) => {
  const isAdmin = currentRole === 'ADMIN';

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 min-h-[calc(100vh-6.5rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Section Header */}
        <div>
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'Administration Portal' : 'Campus Portal'}
          </div>

          <nav className="mt-2 space-y-1">
            {!isAdmin ? (
              <>
                <button
                  onClick={() => onSelectView('user_overview')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'user_overview'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    <span>Overview</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectView('user_submit')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'user_submit'
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-indigo-600 hover:bg-indigo-50 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Complaint</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectView('user_my_complaints')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'user_my_complaints'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>My Complaints</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectView('departments')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'departments'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Campus Departments</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelectView('admin_overview')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'admin_overview'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-slate-500" />
                    <span>Admin Overview</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectView('admin_all_complaints')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'admin_all_complaints'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>All Complaints</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectView('admin_urgent')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'admin_urgent'
                      ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Urgent Open</span>
                  </div>
                  {urgentCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-md">
                      {urgentCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onSelectView('admin_pending')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'admin_pending'
                      ? 'bg-amber-50 text-amber-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Pending Review</span>
                  </div>
                  {newCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                      {newCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onSelectView('admin_reports')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'admin_reports'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-slate-500" />
                    <span>Reports & Analytics</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectView('departments')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentView === 'departments'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Departments & Staff</span>
                  </div>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Support & System Help */}
        <div>
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System & Support
          </div>
          <nav className="mt-2 space-y-1">
            <button
              onClick={() => onSelectView('help_support')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'help_support'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Help & SLA Guide</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Info Card */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Grievance + Aura</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug">
          “Your Voice. Our Campus. Better Together.”
        </p>
      </div>
    </aside>
  );
};
