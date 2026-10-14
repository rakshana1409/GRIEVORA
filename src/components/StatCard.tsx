import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  iconColor?: string;
  iconBg?: string;
  onClick?: () => void;
  active?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  iconColor = 'text-indigo-600',
  iconBg = 'bg-indigo-50',
  onClick,
  active = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-xl border bg-white shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''
      } ${active ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-200/80'}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
