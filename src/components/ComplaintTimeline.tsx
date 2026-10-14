import React from 'react';
import { StatusHistory } from '../types';
import { StatusBadge } from './StatusBadge';
import { CheckCircle2, Clock, UserCheck } from 'lucide-react';

interface ComplaintTimelineProps {
  history: StatusHistory[];
}

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-slate-500">
        No status transitions recorded yet.
      </div>
    );
  }

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {history.map((step, idx) => {
        const isLatest = idx === history.length - 1;
        return (
          <div key={step.id || idx} className="relative group">
            {/* Step node dot */}
            <div
              className={`absolute -left-[27px] top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                isLatest
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isLatest ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-500" />
              )}
            </div>

            {/* Content card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={step.newStatus} />
                  {step.previousStatus && (
                    <span className="text-xs text-slate-400">
                      (from {step.previousStatus})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formatDate(step.changedAt)}</span>
                </div>
              </div>

              <p className="text-sm text-slate-800 font-normal leading-relaxed">
                {step.publicMessage}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Updated by: <strong className="font-medium text-slate-700">{step.changedByName}</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
