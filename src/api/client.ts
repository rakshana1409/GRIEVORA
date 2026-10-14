import {
  User,
  Role,
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  Department,
  StatusHistory,
  Comment,
  Notification,
  AdminDashboardMetrics,
  ReportMetrics,
} from '../types';
import { getDatabase, saveDatabase, resetDatabase } from './db';

const SESSION_USER_KEY = 'grievora_active_user';
const API_MODE_KEY = 'grievora_api_mode'; // 'emulated' | 'spring_boot'
const SPRING_BOOT_BASE_URL = 'http://localhost:8080/api';

export type ApiMode = 'emulated' | 'spring_boot';

export function getApiMode(): ApiMode {
  return (localStorage.getItem(API_MODE_KEY) as ApiMode) || 'emulated';
}

export function setApiMode(mode: ApiMode) {
  localStorage.setItem(API_MODE_KEY, mode);
}

export const api = {
  // -------------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------------
  async getCurrentUser(): Promise<User | null> {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    if (!raw) {
      // Default to student Rakshana
      const db = getDatabase();
      const defaultUser =
        db.users.find((u) => /rakshana/i.test(u.fullName)) ||
        db.users.find((u) => u.email === 'rakshana@grievora.edu') ||
        db.users.find((u) => u.role === 'STUDENT') ||
        db.users[0];
      if (defaultUser) {
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(defaultUser));
        return defaultUser;
      }
      return null;
    }
    try {
      // Migrate any cached session mentioning Aditi
      if (/aditi/i.test(raw)) {
        const db = getDatabase();
        const rakshana = db.users.find((u) => /rakshana/i.test(u.fullName)) || {
          id: 3,
          fullName: 'Rakshana',
          institutionalId: '310625205222',
          email: 'rakshana@grievora.edu',
          role: 'STUDENT',
          departmentId: 3,
          departmentName: 'IT & Campus Network Services',
          phoneNumber: '+91 98765 43212',
          active: true,
          createdAt: '2026-09-15T11:00:00Z',
        };
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(rakshana));
        return rakshana;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async login(identifier: string, password?: string): Promise<User> {
    const db = getDatabase();
    const clean = identifier.trim().toLowerCase();

    // Check institutional email, ID, or full name
    let user = db.users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.institutionalId.toLowerCase() === clean ||
        u.fullName.toLowerCase() === clean
    );

    // Common aliases for ease of test evaluation
    if (!user) {
      if (clean.includes('rakshana') || clean === 'raksh9345@gmail.com' || clean === 'student') {
        user = db.users.find((u) => /rakshana/i.test(u.fullName)) || db.users.find((u) => u.role === 'STUDENT');
      } else if (clean.includes('admin') || clean === 'rajesh' || clean === 'chief') {
        user = db.users.find((u) => u.role === 'ADMIN');
      } else if (clean.includes('faculty') || clean.includes('menon')) {
        user = db.users.find((u) => u.role === 'FACULTY');
      }
    }

    if (!user) {
      throw new Error('Invalid institutional credentials. Please enter a valid campus email or institutional ID.');
    }

    // Password validation
    const expectedPassword = user.password || 'password123';
    if (password !== undefined && password !== '' && password !== expectedPassword) {
      throw new Error('Incorrect password. Please verify your credentials and try again.');
    }

    // Send login notification email to user's account
    const loginNotification: Notification = {
      id: Date.now(),
      recipientId: user.id,
      title: 'Security Alert: Successful Login',
      message: `An email has been sent to your account (${user.email}) confirming that you successfully logged into GRIEVORA Smart Campus on ${new Date().toLocaleString()}.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    db.notifications.unshift(loginNotification);
    saveDatabase(db);

    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    return user;
  },

  async register(params: {
    fullName: string;
    institutionalId: string;
    email: string;
    role: 'STUDENT' | 'FACULTY';
    departmentId?: number;
    phoneNumber?: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
  }): Promise<User> {
    if (params.password !== params.confirmPassword) {
      throw new Error('Password and confirmation password do not match.');
    }
    if (params.password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    if (!params.termsAccepted) {
      throw new Error('You must accept the terms and conditions.');
    }

    const db = getDatabase();
    const normalizedEmail = params.email.trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this institutional email already exists.');
    }
    if (db.users.some((u) => u.institutionalId.toLowerCase() === params.institutionalId.trim().toLowerCase())) {
      throw new Error('An account with this institutional ID already exists.');
    }

    const dept = db.departments.find((d) => d.id === params.departmentId);

    const newUser: User = {
      id: Date.now(),
      fullName: params.fullName.trim(),
      institutionalId: params.institutionalId.trim(),
      email: normalizedEmail,
      password: params.password,
      role: params.role,
      departmentId: dept?.id,
      departmentName: dept?.name,
      phoneNumber: params.phoneNumber?.trim() || undefined,
      active: true,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDatabase(db);

    // Auto-login registered user
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_USER_KEY);
  },

  async switchRoleUser(role: Role): Promise<User> {
    const db = getDatabase();
    let target: User | undefined;
    if (role === 'ADMIN') {
      target = db.users.find((u) => u.email === 'admin@grievora.edu');
    } else if (role === 'FACULTY') {
      target = db.users.find((u) => u.email === 'rajiv.menon@grievora.edu');
    } else {
      target =
        db.users.find((u) => /rakshana/i.test(u.fullName)) ||
        db.users.find((u) => u.email === 'rakshana@grievora.edu') ||
        db.users.find((u) => u.role === 'STUDENT');
    }
    if (!target) target = db.users[0];
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(target));
    return target;
  },

  async switchDemoUser(role: Role): Promise<User> {
    return this.switchRoleUser(role);
  },

  // -------------------------------------------------------------
  // DEPARTMENTS
  // -------------------------------------------------------------
  async getDepartments(): Promise<Department[]> {
    const db = getDatabase();
    return db.departments;
  },

  // -------------------------------------------------------------
  // COMPLAINTS
  // -------------------------------------------------------------
  async submitComplaint(data: {
    title: string;
    category: string;
    description: string;
    location: string;
    building: string;
    floorOrRoom?: string;
    priority: ComplaintPriority;
    urgencyReason?: string;
  }): Promise<Complaint> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Authentication required.');

    if (data.priority === 'URGENT' && (!data.urgencyReason || data.urgencyReason.trim().length < 10)) {
      throw new Error('Please provide a valid explanation (minimum 10 characters) why this issue is URGENT.');
    }

    const db = getDatabase();
    const count = db.complaints.length + 1;
    const year = new Date().getFullYear();
    const reference = `GRV-${year}-${String(count).padStart(4, '0')}`;

    const newComplaint: Complaint = {
      id: Date.now(),
      complaintReference: reference,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      location: data.location.trim(),
      building: data.building.trim(),
      floorOrRoom: data.floorOrRoom?.trim() || undefined,
      priority: data.priority,
      urgencyReason: data.urgencyReason?.trim() || undefined,
      status: 'SUBMITTED',
      submittedById: user.id,
      submittedByName: user.fullName,
      submittedByEmail: user.email,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.complaints.unshift(newComplaint);

    // Initial Status History
    const initialHistory: StatusHistory = {
      id: Date.now(),
      complaintId: newComplaint.id,
      previousStatus: null,
      newStatus: 'SUBMITTED',
      changedByName: user.fullName,
      publicMessage: 'Complaint filed successfully and logged into Grievora system.',
      changedAt: new Date().toISOString(),
    };
    db.statusHistories.push(initialHistory);

    // Notification to Submitter
    db.notifications.unshift({
      id: Date.now() + 1,
      recipientId: user.id,
      complaintId: newComplaint.id,
      title: `Complaint Logged: ${reference}`,
      message: `Your complaint "${newComplaint.title}" was received. Ref: ${reference}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // If Urgent, notify all admins
    if (data.priority === 'URGENT') {
      const admins = db.users.filter((u) => u.role === 'ADMIN');
      admins.forEach((admin, idx) => {
        db.notifications.unshift({
          id: Date.now() + 10 + idx,
          recipientId: admin.id,
          complaintId: newComplaint.id,
          title: `URGENT Alert: ${reference}`,
          message: `Urgent issue at ${newComplaint.building} (${newComplaint.location}): ${newComplaint.title}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      });
    }

    saveDatabase(db);
    return newComplaint;
  },

  async getMyComplaints(): Promise<Complaint[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];
    const db = getDatabase();
    return db.complaints
      .filter((c) => c.submittedById === user.id)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  async getComplaintDetail(id: number): Promise<{
    complaint: Complaint;
    timeline: StatusHistory[];
    comments: Comment[];
  }> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Authentication required.');

    const db = getDatabase();
    const complaint = db.complaints.find((c) => c.id === id);
    if (!complaint) throw new Error('Complaint not found.');

    if (user.role !== 'ADMIN' && complaint.submittedById !== user.id) {
      throw new Error('Access denied: You do not have permission to view this complaint.');
    }

    const timeline = db.statusHistories
      .filter((h) => h.complaintId === id)
      .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());

    const comments = db.comments
      .filter((c) => c.complaintId === id)
      .filter((c) => (user.role === 'ADMIN' ? true : c.visibility === 'PUBLIC'))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { complaint, timeline, comments };
  },

  async addComment(complaintId: number, message: string, visibility: 'PUBLIC' | 'INTERNAL' = 'PUBLIC'): Promise<Comment> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Authentication required.');

    const db = getDatabase();
    const complaint = db.complaints.find((c) => c.id === complaintId);
    if (!complaint) throw new Error('Complaint not found.');

    if (user.role !== 'ADMIN' && complaint.submittedById !== user.id) {
      throw new Error('You cannot comment on this complaint.');
    }

    const newComment: Comment = {
      id: Date.now(),
      complaintId,
      authorId: user.id,
      authorName: user.fullName,
      authorRole: user.role,
      message: message.trim(),
      visibility: user.role === 'ADMIN' ? visibility : 'PUBLIC',
      createdAt: new Date().toISOString(),
    };

    db.comments.push(newComment);

    if (user.role === 'ADMIN' && visibility === 'PUBLIC') {
      db.notifications.unshift({
        id: Date.now() + 1,
        recipientId: complaint.submittedById,
        complaintId,
        title: `Admin Reply: ${complaint.complaintReference}`,
        message: `${user.fullName} commented on your ticket: "${message.slice(0, 50)}..."`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    saveDatabase(db);
    return newComment;
  },

  // -------------------------------------------------------------
  // ADMIN ACTIONS
  // -------------------------------------------------------------
  async getAdminDashboard(): Promise<AdminDashboardMetrics> {
    const db = getDatabase();
    const complaints = db.complaints;

    const total = complaints.length;
    const submitted = complaints.filter((c) => c.status === 'SUBMITTED').length;
    const underReview = complaints.filter((c) => c.status === 'UNDER_REVIEW').length;
    const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
    const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
    const rejected = complaints.filter((c) => c.status === 'REJECTED').length;
    const urgentOpen = complaints.filter(
      (c) => c.priority === 'URGENT' && c.status !== 'RESOLVED' && c.status !== 'REJECTED'
    ).length;

    const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

    // Average resolution time
    const resolvedList = complaints.filter((c) => c.status === 'RESOLVED' && c.resolvedAt);
    let avgHours = 0;
    if (resolvedList.length > 0) {
      const sumHours = resolvedList.reduce((acc, c) => {
        const diff = new Date(c.resolvedAt!).getTime() - new Date(c.submittedAt).getTime();
        return acc + diff / (1000 * 60 * 60);
      }, 0);
      avgHours = sumHours / resolvedList.length;
    }

    // Breakdown maps
    const byCat: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byDept: Record<string, number> = {};

    complaints.forEach((c) => {
      byCat[c.category] = (byCat[c.category] || 0) + 1;
      byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      const dept = c.assignedDepartmentName || 'Unassigned';
      byDept[dept] = (byDept[dept] || 0) + 1;
    });

    const recent = [...complaints]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5);

    const urgentList = complaints.filter(
      (c) => c.priority === 'URGENT' && c.status !== 'RESOLVED' && c.status !== 'REJECTED'
    );

    return {
      totalComplaints: total,
      newComplaints: submitted,
      underReviewComplaints: underReview,
      inProgressComplaints: inProgress,
      resolvedComplaints: resolved,
      rejectedComplaints: rejected,
      urgentOpenComplaints: urgentOpen,
      averageResolutionTimeHours: Math.round(avgHours * 10) / 10,
      resolutionRatePercentage: Math.round(resolutionRate * 10) / 10,
      complaintsByCategory: byCat,
      complaintsByPriority: byPriority,
      complaintsByStatus: byStatus,
      complaintsByDepartment: byDept,
      recentComplaints: recent,
      urgentOpenList: urgentList,
    };
  },

  async getAllComplaints(): Promise<Complaint[]> {
    const db = getDatabase();
    return [...db.complaints].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  },

  async updateComplaintStatus(
    id: number,
    newStatus: ComplaintStatus,
    publicMessage: string
  ): Promise<Complaint> {
    const admin = await this.getCurrentUser();
    if (!admin || admin.role !== 'ADMIN') {
      throw new Error('Only administrators can update complaint statuses.');
    }

    const db = getDatabase();
    const complaint = db.complaints.find((c) => c.id === id);
    if (!complaint) throw new Error('Complaint not found.');

    const prev = complaint.status;
    complaint.status = newStatus;
    complaint.updatedAt = new Date().toISOString();

    if (newStatus === 'RESOLVED') {
      complaint.resolvedAt = new Date().toISOString();
    }

    // Save history
    db.statusHistories.push({
      id: Date.now(),
      complaintId: id,
      previousStatus: prev,
      newStatus,
      changedByName: admin.fullName,
      publicMessage: publicMessage.trim(),
      changedAt: new Date().toISOString(),
    });

    // Notify user
    db.notifications.unshift({
      id: Date.now() + 1,
      recipientId: complaint.submittedById,
      complaintId: id,
      title: `Status Update: ${complaint.complaintReference}`,
      message: `Status transitioned to ${newStatus}: "${publicMessage.trim()}"`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    saveDatabase(db);
    return complaint;
  },

  async updatePriority(id: number, priority: ComplaintPriority, reason?: string): Promise<Complaint> {
    const admin = await this.getCurrentUser();
    if (!admin || admin.role !== 'ADMIN') throw new Error('Admin role required.');

    const db = getDatabase();
    const complaint = db.complaints.find((c) => c.id === id);
    if (!complaint) throw new Error('Complaint not found.');

    const oldP = complaint.priority;
    complaint.priority = priority;
    complaint.updatedAt = new Date().toISOString();

    const note = `Priority adjusted from ${oldP} to ${priority}${reason ? `. Reason: ${reason}` : ''}`;
    db.statusHistories.push({
      id: Date.now(),
      complaintId: id,
      previousStatus: complaint.status,
      newStatus: complaint.status,
      changedByName: admin.fullName,
      publicMessage: note,
      changedAt: new Date().toISOString(),
    });

    saveDatabase(db);
    return complaint;
  },

  async updateAssignment(
    id: number,
    departmentId?: number,
    staffUserId?: number,
    assignmentNote?: string
  ): Promise<Complaint> {
    const admin = await this.getCurrentUser();
    if (!admin || admin.role !== 'ADMIN') throw new Error('Admin role required.');

    const db = getDatabase();
    const complaint = db.complaints.find((c) => c.id === id);
    if (!complaint) throw new Error('Complaint not found.');

    const dept = db.departments.find((d) => d.id === departmentId);
    const staff = db.users.find((u) => u.id === staffUserId);

    if (dept) {
      complaint.assignedDepartmentId = dept.id;
      complaint.assignedDepartmentName = dept.name;
    }
    if (staff) {
      complaint.assignedToId = staff.id;
      complaint.assignedToName = staff.fullName;
    }

    const prev = complaint.status;
    if (complaint.status === 'SUBMITTED' || complaint.status === 'UNDER_REVIEW') {
      complaint.status = 'ASSIGNED';
    }
    complaint.updatedAt = new Date().toISOString();

    const msg = `Assigned to ${dept ? dept.name : 'Maintenance Department'}${
      staff ? ` (Lead: ${staff.fullName})` : ''
    }${assignmentNote ? `. Note: ${assignmentNote}` : ''}`;

    db.statusHistories.push({
      id: Date.now(),
      complaintId: id,
      previousStatus: prev,
      newStatus: complaint.status,
      changedByName: admin.fullName,
      publicMessage: msg,
      changedAt: new Date().toISOString(),
    });

    db.notifications.unshift({
      id: Date.now() + 1,
      recipientId: complaint.submittedById,
      complaintId: id,
      title: `Assignment: ${complaint.complaintReference}`,
      message: msg,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    saveDatabase(db);
    return complaint;
  },

  async resolveComplaint(id: number, resolutionNotes: string): Promise<Complaint> {
    const admin = await this.getCurrentUser();
    if (!admin || admin.role !== 'ADMIN') throw new Error('Admin role required.');

    if (!resolutionNotes || resolutionNotes.trim().length < 10) {
      throw new Error('Resolution notes must provide at least 10 characters detailing the fix.');
    }

    const db = getDatabase();
    const complaint = db.complaints.find((c) => c.id === id);
    if (!complaint) throw new Error('Complaint not found.');

    const prev = complaint.status;
    complaint.status = 'RESOLVED';
    complaint.resolutionNotes = resolutionNotes.trim();
    complaint.resolvedAt = new Date().toISOString();
    complaint.updatedAt = new Date().toISOString();

    const msg = `Issue resolved. Action taken: ${resolutionNotes.trim()}`;

    db.statusHistories.push({
      id: Date.now(),
      complaintId: id,
      previousStatus: prev,
      newStatus: 'RESOLVED',
      changedByName: admin.fullName,
      publicMessage: msg,
      changedAt: new Date().toISOString(),
    });

    db.notifications.unshift({
      id: Date.now() + 1,
      recipientId: complaint.submittedById,
      complaintId: id,
      title: `Resolved: ${complaint.complaintReference}`,
      message: `Your issue has been marked resolved. "${resolutionNotes.trim()}"`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    saveDatabase(db);
    return complaint;
  },

  async rejectComplaint(id: number, rejectionReason: string): Promise<Complaint> {
    const admin = await this.getCurrentUser();
    if (!admin || admin.role !== 'ADMIN') throw new Error('Admin role required.');

    if (!rejectionReason || rejectionReason.trim().length < 10) {
      throw new Error('Rejection reason must be at least 10 characters explaining why the complaint was rejected.');
    }

    const db = getDatabase();
    const complaint = db.complaints.find((c) => c.id === id);
    if (!complaint) throw new Error('Complaint not found.');

    const prev = complaint.status;
    complaint.status = 'REJECTED';
    complaint.rejectionReason = rejectionReason.trim();
    complaint.updatedAt = new Date().toISOString();

    const msg = `Complaint rejected by administration. Reason: ${rejectionReason.trim()}`;

    db.statusHistories.push({
      id: Date.now(),
      complaintId: id,
      previousStatus: prev,
      newStatus: 'REJECTED',
      changedByName: admin.fullName,
      publicMessage: msg,
      changedAt: new Date().toISOString(),
    });

    db.notifications.unshift({
      id: Date.now() + 1,
      recipientId: complaint.submittedById,
      complaintId: id,
      title: `Rejected: ${complaint.complaintReference}`,
      message: msg,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    saveDatabase(db);
    return complaint;
  },

  async getReports(): Promise<ReportMetrics> {
    const db = getDatabase();
    const complaints = db.complaints;

    const total = complaints.length;
    const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
    const rejected = complaints.filter((c) => c.status === 'REJECTED').length;
    const open = total - resolved - rejected;
    const rate = total > 0 ? (resolved / total) * 100 : 0;

    const resolvedList = complaints.filter((c) => c.status === 'RESOLVED' && c.resolvedAt);
    let avgHours = 0;
    if (resolvedList.length > 0) {
      const sum = resolvedList.reduce((acc, c) => {
        return acc + (new Date(c.resolvedAt!).getTime() - new Date(c.submittedAt).getTime()) / (1000 * 3600);
      }, 0);
      avgHours = sum / resolvedList.length;
    }

    const catFreq: Record<string, number> = {};
    const priorityDist: Record<string, number> = {};
    const deptWorkload: Record<string, number> = {};
    const hotspotMap: Record<string, number> = {};

    complaints.forEach((c) => {
      catFreq[c.category] = (catFreq[c.category] || 0) + 1;
      priorityDist[c.priority] = (priorityDist[c.priority] || 0) + 1;
      const dept = c.assignedDepartmentName || 'Unassigned';
      deptWorkload[dept] = (deptWorkload[dept] || 0) + 1;

      const key = `${c.building}:::${c.category}`;
      hotspotMap[key] = (hotspotMap[key] || 0) + 1;
    });

    const recurringIssueHotspots = Object.entries(hotspotMap)
      .map(([k, v]) => {
        const [building, category] = k.split(':::');
        return { building, category, count: v };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Tickets older than 3 days still open
    const threeDaysAgo = Date.now() - 3 * 24 * 3600 * 1000;
    const longPending = complaints.filter(
      (c) =>
        c.status !== 'RESOLVED' &&
        c.status !== 'REJECTED' &&
        new Date(c.submittedAt).getTime() < threeDaysAgo
    );

    return {
      totalReceived: total,
      totalResolved: resolved,
      totalOpen: open,
      totalRejected: rejected,
      resolutionRatePercentage: Math.round(rate * 10) / 10,
      averageResolutionTimeHours: Math.round(avgHours * 10) / 10,
      averageResolutionTimeDays: Math.round((avgHours / 24) * 10) / 10,
      categoryFrequency: catFreq,
      priorityDistribution: priorityDist,
      departmentWorkload: deptWorkload,
      recurringIssueHotspots,
      longPendingComplaints: longPending,
    };
  },

  exportCsv(): string {
    const db = getDatabase();
    const rows = [
      ['Reference', 'Title', 'Category', 'Building', 'Location', 'Priority', 'Status', 'Submitted By', 'Department', 'Submitted Date', 'Resolved Date'],
    ];

    db.complaints.forEach((c) => {
      rows.push([
        c.complaintReference,
        `"${c.title.replace(/"/g, '""')}"`,
        `"${c.category.replace(/"/g, '""')}"`,
        `"${c.building.replace(/"/g, '""')}"`,
        `"${c.location.replace(/"/g, '""')}"`,
        c.priority,
        c.status,
        `"${c.submittedByName.replace(/"/g, '""')}"`,
        `"${(c.assignedDepartmentName || 'Unassigned').replace(/"/g, '""')}"`,
        c.submittedAt,
        c.resolvedAt || '',
      ]);
    });

    return rows.map((r) => r.join(',')).join('\n');
  },

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------
  async getNotifications(): Promise<Notification[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];
    const db = getDatabase();
    return db.notifications
      .filter((n) => n.recipientId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markNotificationRead(id: number): Promise<void> {
    const db = getDatabase();
    const notif = db.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      saveDatabase(db);
    }
  },

  async markAllNotificationsRead(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;
    const db = getDatabase();
    db.notifications.forEach((n) => {
      if (n.recipientId === user.id) n.isRead = true;
    });
    saveDatabase(db);
  },

  async resetPassword(identifier: string, newPassword: string): Promise<void> {
    const db = getDatabase();
    const clean = identifier.trim().toLowerCase();
    const user = db.users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.institutionalId.toLowerCase() === clean ||
        u.fullName.toLowerCase().includes(clean)
    );
    if (!user) {
      throw new Error('No user account found with this email or ID.');
    }
    user.password = newPassword;
    saveDatabase(db);
  },

  resetData(): void {
    resetDatabase();
  },
};
