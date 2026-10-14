import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { ReportMetrics, Complaint } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface AdminReportsPageProps {
  onSelectComplaint: (id: number) => void;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({ onSelectComplaint }) => {
  const [report, setReport] = useState<ReportMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '7d'>('all');

  useEffect(() => {
    loadReport();
  }, [timeRange]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await api.getReports();
      setReport(res);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    const csvContent = api.exportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grievora_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !report) {
    return (
      <div className="py-20 text-center space-y-2">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Calculating genuine database aggregations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Facility Reports & Resolution Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real data aggregation queries evaluated across all student and faculty tickets.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Time Range Selector */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                timeRange === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                timeRange === '30d'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                timeRange === '7d'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Received"
          value={report.totalReceived}
          icon={Calendar}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Total Resolved"
          value={report.totalResolved}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Open Tickets"
          value={report.totalOpen}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Rejected / Invalid"
          value={report.totalRejected}
          icon={AlertCircle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
        <StatCard
          title="Resolution Rate"
          value={`${report.resolutionRatePercentage}%`}
          subtitle="Resolved ÷ Total"
          icon={TrendingUp}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50"
        />
        <StatCard
          title="Avg. Resolution"
          value={`${report.averageResolutionTimeHours}h`}
          subtitle={`≈ ${report.averageResolutionTimeDays} days`}
          icon={Clock}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Recurring Hotspots and Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recurring Hotspot Areas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Recurring Campus Trouble Hotspots
            </h3>
            <span className="text-[11px] text-slate-400">By Building & Category</span>
          </div>
          <p className="text-xs text-slate-500">
            Identifies facilities requiring preventative infrastructure upgrades or vendor replacement.
          </p>

          <div className="space-y-3">
            {report.recurringIssueHotspots.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No recurring hotspots detected yet.
              </div>
            ) : (
              report.recurringIssueHotspots.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                      #{i + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">{h.building}</div>
                      <div className="text-[11px] text-slate-500">{h.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-indigo-700 text-sm">{h.count}</span>
                    <span className="text-[10px] text-slate-400 block">complaints</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Department Workload Efficiency */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">
            Department Workload Distribution
          </h3>
          <p className="text-xs text-slate-500">
            Breakdown of active and historical tickets routed to each maintenance team.
          </p>

          <div className="space-y-3">
            {Object.entries(report.departmentWorkload).map(([dept, count]) => {
              const pct = report.totalReceived > 0 ? (count / report.totalReceived) * 100 : 0;
              return (
                <div key={dept} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{dept}</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {count} ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Long Pending Tickets Review */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Long Pending Complaints Review</h3>
            <p className="text-xs text-slate-500">
              Complaints open for more than 3 days without final resolution
            </p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            {report.longPendingComplaints.length} overdue ticket{report.longPendingComplaints.length === 1 ? '' : 's'}
          </span>
        </div>

        {report.longPendingComplaints.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No long-pending tickets exceeding the 72-hour threshold. Excellent SLA compliance!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.longPendingComplaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectComplaint(c.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-700">
                      {c.complaintReference}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.building} ({c.location})
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint(c.id);
                        }}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                      >
                        Expedite →
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
