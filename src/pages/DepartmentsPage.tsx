import React from 'react';
import { Department, Complaint } from '../types';
import {
  Building2,
  Mail,
  UserCheck,
  CheckCircle2,
  Clock,
  Layers,
  Wrench,
  Wifi,
  Shield,
  Sparkles,
  Droplets,
  Zap,
} from 'lucide-react';

interface DepartmentsPageProps {
  departments: Department[];
  complaints: Complaint[];
  onFilterByDepartment?: (deptId: number) => void;
}

const DEPT_ICONS: Record<string, React.ReactNode> = {
  'ELE-DEPT': <Zap className="w-5 h-5 text-amber-500" />,
  'PLUMB-DEPT': <Droplets className="w-5 h-5 text-cyan-500" />,
  'IT-DEPT': <Wifi className="w-5 h-5 text-indigo-500" />,
  'CIVIL-DEPT': <Wrench className="w-5 h-5 text-slate-600" />,
  'SAN-DEPT': <Sparkles className="w-5 h-5 text-emerald-500" />,
  'SEC-DEPT': <Shield className="w-5 h-5 text-rose-500" />,
};

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  departments,
  complaints,
  onFilterByDepartment,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Campus Maintenance & Infrastructure Departments
        </h1>
        <p className="text-xs text-slate-500">
          Directory of specialized campus operations units responsible for facility upkeep and SLA resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptComplaints = complaints.filter((c) => c.assignedDepartmentId === dept.id);
          const activeCount = deptComplaints.filter(
            (c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED'
          ).length;
          const resolvedCount = deptComplaints.filter((c) => c.status === 'RESOLVED').length;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {DEPT_ICONS[dept.code] || <Building2 className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {dept.code}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{dept.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Head: <strong>{dept.headOfDepartment}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${dept.contactEmail}`}
                      className="text-indigo-600 hover:underline truncate"
                    >
                      {dept.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-amber-700 font-semibold">
                    {activeCount} active
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-emerald-700 font-semibold">
                    {resolvedCount} resolved
                  </span>
                </div>
                {onFilterByDepartment && (
                  <button
                    onClick={() => onFilterByDepartment(dept.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View tickets →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
