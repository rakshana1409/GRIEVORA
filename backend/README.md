# GRIEVORA: Smart Campus Complaint Management System

> **“Your Voice. Our Campus. Better Together.”**
> *GRIEVORA = Grievance + Aura*

---

## 🏛️ System Architecture

GRIEVORA is an enterprise-grade Smart Campus Complaint Management System built with:
- **Backend:** Java 21, Spring Boot 3.3.x
- **Security:** Spring Security 6 with session-based role authorization (`ROLE_STUDENT`, `ROLE_FACULTY`, `ROLE_ADMIN`) and BCrypt password encryption
- **Data Access:** Spring Data JPA & Hibernate ORM
- **Database:** MySQL 8.0+ (with embedded H2 compatibility for automated testing)
- **Validation:** Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`, `@AssertTrue`)
- **Testing:** JUnit 5, Mockito, Spring Boot Test

### Package Structure
```
backend/
├── pom.xml
├── README.md
└── src/
    ├── main/
    │   ├── java/com/grievora/
    │   │   ├── GrievoraApplication.java
    │   │   ├── config/
    │   │   │   ├── SecurityConfig.java
    │   │   │   └── DataInitializer.java
    │   │   ├── controller/
    │   │   │   ├── AuthController.java
    │   │   │   ├── ComplaintController.java
    │   │   │   ├── AdminController.java
    │   │   │   ├── NotificationController.java
    │   │   │   └── DepartmentController.java
    │   │   ├── dto/
    │   │   │   ├── AuthRequest.java
    │   │   │   ├── RegisterRequest.java
    │   │   │   ├── UserDto.java
    │   │   │   ├── ComplaintRequest.java
    │   │   │   ├── ComplaintResponse.java
    │   │   │   ├── ComplaintDetailResponse.java
    │   │   │   ├── ComplaintStatusUpdateRequest.java
    │   │   │   ├── PriorityUpdateRequest.java
    │   │   │   ├── AssignmentUpdateRequest.java
    │   │   │   ├── ResolutionRequest.java
    │   │   │   ├── RejectionRequest.java
    │   │   │   ├── AdminDashboardDto.java
    │   │   │   └── ReportDto.java
    │   │   ├── entity/
    │   │   │   ├── User.java, Role.java
    │   │   │   ├── Department.java
    │   │   │   ├── Complaint.java, ComplaintStatus.java, ComplaintPriority.java
    │   │   │   ├── ComplaintStatusHistory.java
    │   │   │   ├── ComplaintComment.java
    │   │   │   ├── Notification.java
    │   │   │   └── Attachment.java
    │   │   ├── exception/
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   └── ResourceNotFoundException.java
    │   │   ├── repository/
    │   │   │   └── (All JPA Repositories)
    │   │   ├── security/
    │   │   │   ├── UserPrincipal.java
    │   │   │   ├── CustomUserDetailsService.java
    │   │   │   └── RestAuthenticationEntryPoint.java
    │   │   └── service/
    │   │       ├── AuthService.java
    │   │       ├── ComplaintService.java
    │   │       ├── AdminService.java
    │   │       ├── NotificationService.java
    │   │       └── ReportService.java
    │   └── resources/
    │       ├── application.properties
    │       ├── schema.sql
    │       └── data.sql
    └── test/
        ├── java/com/grievora/
        │   ├── GrievoraApplicationTests.java
        │   ├── ComplaintServiceTest.java
        │   ├── ComplaintStatusWorkflowTest.java
        │   └── ReportServiceTest.java
        └── resources/
            └── application-test.properties
```

---

## 🚀 Prerequisites

1. **Java JDK 21** (e.g. OpenJDK 21 or Eclipse Temurin 21)
   ```bash
   java -version
   # Expected output: openjdk version "21.x.x"
   ```
2. **Apache Maven 3.9+**
   ```bash
   mvn -version
   ```
3. **MySQL Server 8.0+** running on `localhost:3306`

---

## 🗄️ MySQL Database Setup

1. Start your local MySQL server:
   ```bash
   mysql -u root -p
   ```
2. Execute the database initialization:
   ```sql
   CREATE DATABASE IF NOT EXISTS grievora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   SHOW DATABASES;
   ```
3. Run schema and seed data manually if needed (Spring Boot also runs `schema.sql` and `DataInitializer` automatically on launch):
   ```bash
   mysql -u root -p grievora_db < src/main/resources/schema.sql
   mysql -u root -p grievora_db < src/main/resources/data.sql
   ```

---

## ⚙️ Configuration

Update `src/main/resources/application.properties` or set environment variables:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/grievora_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

---

## 🛠️ Building & Running

### 1. Run Unit & Integration Tests
```bash
mvn clean test
```

### 2. Run the Spring Boot Server
```bash
mvn spring-boot:run
```
The server will boot on port `8080`.

---

## 🔑 Pre-seeded Development Credentials

| Role | Name | Email | Password | Institutional ID |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Rajesh Verma | `admin@grievora.edu` | `Password@123` | `ADM-001` |
| **Faculty** | Dr. Rajiv Menon | `rajiv.menon@grievora.edu` | `Password@123` | `FAC-204` |
| **Student** | Rakshana | `rakshana@grievora.edu` | `Password@123` | `310625205222` |
| **Staff/Admin** | Kavita Nair | `kavita.nair@grievora.edu` | `Password@123` | `STF-102` |

---

## 📡 REST API Catalog

### Authentication
- `POST /api/auth/register` - Register a new Student or Faculty user
- `POST /api/auth/login` - Authenticate using email and password
- `POST /api/auth/logout` - Invalidate user session
- `GET /api/auth/me` - Get profile of currently logged-in user

### Complaints (Students & Faculty)
- `POST /api/complaints` - Submit a new complaint (generates reference code, e.g. `GRV-2026-0001`)
- `GET /api/complaints/my` - List complaints submitted by logged-in user (paginated)
- `GET /api/complaints/{id}` - Get full detail, status timeline, and comments (ownership checked)
- `POST /api/complaints/{id}/comments` - Add message or inquiry to complaint

### Admin Operations (`ROLE_ADMIN` only)
- `GET /api/admin/dashboard` - Executive metrics, breakdown charts, urgent open counts
- `GET /api/admin/complaints` - Filter, search, and paginate all complaints
- `PATCH /api/admin/complaints/{id}/status` - Advance lifecycle state (`SUBMITTED` -> `UNDER_REVIEW` -> `ASSIGNED` -> `IN_PROGRESS` -> `RESOLVED`)
- `PATCH /api/admin/complaints/{id}/priority` - Adjust priority level
- `PATCH /api/admin/complaints/{id}/assignment` - Assign department and staff engineer
- `POST /api/admin/complaints/{id}/resolution` - Mark resolved with mandatory resolution notes
- `POST /api/admin/complaints/{id}/rejection` - Reject complaint with mandatory justification
- `GET /api/admin/reports` - Analytics report with resolution rate and average resolution time
- `GET /api/admin/reports/export-csv` - Download CSV of filtered complaints

---

## 🔧 Troubleshooting

1. **`CommunicationsException: Communications link failure`**
   - Verify MySQL is active: `systemctl status mysql` or `services.msc` on Windows.
   - Confirm port 3306 is listening: `netstat -an | grep 3306`.
2. **`Access denied for user 'root'@'localhost'`**
   - Check password in `application.properties` or create dedicated user:
     ```sql
     CREATE USER 'grievora_user'@'localhost' IDENTIFIED BY 'Secret@123';
     GRANT ALL PRIVILEGES ON grievora_db.* TO 'grievora_user'@'localhost';
     FLUSH PRIVILEGES;
     ```
3. **CORS issues from frontend:**
   - The backend `SecurityConfig` allows origins `http://localhost:3000` and `http://localhost:5173`. If using custom domain or port, adjust `corsConfigurationSource()`.
