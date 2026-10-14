import React from 'react';
import { ComplaintStatus } from '../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; dotClass: string; textClass: string; bgClass: string }
> = {
  SUBMITTED: {
    label: 'Submitted',
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-50/70 border-blue-200/60',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    dotClass: 'bg-indigo-500',
    textClass: 'text-indigo-700 dark:text-indigo-300',
    bgClass: 'bg-indigo-50/70 border-indigo-200/60',
  },
  ASSIGNED: {
    label: 'Assigned',
    dotClass: 'bg-purple-500',
    textClass: 'text-purple-700 dark:text-purple-300',
    bgClass: 'bg-purple-50/70 border-purple-200/60',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dotClass: 'bg-amber-500',
    textClass: 'text-amber-800 dark:text-amber-300',
    bgClass: 'bg-amber-50/70 border-amber-200/60',
  },
  RESOLVED: {
    label: 'Resolved',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-50/70 border-emerald-200/60',
  },
  REJECTED: {
    label: 'Rejected',
    dotClass: 'bg-rose-500',
    textClass: 'text-rose-700 dark:text-rose-300',
    bgClass: 'bg-rose-50/70 border-rose-200/60',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.SUBMITTED;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bgClass} ${config.textClass} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
