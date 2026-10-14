import React from 'react';
import { Notification } from '../types';
import { Bell, CheckCheck, Clock, ShieldAlert, Sparkles, X } from 'lucide-react';

interface NotificationPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onSelectComplaint?: (complaintId: number) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onSelectComplaint,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 top-12 z-50 w-84 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h4 className="font-semibold text-sm text-slate-800">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-indigo-100 text-indigo-700 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No notifications at the moment.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.isRead) onMarkRead(notif.id);
                if (notif.complaintId && onSelectComplaint) {
                  onSelectComplaint(notif.complaintId);
                  onClose();
                }
              }}
              className={`p-3.5 transition-colors cursor-pointer text-left ${
                notif.isRead ? 'bg-white hover:bg-slate-50/70' : 'bg-indigo-50/30 hover:bg-indigo-50/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                  )}
                  <h5 className="font-medium text-xs text-slate-900 leading-tight">
                    {notif.title}
                  </h5>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(notif.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
                {notif.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
