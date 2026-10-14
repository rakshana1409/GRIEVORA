import {
  User,
  Department,
  Complaint,
  StatusHistory,
  Comment,
  Notification,
  ComplaintStatus,
  ComplaintPriority,
  AdminDashboardMetrics,
  ReportMetrics,
} from '../types';

interface DatabaseSchema {
  users: User[];
  departments: Department[];
  complaints: Complaint[];
  statusHistories: StatusHistory[];
  comments: Comment[];
  notifications: Notification[];
}

const STORAGE_KEY = 'grievora_db_v1';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: 'Electrical & Power Systems',
    code: 'ELE-DEPT',
    description: 'Maintenance of classroom wiring, projectors, AC units, elevators, and backup generators.',
    contactEmail: 'electrical@grievora.edu',
    headOfDepartment: 'Er. Suresh K.',
  },
  {
    id: 2,
    name: 'Plumbing & Water Supply',
    code: 'PLUMB-DEPT',
    description: 'Restroom fittings, drinking water filters, overhead tanks, and campus drainage.',
    contactEmail: 'plumbing@grievora.edu',
    headOfDepartment: 'Mr. Ramesh Patil',
  },
  {
    id: 3,
    name: 'IT & Campus Network Services',
    code: 'IT-DEPT',
    description: 'Campus Wi-Fi hotspots, computer lab LAN, institutional portal, and smart board connectivity.',
    contactEmail: 'itsupport@grievora.edu',
    headOfDepartment: 'Dr. Arvind Sharma',
  },
  {
    id: 4,
    name: 'Civil & Infrastructure Maintenance',
    code: 'CIVIL-DEPT',
    description: 'Desk repairs, blackboard/whiteboard fixtures, window panes, door locks, and structural repairs.',
    contactEmail: 'infra@grievora.edu',
    headOfDepartment: 'Er. Meenakshi Sundaram',
  },
  {
    id: 5,
    name: 'Sanitation & Housekeeping',
    code: 'SAN-DEPT',
    description: 'Classroom cleanliness, campus waste segregation, washroom hygiene, and pest control.',
    contactEmail: 'sanitation@grievora.edu',
    headOfDepartment: 'Mrs. Sunita Devi',
  },
  {
    id: 6,
    name: 'Campus Safety & Vigilance',
    code: 'SEC-DEPT',
    description: 'CCTV monitoring, hostel security guards, campus lighting, and fire extinguisher inspection.',
    contactEmail: 'security@grievora.edu',
    headOfDepartment: 'Col. R. S. Rathore',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    fullName: 'Rajesh Verma (Chief Admin)',
    institutionalId: 'ADM-001',
    email: 'admin@grievora.edu',
    password: 'password123',
    role: 'ADMIN',
    departmentId: 4,
    departmentName: 'Civil & Infrastructure Maintenance',
    phoneNumber: '+91 98765 43210',
    active: true,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 2,
    fullName: 'Dr. Rajiv Menon',
    institutionalId: 'FAC-204',
    email: 'rajiv.menon@grievora.edu',
    password: 'password123',
    role: 'FACULTY',
    departmentId: 3,
    departmentName: 'IT & Campus Network Services',
    phoneNumber: '+91 98765 43211',
    active: true,
    createdAt: '2026-09-10T09:30:00Z',
  },
  {
    id: 3,
    fullName: 'Rakshana',
    institutionalId: '310625205222',
    email: 'rakshana@grievora.edu',
    password: 'password123',
    role: 'STUDENT',
    departmentId: 3,
    departmentName: 'IT & Campus Network Services',
    phoneNumber: '+91 98765 43212',
    active: true,
    createdAt: '2026-09-15T11:00:00Z',
  },
  {
    id: 5,
    fullName: 'Rakshana (Gmail)',
    institutionalId: '310625205223',
    email: 'raksh9345@gmail.com',
    password: 'password123',
    role: 'STUDENT',
    departmentId: 3,
    departmentName: 'IT & Campus Network Services',
    phoneNumber: '+91 98765 43212',
    active: true,
    createdAt: '2026-09-15T11:00:00Z',
  },
  {
    id: 4,
    fullName: 'Kavita Nair (Staff Engineer)',
    institutionalId: 'STF-102',
    email: 'kavita.nair@grievora.edu',
    password: 'password123',
    role: 'ADMIN',
    departmentId: 1,
    departmentName: 'Electrical & Power Systems',
    phoneNumber: '+91 98765 43213',
    active: true,
    createdAt: '2026-09-05T10:15:00Z',
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 1,
    complaintReference: 'GRV-2026-0001',
    title: 'Smart Classroom 402 Ceiling Projector Flickering',
    description:
      'The overhead HDMI projector keeps dropping signal every 3 minutes during lectures, disrupting slides and interactive demonstrations.',
    category: 'Classroom Equipment',
    location: 'Academic Block A',
    building: 'Block A',
    floorOrRoom: 'Room 402, 4th Floor',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    submittedById: 2,
    submittedByName: 'Dr. Rajiv Menon',
    submittedByEmail: 'rajiv.menon@grievora.edu',
    assignedToId: 4,
    assignedToName: 'Kavita Nair (Staff Engineer)',
    assignedDepartmentId: 1,
    assignedDepartmentName: 'Electrical & Power Systems',
    submittedAt: '2026-10-10T09:30:00Z',
    updatedAt: '2026-10-12T11:15:00Z',
  },
  {
    id: 2,
    complaintReference: 'GRV-2026-0002',
    title: 'Main Library 2nd Floor High-Speed Wi-Fi Disconnecting',
    description:
      'Access point AP-LIB-2B is continuously rebooting, causing 80+ students studying in the digital reference zone to lose internet connectivity during exam prep.',
    category: 'Internet and Wi-Fi',
    location: 'Central Library',
    building: 'Library Complex',
    floorOrRoom: '2nd Floor Reading Hall',
    priority: 'URGENT',
    urgencyReason:
      'Midterm examination submissions are due tonight and 80+ students are unable to upload research drafts.',
    status: 'UNDER_REVIEW',
    submittedById: 3,
    submittedByName: 'Rakshana',
    submittedByEmail: 'rakshana@grievora.edu',
    assignedDepartmentId: 3,
    assignedDepartmentName: 'IT & Campus Network Services',
    submittedAt: '2026-10-13T14:20:00Z',
    updatedAt: '2026-10-13T15:00:00Z',
  },
  {
    id: 3,
    complaintReference: 'GRV-2026-0003',
    title: 'Hostel Block C 3rd Floor Water Leakage',
    description:
      'Water is leaking continuously from the washroom pipe joint near Room 314, causing pooling in the corridor and slipping hazard.',
    category: 'Plumbing and Water Supply',
    location: 'Hostel Zone',
    building: 'Hostel Block C',
    floorOrRoom: 'Corridor outside Room 314',
    priority: 'URGENT',
    urgencyReason: 'Water seepage risk and student slipping hazard in night hours.',
    status: 'ASSIGNED',
    submittedById: 3,
    submittedByName: 'Rakshana',
    submittedByEmail: 'rakshana@grievora.edu',
    assignedToId: 1,
    assignedToName: 'Rajesh Verma (Chief Admin)',
    assignedDepartmentId: 2,
    assignedDepartmentName: 'Plumbing & Water Supply',
    submittedAt: '2026-10-11T18:00:00Z',
    updatedAt: '2026-10-12T09:00:00Z',
  },
  {
    id: 4,
    complaintReference: 'GRV-2026-0004',
    title: 'Damaged Wooden Stools in Advanced Chemistry Lab 2',
    description:
      'Four wooden stools have loosened leg joints and wobbly seats, risking chemical spillage if a student falls while handling reagents.',
    category: 'Laboratory Equipment',
    location: 'Science & Innovation Center',
    building: 'Block D',
    floorOrRoom: 'Chemistry Lab 2, Ground Floor',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    submittedById: 2,
    submittedByName: 'Dr. Rajiv Menon',
    submittedByEmail: 'rajiv.menon@grievora.edu',
    assignedToId: 1,
    assignedToName: 'Rajesh Verma (Chief Admin)',
    assignedDepartmentId: 4,
    assignedDepartmentName: 'Civil & Infrastructure Maintenance',
    resolutionNotes:
      'Carpentry team inspected the laboratory and replaced all 4 damaged wooden stools with heavy-duty steel frame ergonomic chairs. Certified safe by Lab In-Charge.',
    submittedAt: '2026-10-08T10:00:00Z',
    updatedAt: '2026-10-10T16:30:00Z',
    resolvedAt: '2026-10-10T16:30:00Z',
  },
  {
    id: 5,
    complaintReference: 'GRV-2026-0005',
    title: 'Street Lamp Darkness Near North Gate Pathway',
    description:
      'Two consecutive sodium-vapor street lamps are out between North Gate and Girl’s Hostel 2, leaving the pedestrian footpath completely dark after 7 PM.',
    category: 'Safety and Security',
    location: 'North Perimeter Pathway',
    building: 'Perimeter Grounds',
    floorOrRoom: 'Pole #14 & #15',
    priority: 'HIGH',
    status: 'SUBMITTED',
    submittedById: 3,
    submittedByName: 'Rakshana',
    submittedByEmail: 'rakshana@grievora.edu',
    submittedAt: '2026-10-14T02:10:00Z',
    updatedAt: '2026-10-14T02:10:00Z',
  },
];

export const INITIAL_STATUS_HISTORIES: StatusHistory[] = [
  {
    id: 1,
    complaintId: 1,
    previousStatus: null,
    newStatus: 'SUBMITTED',
    changedByName: 'Dr. Rajiv Menon',
    publicMessage: 'Complaint logged into Grievora system by faculty member.',
    changedAt: '2026-10-10T09:30:00Z',
  },
  {
    id: 2,
    complaintId: 1,
    previousStatus: 'SUBMITTED',
    newStatus: 'UNDER_REVIEW',
    changedByName: 'Rajesh Verma (Chief Admin)',
    publicMessage: 'Reviewed and verified by Chief Admin Office.',
    changedAt: '2026-10-10T11:00:00Z',
  },
  {
    id: 3,
    complaintId: 1,
    previousStatus: 'UNDER_REVIEW',
    newStatus: 'ASSIGNED',
    changedByName: 'Rajesh Verma (Chief Admin)',
    publicMessage: 'Assigned to Electrical & Power Systems (Staff: Kavita Nair).',
    changedAt: '2026-10-11T10:00:00Z',
  },
  {
    id: 4,
    complaintId: 1,
    previousStatus: 'ASSIGNED',
    newStatus: 'IN_PROGRESS',
    changedByName: 'Kavita Nair (Staff Engineer)',
    publicMessage: 'Replacement HDMI switcher ordered from vendor; technician on-site for line testing.',
    changedAt: '2026-10-12T11:15:00Z',
  },
  {
    id: 5,
    complaintId: 2,
    previousStatus: null,
    newStatus: 'SUBMITTED',
    changedByName: 'Rakshana',
    publicMessage: 'Complaint logged into Grievora system with Urgent tag.',
    changedAt: '2026-10-13T14:20:00Z',
  },
  {
    id: 6,
    complaintId: 2,
    previousStatus: 'SUBMITTED',
    newStatus: 'UNDER_REVIEW',
    changedByName: 'Rajesh Verma (Chief Admin)',
    publicMessage: 'Escalated to IT Network Services due to midterm deadline impact.',
    changedAt: '2026-10-13T15:00:00Z',
  },
  {
    id: 7,
    complaintId: 4,
    previousStatus: null,
    newStatus: 'SUBMITTED',
    changedByName: 'Dr. Rajiv Menon',
    publicMessage: 'Complaint logged.',
    changedAt: '2026-10-08T10:00:00Z',
  },
  {
    id: 8,
    complaintId: 4,
    previousStatus: 'SUBMITTED',
    newStatus: 'IN_PROGRESS',
    changedByName: 'Rajesh Verma (Chief Admin)',
    publicMessage: 'Carpentry and infrastructure team dispatched with replacement ergonomic stools.',
    changedAt: '2026-10-09T10:00:00Z',
  },
  {
    id: 9,
    complaintId: 4,
    previousStatus: 'IN_PROGRESS',
    newStatus: 'RESOLVED',
    changedByName: 'Rajesh Verma (Chief Admin)',
    publicMessage:
      'All 4 damaged stools replaced with heavy-duty laboratory chairs. Verified with Lab In-Charge.',
    changedAt: '2026-10-10T16:30:00Z',
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    complaintId: 1,
    authorId: 4,
    authorName: 'Kavita Nair (Staff Engineer)',
    authorRole: 'ADMIN',
    message: 'Testing the signal attenuation on the overhead ceiling tray. Will replace the 15m cable harness.',
    visibility: 'PUBLIC',
    createdAt: '2026-10-12T12:00:00Z',
  },
  {
    id: 2,
    complaintId: 1,
    authorId: 2,
    authorName: 'Dr. Rajiv Menon',
    authorRole: 'FACULTY',
    message: 'Thank you Kavita. I have lecture at 2 PM tomorrow, please let me know if alternate room is needed.',
    visibility: 'PUBLIC',
    createdAt: '2026-10-12T14:30:00Z',
  },
  {
    id: 3,
    complaintId: 2,
    authorId: 1,
    authorName: 'Rajesh Verma (Chief Admin)',
    authorRole: 'ADMIN',
    message: 'IT network engineers have rebooted switch stack SW-LIB-02. Monitoring traffic load.',
    visibility: 'PUBLIC',
    createdAt: '2026-10-13T16:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    recipientId: 2,
    complaintId: 1,
    title: 'Status Update: Projector Flickering',
    message: 'Your complaint GRV-2026-0001 is now IN_PROGRESS with Electrical Dept.',
    isRead: false,
    createdAt: '2026-10-12T11:15:00Z',
  },
  {
    id: 2,
    recipientId: 3,
    complaintId: 2,
    title: 'Urgent Complaint Under Review',
    message: 'Ticket GRV-2026-0002 has been flagged for rapid IT network evaluation.',
    isRead: false,
    createdAt: '2026-10-13T15:00:00Z',
  },
  {
    id: 3,
    recipientId: 1,
    complaintId: 2,
    title: 'New Urgent Complaint Submitted',
    message: 'Student Rakshana submitted an Urgent ticket for Central Library Wi-Fi.',
    isRead: true,
    createdAt: '2026-10-13T14:20:00Z',
  },
];

export function getDatabase(): DatabaseSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let db: DatabaseSchema;
    if (!raw) {
      db = {
        users: INITIAL_USERS,
        departments: INITIAL_DEPARTMENTS,
        complaints: INITIAL_COMPLAINTS,
        statusHistories: INITIAL_STATUS_HISTORIES,
        comments: INITIAL_COMMENTS,
        notifications: INITIAL_NOTIFICATIONS,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db;
    }

    db = JSON.parse(raw);

    // Auto-migrate any cached session or seeds from Aditi to Rakshana (310625205222)
    let modified = false;
    db.users.forEach((u) => {
      if (/aditi/i.test(u.fullName) || /aditi/i.test(u.email)) {
        u.fullName = 'Rakshana';
        u.institutionalId = '310625205222';
        u.email = 'rakshana@grievora.edu';
        modified = true;
      }
    });

    db.complaints.forEach((c) => {
      if (/aditi/i.test(c.submittedByName) || /aditi/i.test(c.submittedByEmail)) {
        c.submittedByName = 'Rakshana';
        c.submittedByEmail = 'rakshana@grievora.edu';
        modified = true;
      }
    });

    db.statusHistories.forEach((h) => {
      if (/aditi/i.test(h.changedByName)) {
        h.changedByName = 'Rakshana';
        modified = true;
      }
    });

    db.notifications.forEach((n) => {
      if (n.message && /aditi/i.test(n.message)) {
        n.message = n.message.replace(/Aditi Sharma/gi, 'Rakshana').replace(/aditi/gi, 'Rakshana');
        modified = true;
      }
    });

    if (modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }

    return db;
  } catch {
    return {
      users: INITIAL_USERS,
      departments: INITIAL_DEPARTMENTS,
      complaints: INITIAL_COMPLAINTS,
      statusHistories: INITIAL_STATUS_HISTORIES,
      comments: INITIAL_COMMENTS,
      notifications: INITIAL_NOTIFICATIONS,
    };
  }
}

export function saveDatabase(db: DatabaseSchema) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function resetDatabase() {
  localStorage.removeItem(STORAGE_KEY);
  return getDatabase();
}
