import React from 'react';
import {
  HelpCircle,
  Clock,
  Shield,
  FileCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Code2,
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Help, Support & Campus Service Level Agreements (SLA)
        </h1>
        <p className="text-xs text-slate-500">
          Understanding resolution timeframes, grievance escalation channels, and Java backend setup.
        </p>
      </div>

      {/* SLA Tiers */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Campus Complaint SLA Targets</span>
        </h3>
        <p className="text-xs text-slate-600">
          Our maintenance operations team adheres to prioritized response time standards:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="font-bold text-xs text-rose-800 uppercase">Urgent Priority</span>
            <div className="text-lg font-extrabold text-rose-900">Within 4 Hours</div>
            <p className="text-[11px] text-rose-700">Live safety hazards, gas leaks, power outages during exams.</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-xs text-amber-800 uppercase">High Priority</span>
            <div className="text-lg font-extrabold text-amber-900">Within 24 Hours</div>
            <p className="text-[11px] text-amber-700">Classroom smart boards, lab equipment, Wi-Fi outage in library.</p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
            <span className="font-bold text-xs text-indigo-800 uppercase">Medium Priority</span>
            <div className="text-lg font-extrabold text-indigo-900">Within 48 Hours</div>
            <p className="text-[11px] text-indigo-700">Damaged furniture, plumbing seepage, lighting fixtures.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
            <span className="font-bold text-xs text-slate-800 uppercase">Low Priority</span>
            <div className="text-lg font-extrabold text-slate-900">Within 72 Hours</div>
            <p className="text-[11px] text-slate-600">Cosmetic paint touchups, non-critical aesthetic requests.</p>
          </div>
        </div>
      </div>

      {/* College Project Architecture Guide */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Java 21 & Spring Boot 3 College Project Details</span>
          </h3>
        </div>

        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            <strong>GRIEVORA</strong> is developed as a complete full-stack Java college project.
            The complete Maven project source files are located under <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">/backend</code>:
          </p>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-2">
            <div className="text-slate-400"># Step 1: Create the MySQL Database</div>
            <div className="text-cyan-400">mysql -u root -p -e "CREATE DATABASE grievora_db;"</div>
            <div className="text-slate-400 pt-2"># Step 2: Run Unit & Integration Tests (JUnit 5 & Mockito)</div>
            <div className="text-emerald-400">cd backend && mvn clean test</div>
            <div className="text-slate-400 pt-2"># Step 3: Launch the Spring Boot Server</div>
            <div className="text-indigo-400">mvn spring-boot:run</div>
          </div>

          <p>
            Default pre-seeded accounts:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
            <li><strong>Admin:</strong> <code className="font-mono">admin@grievora.edu</code> / <code className="font-mono">Password@123</code></li>
            <li><strong>Faculty:</strong> <code className="font-mono">rajiv.menon@grievora.edu</code> / <code className="font-mono">Password@123</code></li>
            <li><strong>Student:</strong> <code className="font-mono">rakshana@grievora.edu</code> / <code className="font-mono">Password@123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
