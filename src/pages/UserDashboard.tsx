import React from 'react';
import { User, Complaint } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react';

interface UserDashboardProps {
  currentUser: User;
  complaints: Complaint[];
  onSubmitNew: () => void;
  onViewAll: () => void;
  onSelectComplaint: (id: number) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  complaints,
  onSubmitNew,
  onViewAll,
  onSelectComplaint,
}) => {
  const total = complaints.length;
  const submitted = complaints.filter((c) => c.status === 'SUBMITTED').length;
  const underReview = complaints.filter((c) => c.status === 'UNDER_REVIEW').length;
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;

  const recent = [...complaints]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-300 text-xs font-mono">
            <span>Logged in as {currentUser.role}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.fullName}
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
            Campus ID: <span className="font-mono text-white">{currentUser.institutionalId}</span> ·
            Report facility disruptions, equipment defects, and safety hazards with immediate tracking.
          </p>
        </div>

        <button
          onClick={onSubmitNew}
          className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 group"
        >
          <PlusCircle className="w-4 h-4 text-indigo-600 group-hover:rotate-90 transition-transform" />
          <span>Submit New Complaint</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Filed"
          value={total}
          icon={FileText}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Submitted"
          value={submitted}
          icon={Clock}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Under Review"
          value={underReview}
          icon={AlertCircle}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Complaints</h3>
            <p className="text-xs text-slate-500">Live status of your submitted tickets</p>
          </div>
          {complaints.length > 0 && (
            <button
              onClick={onViewAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <span>View All ({total})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No complaints filed yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Notice a damaged projector, water leak, or Wi-Fi drop? Log your first complaint to alert maintenance.
            </p>
            <button
              onClick={onSubmitNew}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
            >
              Submit First Complaint
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Title & Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectComplaint(c.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-700">
                      {c.complaintReference}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-400">{c.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{c.building}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{c.floorOrRoom || c.location}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint(c.id);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Track →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
