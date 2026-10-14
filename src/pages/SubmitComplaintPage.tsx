import React, { useState } from 'react';
import { api } from '../api/client';
import { Complaint, ComplaintPriority, COMPLAINT_CATEGORIES } from '../types';
import {
  Send,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  Building,
  MapPin,
  Flame,
  Info,
  X,
  Copy,
  Check,
  ArrowRight,
  FileText,
} from 'lucide-react';

interface SubmitComplaintPageProps {
  onSuccess: (complaint: Complaint, destination?: 'my_complaints' | 'detail') => void;
  onCancel: () => void;
}

export const SubmitComplaintPage: React.FC<SubmitComplaintPageProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(COMPLAINT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [building, setBuilding] = useState('');
  const [floorOrRoom, setFloorOrRoom] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('MEDIUM');
  const [urgencyReason, setUrgencyReason] = useState('');

  // Simulated file upload
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const maxBytes = 10 * 1024 * 1024; // 10MB

    if (file.size > maxBytes) {
      setFileError('File size exceeds the 10MB maximum limit.');
      return;
    }

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    setAttachedFiles((prev) => [...prev, { name: file.name, size: sizeStr }]);
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const copyReference = () => {
    if (!submittedComplaint) return;
    navigator.clipboard.writeText(submittedComplaint.complaintReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (description.trim().length < 20) {
      setError('Description must provide at least 20 characters of detail.');
      return;
    }
    if (priority === 'URGENT' && urgencyReason.trim().length < 10) {
      setError('Please provide at least 10 characters explaining why this issue is Urgent.');
      return;
    }

    try {
      setLoading(true);
      const newComplaint = await api.submitComplaint({
        title,
        category,
        description,
        location,
        building,
        floorOrRoom,
        priority,
        urgencyReason: priority === 'URGENT' ? urgencyReason : undefined,
      });

      setSubmittedComplaint(newComplaint);
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint.');
      setLoading(false);
    }
  };

  if (submittedComplaint) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Complaint Successfully Submitted!
            </h2>
            <p className="text-xs text-slate-500">
              Your ticket has been recorded in MySQL database and assigned to the campus workflow.
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Complaint Reference ID
              </div>
              <div className="font-mono text-lg font-extrabold text-indigo-950">
                {submittedComplaint.complaintReference}
              </div>
            </div>
            <button
              onClick={copyReference}
              className="px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Details Overview */}
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-left space-y-2 border border-slate-200/60">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Initial Status:</span>
              <span className="font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded font-mono">
                {submittedComplaint.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Title:</span>
              <span className="font-semibold text-slate-800 text-right truncate max-w-[240px]">
                {submittedComplaint.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Category:</span>
              <span className="text-slate-700">{submittedComplaint.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Location:</span>
              <span className="text-slate-700">{submittedComplaint.building} · {submittedComplaint.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Priority:</span>
              <span className={`font-bold ${
                submittedComplaint.priority === 'URGENT' ? 'text-rose-600' :
                submittedComplaint.priority === 'HIGH' ? 'text-amber-600' : 'text-slate-700'
              }`}>
                {submittedComplaint.priority}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onSuccess(submittedComplaint, 'my_complaints')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>View in My Complaints</span>
            </button>
            <button
              onClick={() => onSuccess(submittedComplaint, 'detail')}
              className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Track Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Submit a Campus Facility Complaint
          </h1>
          <p className="text-xs text-slate-500">
            All reports are automatically indexed and routed to the corresponding department.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Submission Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Category & Title */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              1. Issue Classification
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complaint Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Complaint Title *
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {title.length}/200
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                placeholder="e.g. Science Block 3rd Floor Water Purifier Leaking"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Provide a short, specific summary identifying the breakdown or hazard.
              </p>
            </div>
          </div>

          {/* Section: Location Mapping */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              2. Campus Location Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Building or Block *
                </label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="e.g. Academic Block B, Central Library, Hostel C"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Floor or Room / Lab Number
                </label>
                <input
                  type="text"
                  value={floorOrRoom}
                  onChange={(e) => setFloorOrRoom(e.target.value)}
                  placeholder="e.g. Room 402, 4th Floor or Chemistry Lab 2"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Location Landmark or Zone *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. West Wing corridor, right next to elevator entrance"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section: Priority & Urgency */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              3. Priority & Urgency
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Priority Assessment *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as ComplaintPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? p === 'URGENT'
                            ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-200'
                            : 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p === 'URGENT' && <Flame className="w-4 h-4 text-rose-500" />}
                      <span>{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {priority === 'URGENT' && (
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>Mandatory Urgency Justification</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  Urgent tickets immediately notify all administrators. Please explain the safety risk,
                  imminent exam disruption, or structural hazard.
                </p>
                <textarea
                  value={urgencyReason}
                  onChange={(e) => setUrgencyReason(e.target.value)}
                  rows={2}
                  required
                  placeholder="e.g. Live exposed wires in corridor posing electrical shock risk to walking students."
                  className="w-full p-2.5 text-xs border border-rose-300 rounded-lg bg-white focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          {/* Section: Description & Attachment */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              4. Issue Description & Evidence
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Detailed Description *
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {description.length}/2500 (min 20)
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                minLength={20}
                maxLength={2500}
                placeholder="Provide comprehensive details: what is broken, when it started, how many individuals are impacted, and any temporary safety measures taken."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            {/* Optional Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Photo or Supporting Document (Optional, Max 10MB)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-colors">
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-indigo-600">
                  Click to select file
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, or PDF (up to 10MB)
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {fileError && (
                <p className="text-xs text-rose-600 mt-1">{fileError}</p>
              )}

              {attachedFiles.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {attachedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-medium truncate">{f.name}</span>
                        <span className="text-[10px] text-indigo-600 font-mono">
                          ({f.size})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submission CTA */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Registering Ticket...' : 'Submit Complaint'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
