# GRIEVORA — Smart Campus Complaint Management System

> **“Your Voice. Our Campus. Better Together.”**
> *GRIEVORA = Grievance + Aura*

GRIEVORA is a full-stack, enterprise-grade college engineering project for facility complaint tracking, automated SLA monitoring, administrative task allocation, and real-time resolution analytics across academic campuses.

---

## 🏛️ System Architecture

- **Backend:** Java 21 & Spring Boot 3.3.4
- **Security:** Spring Security 6 with session-based authentication, role authorization (`STUDENT`, `FACULTY`, `ADMIN`), and BCrypt password encryption
- **Data Access:** Spring Data JPA with Hibernate ORM
- **Database:** MySQL 8.0+ (with embedded H2 compatibility for tests)
- **Validation:** Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`, `@AssertTrue`)
- **Testing:** JUnit 5, Mockito, and Spring Boot Test
- **Frontend:** React 19, TypeScript, and Tailwind CSS v4

---

## 📁 Repository Structure

```
.
├── backend/                              # Complete Java Spring Boot 3 Maven Project
│   ├── pom.xml                           # Dependencies & compiler configuration
│   ├── README.md                         # Detailed backend setup & API documentation
│   └── src/
│       ├── main/
│       │   ├── java/com/grievora/
│       │   │   ├── GrievoraApplication.java
│       │   │   ├── config/               # SecurityConfig, DataInitializer, CORS
│       │   │   ├── controller/           # AuthController, ComplaintController, AdminController
│       │   │   ├── dto/                  # DTOs with validation annotations
│       │   │   ├── entity/               # JPA Entities (User, Complaint, Department, etc.)
│       │   │   ├── exception/            # GlobalExceptionHandler, Custom Exceptions
│       │   │   ├── repository/           # Spring Data JPA Repositories
│       │   │   ├── security/             # UserPrincipal, CustomUserDetailsService
│       │   │   └── service/              # ComplaintService, AdminService, ReportService
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── schema.sql            # Production MySQL DDL scripts
│       │       └── data.sql              # Pre-seeded sample records & BCrypt hashes
│       └── test/
│           ├── java/com/grievora/        # JUnit 5 & Mockito test suites
│           └── resources/application-test.properties
│
├── src/                                  # React 19 Frontend Web Application
│   ├── api/                              # Client API service & localStorage database store
│   ├── components/                       # StatusBadge, PriorityBadge, Timeline, JavaExplorerModal
│   ├── pages/                            # Landing, Login, Register, Dashboards, Reports
│   ├── types/                            # Domain TypeScript interfaces
│   ├── App.tsx                           # Main router & role state coordinator
│   └── index.css                         # Tailwind CSS v4 styling
├── package.json
└── vite.config.ts
```

---

## 🚀 Running the Java Spring Boot Backend Locally

### 1. Prerequisites
- **Java JDK 21** (`java -version`)
- **Apache Maven 3.9+** (`mvn -version`)
- **MySQL Server 8.0+** running on `localhost:3306`

### 2. Setup MySQL Database
```sql
CREATE DATABASE IF NOT EXISTS grievora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Run Automated Tests
```bash
cd backend
mvn clean test
```

### 4. Start Spring Boot Server
```bash
mvn spring-boot:run
```
The REST API will boot on `http://localhost:8080/api`.

---

## 🔑 Pre-Configured Development Accounts

All sample accounts use the password: `Password@123`

| Role | Name | Email | Institutional ID |
| :--- | :--- | :--- | :--- |
| **Admin** | Rajesh Verma (Chief Admin) | `admin@grievora.edu` | `ADM-001` |
| **Faculty** | Dr. Rajiv Menon | `rajiv.menon@grievora.edu` | `FAC-204` |
| **Student** | Rakshana | `rakshana@grievora.edu` | `310625205222` |
| **Staff / Tech** | Kavita Nair (Staff Engineer) | `kavita.nair@grievora.edu` | `STF-102` |

---

## 📡 REST API Summary

- `POST /api/auth/register` — Student / Faculty registration
- `POST /api/auth/login` — Session login
- `POST /api/auth/logout` — Invalidate session
- `GET /api/auth/me` — Authenticated profile
- `POST /api/complaints` — Submit complaint (auto-generates `GRV-2026-XXXX`)
- `GET /api/complaints/my` — Complainant's complaints
- `GET /api/complaints/{id}` — Detail, chronological timeline, comments
- `POST /api/complaints/{id}/comments` — Add comment / enquiry
- `GET /api/admin/dashboard` — Aggregated KPI metrics
- `GET /api/admin/complaints` — Filter, search, paginate
- `PATCH /api/admin/complaints/{id}/status` — Transition state with mandatory update message
- `PATCH /api/admin/complaints/{id}/priority` — Adjust priority
- `PATCH /api/admin/complaints/{id}/assignment` — Assign department & staff
- `POST /api/admin/complaints/{id}/resolution` — Mark resolved with resolution notes
- `POST /api/admin/complaints/{id}/rejection` — Reject with mandatory reason
- `GET /api/admin/reports` — Analytics report
- `GET /api/admin/reports/export-csv` — Export complaints to CSV
