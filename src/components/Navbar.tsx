import React, { useState } from 'react';
import { User, Role, Notification } from '../types';
import {
  Bell,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';

interface NavbarProps {
  currentUser: User | null;
  currentRole: Role;
  notifications: Notification[];
  onSwitchRole?: (role: Role) => void;
  onLogout: () => void;
  onMarkNotificationRead: (id: number) => void;
  onMarkAllNotificationsRead: () => void;
  onSelectComplaint?: (complaintId: number) => void;
  onToggleSidebar?: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  notifications,
  onSwitchRole,
  onLogout,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSelectComplaint,
  onToggleSidebar,
  onNavigateHome,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Brand Logo */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-cyan-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-base tracking-tighter">G</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  GRIEVORA
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                  Campus
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block tracking-wide">
                Grievance + Aura · Smart Resolution
              </p>
            </div>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">


          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            <NotificationPanel
              notifications={notifications}
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              onMarkRead={onMarkNotificationRead}
              onMarkAllRead={onMarkAllNotificationsRead}
              onSelectComplaint={onSelectComplaint}
            />
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {currentUser?.role || 'STUDENT'} · {currentUser?.institutionalId || 'ID'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 z-50 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">{currentUser?.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {currentUser?.role} · ID: {currentUser?.institutionalId}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
