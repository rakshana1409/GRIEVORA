import React from 'react';
import { ComplaintPriority } from '../types';
import { AlertCircle, AlertTriangle, ArrowUpRight, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'URGENT':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
          <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Urgent</span>
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>High</span>
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
          <ArrowUpRight className="w-3 h-3 text-slate-500" />
          <span>Medium</span>
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
          <span>Low</span>
        </span>
      );
  }
};
