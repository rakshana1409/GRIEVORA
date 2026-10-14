import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  BarChart2,
  Sparkles,
  Layers,
  Send,
  Building,
  GraduationCap,
  Flame,
  FileCheck,
} from 'lucide-react';
import { AdminDashboardMetrics } from '../types';

interface LandingPageProps {
  stats: AdminDashboardMetrics | null;
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreFeatures: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats,
  onGetStarted,
  onSignIn,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-cyan-500 flex items-center justify-center text-white shadow-xs">
              <span className="font-extrabold text-base">G</span>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                GRIEVORA
              </span>
              <span className="text-[10px] text-slate-500 block">Grievance + Aura</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#stats" className="hover:text-indigo-600 transition-colors">
              Campus Metrics
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-white via-slate-50 to-indigo-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Smart Campus Complaint Management System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            A Better Campus Starts With <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600">
              Being Heard.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            GRIEVORA bridges students, faculty, and administration. Report facility breakdowns,
            track repairs in real time with verifiable audit logs, and enjoy a smarter, safer campus.
          </p>

          <div className="text-sm font-semibold text-indigo-900 italic">
            “Your Voice. Our Campus. Better Together.”
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 group"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#workflow"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition-all"
            >
              Explore How It Works
            </a>
          </div>

          {/* Quick Metrics Strip (derived directly from database) */}
          <div id="stats" className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Complaints</span>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">
                {stats?.totalComplaints ?? 0}
              </div>
              <span className="text-[11px] text-slate-400">Database recorded</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Resolution Rate</span>
              <div className="text-2xl font-bold text-emerald-600 mt-0.5">
                {stats?.resolutionRatePercentage ?? 0}%
              </div>
              <span className="text-[11px] text-slate-400">Excludes rejected</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Avg. Resolution</span>
              <div className="text-2xl font-bold text-indigo-600 mt-0.5">
                {stats?.averageResolutionTimeHours ?? 0}h
              </div>
              <span className="text-[11px] text-slate-400">Hours to fix</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Active Maintenance</span>
              <div className="text-2xl font-bold text-amber-600 mt-0.5">
                {stats?.inProgressComplaints ?? 0}
              </div>
              <span className="text-[11px] text-slate-400">Teams deployed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Workflow Section */}
      <section id="workflow" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              The Transparent 4-Step Resolution Cycle
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Every reported ticket follows an unalterable lifecycle backed by Spring Security state
              machines and database timestamps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                1
              </div>
              <h3 className="font-semibold text-base text-slate-900">Submit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from 12 campus categories, pinpoint classroom/hostel location, attach evidence, and specify urgency.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                2
              </div>
              <h3 className="font-semibold text-base text-slate-900">Review & Assign</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Campus admin desk verifies the issue, adjusts priority, and assigns the responsible maintenance department and lead technician.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                3
              </div>
              <h3 className="font-semibold text-base text-slate-900">Resolve</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technicians execute on-site repairs. Mandatory resolution notes are entered and recorded before a ticket can close.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                4
              </div>
              <h3 className="font-semibold text-base text-slate-900">Improve</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Analytics engine tracks recurring facility failure points, highlighting infrastructure hot spots across campus blocks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Built for Fast, Accountable Campus Operations
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Everything students, faculty, and administrative heads need in one cohesive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
              <div className="p-3 w-fit rounded-xl bg-indigo-50 text-indigo-600">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Easy Complaint Submission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guided form with character count constraints, evidence attachments, room-level location mapping, and duplicate-submission protection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
              <div className="p-3 w-fit rounded-xl bg-cyan-50 text-cyan-600">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Transparent Status Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                End-to-end audit trail. Complainants see real-time state changes from Submitted to In Progress with technician notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
              <div className="p-3 w-fit rounded-xl bg-rose-50 text-rose-600">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Priority-Based Resolution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Urgent safety and exam-critical facility breakdowns are instantly flagged with justification checks and priority badges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
              <div className="p-3 w-fit rounded-xl bg-purple-50 text-purple-600">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">4. Centralized Administration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assign tasks to 6 distinct campus departments (Electrical, Plumbing, IT, Civil, Sanitation, Security) with SLA monitoring.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
              <div className="p-3 w-fit rounded-xl bg-emerald-50 text-emerald-600">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">5. Campus Issue Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Database-driven resolution rate metrics, average hours to fix, department workload breakdowns, and instant CSV exports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
              <div className="p-3 w-fit rounded-xl bg-amber-50 text-amber-600">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Java Spring Boot 3 Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full Java 21 backend with Spring Security role enforcement, Jakarta Bean Validation, JPA repositories, and MySQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-white text-base">GRIEVORA</span>
              <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono">
                Smart Campus System
              </span>
            </div>
            <p className="text-slate-500">
              “Your Voice. Our Campus. Better Together.” — College Java Full-Stack Project.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              Workflow
            </a>
            <span className="text-slate-600">·</span>
            <span>MySQL 8.0 & Spring Boot 3</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
