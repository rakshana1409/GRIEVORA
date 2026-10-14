package com.grievora.config;

import com.grievora.entity.*;
import com.grievora.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           ComplaintRepository complaintRepository,
                           ComplaintStatusHistoryRepository historyRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) {
            log.info("GRIEVORA: Initializing default campus departments...");
            Department ele = departmentRepository.save(new Department(null, "Electrical & Power Systems", "ELE-DEPT", "Classroom smart boards, lab power, AC systems, and campus lighting.", "electrical@grievora.edu", "Er. Suresh K."));
            Department plumb = departmentRepository.save(new Department(null, "Plumbing & Water Supply", "PLUMB-DEPT", "Restrooms, water purifiers, overhead tanks, and campus plumbing.", "plumbing@grievora.edu", "Mr. Ramesh Patil"));
            Department it = departmentRepository.save(new Department(null, "IT & Campus Network Services", "IT-DEPT", "Campus Wi-Fi routers, lab ethernet, smart classroom AV switches.", "itsupport@grievora.edu", "Dr. Arvind Sharma"));
            Department civil = departmentRepository.save(new Department(null, "Civil & Infrastructure Maintenance", "CIVIL-DEPT", "Desks, benches, doors, windows, and structural maintenance.", "infra@grievora.edu", "Er. Meenakshi Sundaram"));
            Department san = departmentRepository.save(new Department(null, "Sanitation & Housekeeping", "SAN-DEPT", "Classroom cleanliness, waste management, and washroom sanitation.", "sanitation@grievora.edu", "Mrs. Sunita Devi"));
            Department sec = departmentRepository.save(new Department(null, "Campus Safety & Vigilance", "SEC-DEPT", "CCTV coverage, security guards, night lighting, and emergency response.", "security@grievora.edu", "Col. R. S. Rathore"));

            if (userRepository.count() == 0) {
                log.info("GRIEVORA: Seeding initial users (Admin, Faculty, Student)...");
                String encodedPassword = passwordEncoder.encode("Password@123");

                User admin = new User("Rajesh Verma (Chief Admin)", "ADM-001", "admin@grievora.edu", encodedPassword, Role.ADMIN, civil, "+91 98765 43210");
                User faculty = new User("Dr. Rajiv Menon", "FAC-204", "rajiv.menon@grievora.edu", encodedPassword, Role.FACULTY, it, "+91 98765 43211");
                User student = new User("Rakshana", "310625205222", "rakshana@grievora.edu", encodedPassword, Role.STUDENT, it, "+91 98765 43212");
                User staff = new User("Kavita Nair (Staff Engineer)", "STF-102", "kavita.nair@grievora.edu", encodedPassword, Role.ADMIN, ele, "+91 98765 43213");

                userRepository.save(admin);
                userRepository.save(faculty);
                userRepository.save(student);
                userRepository.save(staff);

                // Sample Complaint 1
                Complaint c1 = new Complaint();
                c1.setComplaintReference("GRV-2026-0001");
                c1.setTitle("Smart Classroom 402 Ceiling Projector Flickering");
                c1.setDescription("The overhead HDMI projector keeps dropping signal every 3 minutes during lectures, disrupting slides and interactive demonstrations.");
                c1.setCategory("Classroom Equipment");
                c1.setLocation("Academic Block A");
                c1.setBuilding("Block A");
                c1.setFloorOrRoom("Room 402, 4th Floor");
                c1.setPriority(ComplaintPriority.HIGH);
                c1.setStatus(ComplaintStatus.IN_PROGRESS);
                c1.setSubmittedBy(faculty);
                c1.setAssignedTo(staff);
                c1.setAssignedDepartment(ele);
                c1.setSubmittedAt(LocalDateTime.now().minusDays(3));
                c1.setUpdatedAt(LocalDateTime.now().minusHours(4));
                complaintRepository.save(c1);

                historyRepository.save(new ComplaintStatusHistory(c1, null, ComplaintStatus.SUBMITTED, faculty, "Complaint logged by faculty member."));
                historyRepository.save(new ComplaintStatusHistory(c1, ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW, admin, "Reviewed and verified by Chief Admin Office."));
                historyRepository.save(new ComplaintStatusHistory(c1, ComplaintStatus.UNDER_REVIEW, ComplaintStatus.ASSIGNED, admin, "Assigned to Electrical Dept (Staff: Kavita Nair)."));
                historyRepository.save(new ComplaintStatusHistory(c1, ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS, staff, "Technician dispatched on-site; replacement HDMI unit requested."));

                // Sample Complaint 2 (Urgent)
                Complaint c2 = new Complaint();
                c2.setComplaintReference("GRV-2026-0002");
                c2.setTitle("Main Library 2nd Floor High-Speed Wi-Fi Disconnecting");
                c2.setDescription("Access point AP-LIB-2B is continuously rebooting, causing 80+ students studying in the digital reference hall to lose internet connectivity.");
                c2.setCategory("Internet and Wi-Fi");
                c2.setLocation("Central Library");
                c2.setBuilding("Library Complex");
                c2.setFloorOrRoom("2nd Floor Reading Hall");
                c2.setPriority(ComplaintPriority.URGENT);
                c2.setUrgencyReason("Midterm examination submissions are due tonight and 80+ students are unable to upload research drafts.");
                c2.setStatus(ComplaintStatus.UNDER_REVIEW);
                c2.setSubmittedBy(student);
                c2.setAssignedDepartment(it);
                c2.setSubmittedAt(LocalDateTime.now().minusHours(8));
                c2.setUpdatedAt(LocalDateTime.now().minusHours(2));
                complaintRepository.save(c2);

                historyRepository.save(new ComplaintStatusHistory(c2, null, ComplaintStatus.SUBMITTED, student, "Complaint logged with Urgent priority."));
                historyRepository.save(new ComplaintStatusHistory(c2, ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW, admin, "Escalated for immediate review due to upcoming exam deadline."));

                notificationRepository.save(new Notification(student, c2, "Complaint Received", "Your complaint GRV-2026-0002 has been received and escalated to Under Review."));
                notificationRepository.save(new Notification(faculty, c1, "Technician Dispatched", "Technician is currently resolving issue GRV-2026-0001 in Room 402."));
            }
        }
    }
}
