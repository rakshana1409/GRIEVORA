import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Code2,
  Download,
  Copy,
  Check,
  X,
  FileCode,
  Terminal,
  Database,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getApiMode, setApiMode, ApiMode } from '../api/client';

interface JavaExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SourceFile {
  id: string;
  name: string;
  category: 'config' | 'entity' | 'controller' | 'service' | 'test' | 'sql';
  path: string;
  content: string;
}

const JAVA_SOURCE_CATALOG: SourceFile[] = [
  {
    id: 'pom',
    name: 'pom.xml',
    category: 'config',
    path: 'backend/pom.xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>

    <groupId>com.grievora</groupId>
    <artifactId>grievora-backend</artifactId>
    <version>1.0.0</version>
    <name>Grievora Campus Complaint Management System</name>
    <description>Enterprise Smart Campus Complaint Management System with Spring Boot 3, Spring Security, JPA, and MySQL</description>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>`,
  },
  {
    id: 'schema',
    name: 'schema.sql (MySQL DDL)',
    category: 'sql',
    path: 'backend/src/main/resources/schema.sql',
    content: `-- GRIEVORA: Production MySQL 8.0+ Schema
CREATE DATABASE IF NOT EXISTS grievora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE grievora_db;

CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    contact_email VARCHAR(150),
    head_of_department VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    institutional_id VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL, -- 'STUDENT', 'FACULTY', 'ADMIN'
    department_id BIGINT,
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_reference VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(60) NOT NULL,
    location VARCHAR(150) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor_or_room VARCHAR(100),
    priority VARCHAR(30) NOT NULL,
    urgency_reason TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    submitted_by BIGINT NOT NULL,
    assigned_to BIGINT,
    assigned_department_id BIGINT,
    resolution_notes TEXT,
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_complaint_submitter FOREIGN KEY (submitted_by) REFERENCES users(id)
);`,
  },
  {
    id: 'security_config',
    name: 'SecurityConfig.java',
    category: 'config',
    path: 'backend/src/main/java/com/grievora/config/SecurityConfig.java',
    content: `package com.grievora.config;

import com.grievora.security.RestAccessDeniedHandler;
import com.grievora.security.RestAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configure(http))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/departments/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/complaints/**", "/api/notifications/**").authenticated()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}`,
  },
  {
    id: 'complaint_entity',
    name: 'Complaint.java (JPA Entity)',
    category: 'entity',
    path: 'backend/src/main/java/com/grievora/entity/Complaint.java',
    content: `package com.grievora.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_reference", nullable = false, unique = true, length = 50)
    private String complaintReference;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(nullable = false, length = 100)
    private String building;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ComplaintPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ComplaintStatus status = ComplaintStatus.SUBMITTED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_department_id")
    private Department assignedDepartment;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    // Getters and Setters...
}`,
  },
  {
    id: 'complaint_controller',
    name: 'ComplaintController.java (REST)',
    category: 'controller',
    path: 'backend/src/main/java/com/grievora/controller/ComplaintController.java',
    content: `package com.grievora.controller;

import com.grievora.dto.*;
import com.grievora.entity.User;
import com.grievora.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ComplaintResponse> submitComplaint(@Valid @RequestBody ComplaintRequest request, Authentication auth) {
        User user = (User) auth.getPrincipal();
        ComplaintResponse response = complaintService.createComplaint(request, user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ComplaintResponse>> getMyComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(complaintService.getUserComplaints(user.getId(), PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDetailResponse> getComplaintDetail(@PathVariable Long id, Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(complaintService.getComplaintDetails(id, user.getId(), user.getRole()));
    }
}`,
  },
  {
    id: 'complaint_service',
    name: 'ComplaintService.java',
    category: 'service',
    path: 'backend/src/main/java/com/grievora/service/ComplaintService.java',
    content: `package com.grievora.service;

import com.grievora.dto.*;
import com.grievora.entity.*;
import com.grievora.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.Year;

@Service
public class ComplaintService {

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        long count = complaintRepository.count() + 1;
        String reference = String.format("GRV-%d-%04d", Year.now().getValue(), count);

        Complaint complaint = new Complaint();
        complaint.setComplaintReference(reference);
        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setCategory(request.getCategory().trim());
        complaint.setLocation(request.getLocation().trim());
        complaint.setBuilding(request.getBuilding().trim());
        complaint.setPriority(request.getPriority());
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setSubmittedBy(user);

        complaint = complaintRepository.save(complaint);

        historyRepository.save(new ComplaintStatusHistory(
            complaint, null, ComplaintStatus.SUBMITTED, user, "Complaint logged into Grievora system."
        ));

        notificationService.createNotification(user, complaint, "Complaint Logged", "Reference: " + reference);

        return ComplaintResponse.fromEntity(complaint);
    }
}`,
  },
  {
    id: 'report_test',
    name: 'ReportServiceTest.java (JUnit 5)',
    category: 'test',
    path: 'backend/src/test/java/com/grievora/ReportServiceTest.java',
    content: `package com.grievora;

import com.grievora.dto.ReportDto;
import com.grievora.entity.Complaint;
import com.grievora.entity.ComplaintStatus;
import com.grievora.repository.ComplaintRepository;
import com.grievora.service.ReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @InjectMocks
    private ReportService reportService;

    @Test
    @DisplayName("Verify resolution rate calculation and non-inclusion of rejected tickets as resolved")
    void testResolutionRateCalculation() {
        when(complaintRepository.count()).thenReturn(10L);
        when(complaintRepository.countByStatus(ComplaintStatus.RESOLVED)).thenReturn(6L);
        when(complaintRepository.countByStatus(ComplaintStatus.REJECTED)).thenReturn(2L);

        Complaint c = new Complaint();
        c.setSubmittedAt(LocalDateTime.now().minusHours(4));
        c.setResolvedAt(LocalDateTime.now());
        when(complaintRepository.findAllResolved()).thenReturn(List.of(c));

        ReportDto report = reportService.generateAnalyticsReport();

        assertEquals(10L, report.getTotalReceived());
        assertEquals(6L, report.getTotalResolved());
        assertEquals(2L, report.getTotalRejected());
        assertEquals(2L, report.getTotalOpen());
        assertEquals(60.0, report.getResolutionRatePercentage());
    }
}`,
  },
];

export const JavaExplorerModal: React.FC<JavaExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('pom');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [apiMode, setMode] = useState<ApiMode>(getApiMode());

  if (!isOpen) return null;

  const activeFile = JAVA_SOURCE_CATALOG.find((f) => f.id === selectedFileId) || JAVA_SOURCE_CATALOG[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleModeChange = (mode: ApiMode) => {
    setMode(mode);
    setApiMode(mode);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const zip = new JSZip();

      // Folder structure
      const root = zip.folder('grievora-backend');
      if (root) {
        root.file('pom.xml', JAVA_SOURCE_CATALOG.find((f) => f.id === 'pom')?.content || '');
        root.file(
          'README.md',
          `# GRIEVORA - Spring Boot 3 & MySQL Backend\n\nPrerequisites: Java 21, Maven 3.9+, MySQL 8.0+\n\nRun:\n1. CREATE DATABASE grievora_db;\n2. mvn clean spring-boot:run\n3. Port 8080 active.`
        );

        const src = root.folder('src');
        const main = src?.folder('main');
        const java = main?.folder('java')?.folder('com')?.folder('grievora');
        const resources = main?.folder('resources');
        const test = src?.folder('test')?.folder('java')?.folder('com')?.folder('grievora');

        resources?.file('schema.sql', JAVA_SOURCE_CATALOG.find((f) => f.id === 'schema')?.content || '');
        resources?.file(
          'application.properties',
          `spring.application.name=grievora-backend\nserver.port=8080\nspring.datasource.url=jdbc:mysql://localhost:3306/grievora_db\nspring.datasource.username=root\nspring.datasource.password=password\nspring.jpa.hibernate.ddl-auto=update\n`
        );

        java?.folder('config')?.file('SecurityConfig.java', JAVA_SOURCE_CATALOG.find((f) => f.id === 'security_config')?.content || '');
        java?.folder('entity')?.file('Complaint.java', JAVA_SOURCE_CATALOG.find((f) => f.id === 'complaint_entity')?.content || '');
        java?.folder('controller')?.file('ComplaintController.java', JAVA_SOURCE_CATALOG.find((f) => f.id === 'complaint_controller')?.content || '');
        java?.folder('service')?.file('ComplaintService.java', JAVA_SOURCE_CATALOG.find((f) => f.id === 'complaint_service')?.content || '');
        test?.file('ReportServiceTest.java', JAVA_SOURCE_CATALOG.find((f) => f.id === 'report_test')?.content || '');
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'grievora-spring-boot-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">Java Spring Boot 3 Backend Hub</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Java 21 · Spring Boot 3.3.4 · MySQL 8.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete, production-grade Java architecture with Spring Security & JPA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Bundling...' : 'Download Project (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-banner: Local Spring Boot Connector */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>Target Backend Connection:</span>
            <div className="inline-flex rounded-lg bg-slate-200 p-0.5">
              <button
                onClick={() => handleModeChange('emulated')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  apiMode === 'emulated'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In-App Simulated DB (Active)
              </button>
              <button
                onClick={() => handleModeChange('spring_boot')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  apiMode === 'spring_boot'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Local Spring Boot (localhost:8080)
              </button>
            </div>
          </div>

          <div className="text-slate-500 font-mono">
            Files location in workspace: <span className="text-slate-800">/backend/*</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Sidebar */}
          <div className="w-64 border-r border-slate-200 bg-slate-50/70 p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Project Source Files
            </div>
            {JAVA_SOURCE_CATALOG.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                  selectedFileId === file.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${selectedFileId === file.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="truncate">{file.name}</span>
              </button>
            ))}

            <div className="mt-4 pt-3 border-t border-slate-200 px-3">
              <div className="text-[11px] font-semibold text-slate-500 mb-2">Run Locally Commands:</div>
              <div className="bg-slate-900 text-slate-200 rounded p-2 text-[10px] font-mono leading-relaxed">
                <div>cd backend</div>
                <div className="text-emerald-400">mvn clean test</div>
                <div className="text-indigo-400">mvn spring-boot:run</div>
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 text-slate-100">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs">
              <span className="font-mono text-slate-300">{activeFile.path}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 font-mono text-xs overflow-auto text-slate-200 leading-relaxed">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
