import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Complaint, StatusHistory, Comment, User } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ComplaintTimeline } from '../components/ComplaintTimeline';
import {
  ArrowLeft,
  RefreshCw,
  Building,
  MapPin,
  Calendar,
  User as UserIcon,
  Flame,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Send,
  FileCheck,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface ComplaintDetailPageProps {
  complaintId: number;
  currentUser: User;
  onBack: () => void;
  onAdminAction?: () => void;
}

export const ComplaintDetailPage: React.FC<ComplaintDetailPageProps> = ({
  complaintId,
  currentUser,
  onBack,
  onAdminAction,
}) => {
  const [data, setData] = useState<{
    complaint: Complaint;
    timeline: StatusHistory[];
    comments: Comment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = async () => {
    try {
      setError(null);
      const res = await api.getComplaintDetail(complaintId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [complaintId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDetails();
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setCommenting(true);
      await api.addComment(complaintId, commentText, 'PUBLIC');
      setCommentText('');
      await loadDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to post message.');
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Fetching live complaint records from backend...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <p className="text-sm font-semibold text-rose-600">{error || 'Complaint not found'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Complaints
        </button>
      </div>
    );
  }

  const { complaint, timeline, comments } = data;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {complaint.complaintReference}
              </span>
              <StatusBadge status={complaint.status} size="md" />
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {complaint.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>

          {currentUser.role === 'ADMIN' && onAdminAction && (
            <button
              onClick={onAdminAction}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Manage / Update Status
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complaint Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Problem Description
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100 font-normal">
                {complaint.description}
              </p>
            </div>

            {/* Urgency Justification Callout */}
            {complaint.priority === 'URGENT' && complaint.urgencyReason && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>Complainant's Urgency Justification</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed font-medium">
                  {complaint.urgencyReason}
                </p>
              </div>
            )}

            {/* Resolution Banner */}
            {complaint.status === 'RESOLVED' && complaint.resolutionNotes && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Administrative Resolution</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {complaint.resolutionNotes}
                </p>
                {complaint.resolvedAt && (
                  <div className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200/60">
                    Closed on: {new Date(complaint.resolvedAt).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {/* Rejection Banner */}
            {complaint.status === 'REJECTED' && complaint.rejectionReason && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Administrative Rejection Notice</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {complaint.rejectionReason}
                </p>
              </div>
            )}

            {/* Chronological Status Timeline */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Chronological Status Timeline</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {timeline.length} milestone{timeline.length === 1 ? '' : 's'}
                </span>
              </div>

              <ComplaintTimeline history={timeline} />
            </div>
          </div>

          {/* Interactive Discussion / Comment Dialogue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Ticket Communication & Updates
              </h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No comments yet. Send a query or update below.
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      comment.authorRole === 'ADMIN'
                        ? 'bg-indigo-50/50 border-indigo-200/70'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <span>{comment.authorName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono">
                          {comment.authorRole}
                        </span>
                        {comment.visibility === 'INTERNAL' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                            INTERNAL NOTE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {comment.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handlePostComment} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Post a message or inquiry regarding this ticket..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={commenting || !commentText.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                <span>{commenting ? 'Sending...' : 'Send'}</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Metadata & Department Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Location & Facility
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500">Building / Block</span>
                <p className="font-semibold text-slate-800 text-sm">{complaint.building}</p>
              </div>

              <div>
                <span className="text-slate-500">Room / Zone</span>
                <p className="font-medium text-slate-800">{complaint.floorOrRoom || 'Not specified'}</p>
              </div>

              <div>
                <span className="text-slate-500">Specific Location</span>
                <p className="font-medium text-slate-800">{complaint.location}</p>
              </div>

              <div>
                <span className="text-slate-500">Category</span>
                <p className="font-medium text-slate-800">{complaint.category}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Assignment & Handling
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-slate-500">Assigned Department</span>
                <p className="font-semibold text-indigo-700 text-sm">
                  {complaint.assignedDepartmentName || 'Pending Department Routing'}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Lead Technician / Staff</span>
                <p className="font-medium text-slate-800">
                  {complaint.assignedToName || 'Unassigned'}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Complainant</span>
                <p className="font-medium text-slate-800">{complaint.submittedByName}</p>
                <p className="text-[11px] text-slate-400 truncate">{complaint.submittedByEmail}</p>
              </div>

              <div>
                <span className="text-slate-500">Submission Date & Time</span>
                <p className="font-mono text-slate-700">
                  {new Date(complaint.submittedAt).toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Last System Update</span>
                <p className="font-mono text-slate-700">
                  {new Date(complaint.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
