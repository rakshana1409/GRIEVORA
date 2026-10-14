/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from './api/client';
import {
  User,
  Role,
  Complaint,
  Notification,
  Department,
  AdminDashboardMetrics,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, NavView } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { SubmitComplaintPage } from './pages/SubmitComplaintPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { AdminOverviewPage } from './pages/AdminOverviewPage';
import { AdminComplaintsPage } from './pages/AdminComplaintsPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<
    NavView | 'landing' | 'login' | 'register' | 'complaint_detail' | 'reset_password'
  >('landing');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminMetrics, setAdminMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize Data
  const refreshAllData = async () => {
    try {
      const user = await api.getCurrentUser();
      setCurrentUser(user);

      const depts = await api.getDepartments();
      setDepartments(depts);

      const allC = await api.getAllComplaints();
      setComplaints(allC);

      const notifs = await api.getNotifications();
      setNotifications(notifs);

      const metrics = await api.getAdminDashboard();
      setAdminMetrics(metrics);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleRoleSwitch = async (role: Role) => {
    try {
      const user = await api.switchDemoUser(role);
      setCurrentUser(user);
      const notifs = await api.getNotifications();
      setNotifications(notifs);

      if (role === 'ADMIN') {
        setCurrentView('admin_overview');
      } else {
        setCurrentView('user_overview');
      }
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleSelectComplaint = (id: number) => {
    setSelectedComplaintId(id);
    setCurrentView('complaint_detail');
  };

  const handleComplaintSubmitted = (newComplaint: Complaint) => {
    setSelectedComplaintId(newComplaint.id);
    setCurrentView('complaint_detail');
    refreshAllData();
  };

  const handleMarkNotificationRead = async (id: number) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <h2 className="font-extrabold text-lg tracking-wider">GRIEVORA</h2>
          <p className="text-xs text-slate-400">Loading Smart Campus Platform...</p>
        </div>
      </div>
    );
  }

  // Standalone Public Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        stats={adminMetrics}
        onGetStarted={() => {
          if (currentUser) {
            setCurrentView(currentUser.role === 'ADMIN' ? 'admin_overview' : 'user_overview');
          } else {
            setCurrentView('register');
          }
        }}
        onSignIn={() => setCurrentView('login')}
        onExploreFeatures={() => {
          if (currentUser) {
            setCurrentView(currentUser.role === 'ADMIN' ? 'admin_overview' : 'user_overview');
          } else {
            setCurrentView('login');
          }
        }}
      />
    );
  }

  // Standalone Login Page
  if (currentView === 'login') {
    return (
      <LoginPage
        onSuccess={(user) => {
          setCurrentUser(user);
          refreshAllData();
          setCurrentView(user.role === 'ADMIN' ? 'admin_overview' : 'user_overview');
        }}
        onGoToRegister={() => setCurrentView('register')}
        onGoToLanding={() => setCurrentView('landing')}
        onGoToResetPassword={() => setCurrentView('reset_password')}
      />
    );
  }

  // Standalone Reset Password Page
  if (currentView === 'reset_password') {
    return (
      <ResetPasswordPage
        onGoToLogin={() => setCurrentView('login')}
        onGoToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // Standalone Register Page
  if (currentView === 'register') {
    return (
      <RegisterPage
        onSuccess={(user) => {
          setCurrentUser(user);
          refreshAllData();
          setCurrentView('user_overview');
        }}
        onGoToLogin={() => setCurrentView('login')}
        onGoToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // Authenticated Layout (User & Admin Portals)
  const userComplaints = complaints.filter(
    (c) => c.submittedById === currentUser?.id
  );

  const urgentCount = complaints.filter(
    (c) => c.priority === 'URGENT' && c.status !== 'RESOLVED' && c.status !== 'REJECTED'
  ).length;

  const newCount = complaints.filter(
    (c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Universal Navbar with Quick Role Switcher */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentUser?.role || 'STUDENT'}
        notifications={notifications}
        onSwitchRole={handleRoleSwitch}
        onLogout={handleLogout}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onSelectComplaint={handleSelectComplaint}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigateHome={() => setCurrentView('landing')}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            currentView={currentView as NavView}
            onSelectView={(v) => {
              setCurrentView(v);
            }}
            currentRole={currentUser?.role || 'STUDENT'}
            urgentCount={urgentCount}
            newCount={newCount}
          />
        </div>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative w-64 bg-white h-full z-10 shadow-2xl">
              <Sidebar
                currentView={currentView as NavView}
                onSelectView={(v) => {
                  setCurrentView(v);
                  setSidebarOpen(false);
                }}
                currentRole={currentUser?.role || 'STUDENT'}
                urgentCount={urgentCount}
                newCount={newCount}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* USER PORTAL VIEWS */}
          {currentView === 'user_overview' && currentUser && (
            <UserDashboard
              currentUser={currentUser}
              complaints={userComplaints}
              onSubmitNew={() => setCurrentView('user_submit')}
              onViewAll={() => setCurrentView('user_my_complaints')}
              onSelectComplaint={handleSelectComplaint}
            />
          )}

          {currentView === 'user_submit' && (
            <SubmitComplaintPage
              onSuccess={handleComplaintSubmitted}
              onCancel={() => setCurrentView('user_overview')}
            />
          )}

          {currentView === 'user_my_complaints' && (
            <MyComplaintsPage
              complaints={userComplaints}
              onSelectComplaint={handleSelectComplaint}
              onSubmitNew={() => setCurrentView('user_submit')}
            />
          )}

          {/* ADMIN PORTAL VIEWS */}
          {currentView === 'admin_overview' && adminMetrics && (
            <AdminOverviewPage
              metrics={adminMetrics}
              onNavigateComplaints={(filter) => {
                setCurrentView(filter === 'URGENT' ? 'admin_urgent' : 'admin_all_complaints');
              }}
              onSelectComplaint={handleSelectComplaint}
            />
          )}

          {currentView === 'admin_all_complaints' && (
            <AdminComplaintsPage
              complaints={complaints}
              departments={departments}
              users={allUsers}
              onRefresh={refreshAllData}
              onSelectComplaint={handleSelectComplaint}
            />
          )}

          {currentView === 'admin_urgent' && (
            <AdminComplaintsPage
              complaints={complaints}
              departments={departments}
              users={allUsers}
              initialFilter="URGENT"
              onRefresh={refreshAllData}
              onSelectComplaint={handleSelectComplaint}
            />
          )}

          {currentView === 'admin_pending' && (
            <AdminComplaintsPage
              complaints={complaints}
              departments={departments}
              users={allUsers}
              initialFilter="SUBMITTED"
              onRefresh={refreshAllData}
              onSelectComplaint={handleSelectComplaint}
            />
          )}

          {currentView === 'admin_reports' && (
            <AdminReportsPage onSelectComplaint={handleSelectComplaint} />
          )}

          {/* COMPLAINT DETAIL & TRACKING VIEW */}
          {currentView === 'complaint_detail' && selectedComplaintId && currentUser && (
            <ComplaintDetailPage
              complaintId={selectedComplaintId}
              currentUser={currentUser}
              onBack={() => {
                if (currentUser.role === 'ADMIN') {
                  setCurrentView('admin_all_complaints');
                } else {
                  setCurrentView('user_my_complaints');
                }
              }}
              onAdminAction={() => setCurrentView('admin_all_complaints')}
            />
          )}

          {/* SHARED DIRECTORY & SUPPORT */}
          {currentView === 'departments' && (
            <DepartmentsPage
              departments={departments}
              complaints={complaints}
            />
          )}

          {currentView === 'help_support' && (
            <HelpSupportPage />
          )}
        </main>
      </div>
    </div>
  );
}
