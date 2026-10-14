import React from 'react';
import { AdminDashboardMetrics, Complaint } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Flame,
  XCircle,
  BarChart3,
  Building2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminOverviewPageProps {
  metrics: AdminDashboardMetrics;
  onNavigateComplaints: (filterStatus?: string) => void;
  onSelectComplaint: (id: number) => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  metrics,
  onNavigateComplaints,
  onSelectComplaint,
}) => {
  return (
    <div className="space-y-6">
      {/* Executive KPI Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Campus Grievance Administration Overview
            </h1>
            <p className="text-xs text-slate-500">
              Live operational metrics derived directly from MySQL database aggregation queries.
            </p>
          </div>
          <button
            onClick={() => onNavigateComplaints('URGENT')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold self-start sm:self-auto hover:bg-rose-100 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>{metrics.urgentOpenComplaints} Urgent Open Action Items</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <StatCard
            title="Total"
            value={metrics.totalComplaints}
            icon={FileText}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
            onClick={() => onNavigateComplaints()}
          />
          <StatCard
            title="Submitted"
            value={metrics.newComplaints}
            icon={Clock}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
            onClick={() => onNavigateComplaints('SUBMITTED')}
          />
          <StatCard
            title="Under Review"
            value={metrics.underReviewComplaints}
            icon={AlertCircle}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
            onClick={() => onNavigateComplaints('UNDER_REVIEW')}
          />
          <StatCard
            title="In Progress"
            value={metrics.inProgressComplaints}
            icon={TrendingUp}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
            onClick={() => onNavigateComplaints('IN_PROGRESS')}
          />
          <StatCard
            title="Resolved"
            value={metrics.resolvedComplaints}
            icon={CheckCircle2}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
            onClick={() => onNavigateComplaints('RESOLVED')}
          />
          <StatCard
            title="Rejected"
            value={metrics.rejectedComplaints}
            icon={XCircle}
            iconColor="text-rose-600"
            iconBg="bg-rose-50"
            onClick={() => onNavigateComplaints('REJECTED')}
          />
          <StatCard
            title="Resolution %"
            value={`${metrics.resolutionRatePercentage}%`}
            icon={BarChart3}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-50"
          />
          <StatCard
            title="Avg. Time"
            value={`${metrics.averageResolutionTimeHours}h`}
            icon={Clock}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
        </div>
      </div>

      {/* Urgent Open Complaints Callout Section */}
      {metrics.urgentOpenList.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-sm text-rose-950">
                Critical & Urgent Attention Required ({metrics.urgentOpenList.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateComplaints('URGENT')}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold"
            >
              View all urgent →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.urgentOpenList.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectComplaint(c.id)}
                className="p-3.5 bg-white rounded-xl border border-rose-200 hover:border-rose-300 shadow-xs cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-700">
                    {c.complaintReference}
                  </span>
                  <StatusBadge status={c.status} />
                </div>
                <h4 className="font-semibold text-xs text-slate-900 truncate">{c.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{c.urgencyReason || c.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>{c.building} · {c.location}</span>
                  <span>By {c.submittedByName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Visual Distribution Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Complaints by Category
          </h3>
          <div className="space-y-2.5">
            {Object.entries(metrics.complaintsByCategory).map(([cat, count]) => {
              const pct = metrics.totalComplaints > 0 ? (count / metrics.totalComplaints) * 100 : 0;
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="truncate pr-2 font-medium">{cat}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Priority Distribution
          </h3>
          <div className="space-y-2.5">
            {Object.entries(metrics.complaintsByPriority).map(([pri, count]) => {
              const pct = metrics.totalComplaints > 0 ? (count / metrics.totalComplaints) * 100 : 0;
              const color =
                pri === 'URGENT'
                  ? 'bg-rose-500'
                  : pri === 'HIGH'
                  ? 'bg-amber-500'
                  : pri === 'MEDIUM'
                  ? 'bg-indigo-500'
                  : 'bg-slate-400';
              return (
                <div key={pri} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-medium">{pri}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Workload */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Department Ticket Load
          </h3>
          <div className="space-y-2.5">
            {Object.entries(metrics.complaintsByDepartment).map(([dept, count]) => {
              const pct = metrics.totalComplaints > 0 ? (count / metrics.totalComplaints) * 100 : 0;
              return (
                <div key={dept} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="truncate pr-2 font-medium">{dept}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently Logged Tickets */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recently Submitted Complaints</h3>
            <p className="text-xs text-slate-500">Latest tickets requiring administrative routing</p>
          </div>
          <button
            onClick={() => onNavigateComplaints()}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <span>Open All Complaints Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Complainant</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.recentComplaints.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectComplaint(c.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-indigo-700">
                    {c.complaintReference}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs font-semibold text-slate-900 truncate">
                    {c.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{c.submittedByName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{c.submittedByEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>{c.building}</div>
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
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
