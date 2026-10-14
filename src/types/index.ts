export type Role = 'STUDENT' | 'FACULTY' | 'ADMIN';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type CommentVisibility = 'PUBLIC' | 'INTERNAL';

export interface User {
  id: number;
  fullName: string;
  institutionalId: string;
  email: string;
  role: Role;
  departmentId?: number;
  departmentName?: string;
  phoneNumber?: string;
  password?: string;
  active: boolean;
  createdAt: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  contactEmail: string;
  headOfDepartment: string;
}

export interface StatusHistory {
  id: number;
  complaintId: number;
  previousStatus: ComplaintStatus | null;
  newStatus: ComplaintStatus;
  changedByName: string;
  publicMessage: string;
  changedAt: string;
}

export interface Comment {
  id: number;
  complaintId: number;
  authorId: number;
  authorName: string;
  authorRole: Role;
  message: string;
  visibility: CommentVisibility;
  createdAt: string;
}

export interface Attachment {
  id: number;
  complaintId: number;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
  fileUrl?: string;
}

export interface Complaint {
  id: number;
  complaintReference: string;
  title: string;
  description: string;
  category: string;
  location: string;
  building: string;
  floorOrRoom?: string;
  priority: ComplaintPriority;
  urgencyReason?: string;
  status: ComplaintStatus;
  submittedById: number;
  submittedByName: string;
  submittedByEmail: string;
  assignedToId?: number;
  assignedToName?: string;
  assignedDepartmentId?: number;
  assignedDepartmentName?: string;
  resolutionNotes?: string;
  rejectionReason?: string;
  submittedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachments?: Attachment[];
}

export interface Notification {
  id: number;
  recipientId: number;
  complaintId?: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminDashboardMetrics {
  totalComplaints: number;
  newComplaints: number;
  underReviewComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  rejectedComplaints: number;
  urgentOpenComplaints: number;
  averageResolutionTimeHours: number;
  resolutionRatePercentage: number;
  complaintsByCategory: Record<string, number>;
  complaintsByPriority: Record<string, number>;
  complaintsByStatus: Record<string, number>;
  complaintsByDepartment: Record<string, number>;
  recentComplaints: Complaint[];
  urgentOpenList: Complaint[];
}

export interface ReportMetrics {
  totalReceived: number;
  totalResolved: number;
  totalOpen: number;
  totalRejected: number;
  resolutionRatePercentage: number;
  averageResolutionTimeHours: number;
  averageResolutionTimeDays: number;
  categoryFrequency: Record<string, number>;
  priorityDistribution: Record<string, number>;
  departmentWorkload: Record<string, number>;
  recurringIssueHotspots: Array<{ building: string; category: string; count: number }>;
  longPendingComplaints: Complaint[];
}

export const COMPLAINT_CATEGORIES = [
  'Electrical Issues',
  'Plumbing and Water Supply',
  'Classroom Equipment',
  'Furniture and Infrastructure',
  'Cleanliness and Sanitation',
  'Internet and Wi-Fi',
  'Laboratory Equipment',
  'Library Facilities',
  'Hostel Facilities',
  'Washroom Facilities',
  'Safety and Security',
  'Other',
] as const;
