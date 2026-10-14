import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus, ComplaintPriority, COMPLAINT_CATEGORIES } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  FileText,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MyComplaintsPageProps {
  complaints: Complaint[];
  onSelectComplaint: (id: number) => void;
  onSubmitNew: () => void;
}

export const MyComplaintsPage: React.FC<MyComplaintsPageProps> = ({
  complaints,
  onSelectComplaint,
  onSubmitNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const STATUS_TABS: Array<{ id: string; label: string }> = [
    { id: 'ALL', label: 'All' },
    { id: 'SUBMITTED', label: 'Submitted' },
    { id: 'UNDER_REVIEW', label: 'Under Review' },
    { id: 'ASSIGNED', label: 'Assigned' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
    { id: 'REJECTED', label: 'Rejected' },
  ];

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = c.complaintReference.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesLoc = c.location.toLowerCase().includes(q) || c.building.toLowerCase().includes(q);
        if (!matchesRef && !matchesTitle && !matchesLoc) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

      // Priority
      if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;

      // Category
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        const diff = new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        return sortOrder === 'asc' ? -diff : diff;
      }
      if (sortBy === 'priority') {
        const orderMap: Record<ComplaintPriority, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        const diff = orderMap[b.priority] - orderMap[a.priority];
        return sortOrder === 'asc' ? -diff : diff;
      }
      return 0;
    });
  }, [complaints, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredComplaints.length / pageSize) || 1;
  const paginated = filteredComplaints.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Campus Complaints
          </h1>
          <p className="text-xs text-slate-500">
            View status, resolution updates, and communication history for your tickets.
          </p>
        </div>
        <button
          onClick={onSubmitNew}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Status Segmented Control (Zero-Pill compliant button tab controls) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 p-1 bg-slate-100 rounded-xl max-w-full">
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.id;
          const count =
            tab.id === 'ALL'
              ? complaints.length
              : complaints.filter((c) => c.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg shrink-0 transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] ${isActive ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by reference code, title, or location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="ALL">All Categories</option>
            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Sort By */}
          <button
            onClick={() => {
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {paginated.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No matching complaints found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try clearing search filters or log a new campus maintenance complaint.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="px-3 py-1.5 text-xs text-indigo-600 font-semibold border border-indigo-200 rounded-lg hover:bg-indigo-50"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Complaint Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((c) => (
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
                    <td className="py-3.5 px-4 text-slate-600">
                      {c.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{c.building}</div>
                      <div className="text-[10px] text-slate-400">{c.floorOrRoom || c.location}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(c.submittedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectComplaint(c.id);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredComplaints.length)} of{' '}
              {filteredComplaints.length} tickets
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
