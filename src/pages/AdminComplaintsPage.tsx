import React, { useState, useMemo } from 'react';
import {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  Department,
  User,
  COMPLAINT_CATEGORIES,
} from '../types';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  XCircle,
  UserCheck,
  Flame,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
  FileCheck,
} from 'lucide-react';

interface AdminComplaintsPageProps {
  complaints: Complaint[];
  departments: Department[];
  users: User[];
  initialFilter?: string;
  onRefresh: () => void;
  onSelectComplaint: (id: number) => void;
}

export const AdminComplaintsPage: React.FC<AdminComplaintsPageProps> = ({
  complaints,
  departments,
  users,
  initialFilter,
  onRefresh,
  onSelectComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter || 'ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>(
    initialFilter === 'URGENT' ? 'URGENT' : 'ALL'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Active Complaint Action Modal State
  const [actionComplaint, setActionComplaint] = useState<Complaint | null>(null);
  const [actionTab, setActionTab] = useState<'status' | 'assign' | 'priority' | 'resolve' | 'reject'>('status');

  // Form states inside modal
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('UNDER_REVIEW');
  const [statusMessage, setStatusMessage] = useState('');
  const [newPriority, setNewPriority] = useState<ComplaintPriority>('HIGH');
  const [priorityReason, setPriorityReason] = useState('');
  const [assignedDeptId, setAssignedDeptId] = useState<number | undefined>(undefined);
  const [assignedStaffId, setAssignedStaffId] = useState<number | undefined>(undefined);
  const [assignmentNote, setAssignmentNote] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const openActionModal = (c: Complaint, defaultTab: 'status' | 'assign' | 'priority' | 'resolve' | 'reject' = 'status') => {
    setActionComplaint(c);
    setActionTab(defaultTab);

    // Determine default next valid status
    if (c.status === 'SUBMITTED') {
      setNewStatus('UNDER_REVIEW');
    } else if (c.status === 'UNDER_REVIEW') {
      setNewStatus('ASSIGNED');
    } else if (c.status === 'ASSIGNED') {
      setNewStatus('IN_PROGRESS');
    } else if (c.status === 'IN_PROGRESS') {
      setNewStatus('RESOLVED');
    } else {
      setNewStatus(c.status);
    }

    setStatusMessage('');
    setNewPriority(c.priority);
    setPriorityReason('');
    setAssignedDeptId(c.assignedDepartmentId || (departments[0]?.id));
    setAssignedStaffId(c.assignedToId);
    setAssignmentNote('');
    setResolutionNotes('');
    setRejectionReason('');
    setModalError(null);
  };

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionComplaint) return;
    setModalError(null);

    try {
      setModalLoading(true);

      if (actionTab === 'status') {
        if (!statusMessage.trim()) throw new Error('Status update message is required.');
        await api.updateComplaintStatus(actionComplaint.id, newStatus, statusMessage);
        setSuccessToast(`Ticket ${actionComplaint.complaintReference} status updated to ${newStatus.replace('_', ' ')}. Notification dispatched.`);
      } else if (actionTab === 'priority') {
        await api.updatePriority(actionComplaint.id, newPriority, priorityReason);
        setSuccessToast(`Ticket ${actionComplaint.complaintReference} priority adjusted to ${newPriority}.`);
      } else if (actionTab === 'assign') {
        await api.updateAssignment(actionComplaint.id, assignedDeptId, assignedStaffId, assignmentNote);
        setSuccessToast(`Ticket ${actionComplaint.complaintReference} assignment dispatched.`);
      } else if (actionTab === 'resolve') {
        if (resolutionNotes.trim().length < 10) {
          throw new Error('Resolution notes must be at least 10 characters.');
        }
        await api.resolveComplaint(actionComplaint.id, resolutionNotes);
        setSuccessToast(`Ticket ${actionComplaint.complaintReference} marked as Resolved. Complainant notified.`);
      } else if (actionTab === 'reject') {
        if (rejectionReason.trim().length < 10) {
          throw new Error('Rejection reason must be at least 10 characters.');
        }
        await api.rejectComplaint(actionComplaint.id, rejectionReason);
        setSuccessToast(`Ticket ${actionComplaint.complaintReference} marked as Rejected.`);
      }

      setActionComplaint(null);
      onRefresh();
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err: any) {
      setModalError(err.message || 'Operation failed.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleExportCsv = () => {
    const csvContent = api.exportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grievora_campus_complaints_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mRef = c.complaintReference.toLowerCase().includes(q);
        const mTitle = c.title.toLowerCase().includes(q);
        const mUser = c.submittedByName.toLowerCase().includes(q);
        const mLoc = c.building.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
        if (!mRef && !mTitle && !mUser && !mLoc) return false;
      }

      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
      if (departmentFilter !== 'ALL') {
        const deptId = Number(departmentFilter);
        if (c.assignedDepartmentId !== deptId) return false;
      }

      return true;
    });
  }, [complaints, searchQuery, statusFilter, priorityFilter, categoryFilter, departmentFilter]);

  const totalPages = Math.ceil(filteredComplaints.length / pageSize) || 1;
  const paginated = filteredComplaints.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Page Title & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            All Campus Complaints Management
          </h1>
          <p className="text-xs text-slate-500">
            Search, triage, assign departments, and enforce state transitions for all tickets.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, title, student name, building..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>

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

            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 max-w-[160px]"
            >
              <option value="ALL">All Categories</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || departmentFilter !== 'ALL' || categoryFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                  setDepartmentFilter('ALL');
                  setCategoryFilter('ALL');
                }}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {paginated.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No complaints matched your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Complaint Title</th>
                  <th className="py-3 px-4">Complainant</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Dept</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
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
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-400">{c.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{c.submittedByName}</div>
                      <div className="text-[10px] text-slate-400">{c.submittedByEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{c.building}</div>
                      <div className="text-[10px] text-slate-400">{c.floorOrRoom || c.location}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium truncate max-w-[140px]">
                        {c.assignedDepartmentName || (
                          <span className="text-amber-600 font-semibold italic">Unassigned</span>
                        )}
                      </div>
                      {c.assignedToName && (
                        <div className="text-[10px] text-slate-400">{c.assignedToName}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="inline-flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openActionModal(c, 'status')}
                          className="px-2 py-1 text-xs font-semibold rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                        >
                          Status
                        </button>
                        <button
                          onClick={() => openActionModal(c, 'assign')}
                          className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          Assign
                        </button>
                        {c.status !== 'RESOLVED' && (
                          <button
                            onClick={() => openActionModal(c, 'resolve')}
                            className="px-2 py-1 text-xs font-semibold rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
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

      {/* Admin Action Modal */}
      {actionComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {actionComplaint.complaintReference}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1 truncate max-w-md">
                  {actionComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setActionComplaint(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Segment Tabs */}
            <div className="flex border-b border-slate-200 px-6 pt-3 gap-2 bg-slate-50/30 overflow-x-auto">
              <button
                onClick={() => setActionTab('status')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  actionTab === 'status'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Update Status
              </button>
              <button
                onClick={() => setActionTab('assign')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  actionTab === 'assign'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Assign Department
              </button>
              <button
                onClick={() => setActionTab('priority')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  actionTab === 'priority'
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Priority
              </button>
              <button
                onClick={() => setActionTab('resolve')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  actionTab === 'resolve'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Mark Resolved
              </button>
              <button
                onClick={() => setActionTab('reject')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  actionTab === 'reject'
                    ? 'border-rose-600 text-rose-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Reject Ticket
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleExecuteAction} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {modalError}
                </div>
              )}

              {/* Tab: Status */}
              {actionTab === 'status' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Status State *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Public Update Message for Complainant *
                    </label>
                    <textarea
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      rows={3}
                      required
                      placeholder="e.g. Electrical crew inspected the classroom projector; technician will arrive tomorrow morning with replacement HDMI card."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Assign */}
              {actionTab === 'assign' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Maintenance Department *
                    </label>
                    <select
                      value={assignedDeptId}
                      onChange={(e) => setAssignedDeptId(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lead Staff / Technician
                    </label>
                    <select
                      value={assignedStaffId || ''}
                      onChange={(e) => setAssignedStaffId(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">Unassigned (General Department Queue)</option>
                      {users
                        .filter((u) => u.role === 'ADMIN')
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.fullName} ({u.institutionalId})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Assignment Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={assignmentNote}
                      onChange={(e) => setAssignmentNote(e.target.value)}
                      placeholder="e.g. High priority repair before semester exams."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Priority */}
              {actionTab === 'priority' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Adjust Priority Level *
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as ComplaintPriority)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Priority Change Rationale
                    </label>
                    <input
                      type="text"
                      value={priorityReason}
                      onChange={(e) => setPriorityReason(e.target.value)}
                      placeholder="e.g. Escalated due to classroom schedule conflict."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Resolve */}
              {actionTab === 'resolve' && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs">
                    Please provide comprehensive resolution notes explaining what actions were taken.
                    This information will be displayed permanently on the complainant’s tracking record.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Resolution Notes & Action Taken * (min 10 chars)
                    </label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      rows={3}
                      required
                      minLength={10}
                      placeholder="e.g. Technician replaced the leaking valve seal and pressure tested the water line. Restroom area sanitized and cleared for student use."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Reject */}
              {actionTab === 'reject' && (
                <div className="space-y-3">
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-rose-800 text-xs">
                    Rejecting a complaint marks it as invalid, duplicate, or out of campus scope.
                    A clear reason is mandatory to maintain transparency.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mandatory Rejection Reason * (min 10 chars)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      required
                      minLength={10}
                      placeholder="e.g. Duplicate report of ticket GRV-2026-0003, which is currently already assigned and under repair."
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionComplaint(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className={`px-4 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors ${
                    actionTab === 'resolve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : actionTab === 'reject'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {modalLoading ? 'Executing...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
