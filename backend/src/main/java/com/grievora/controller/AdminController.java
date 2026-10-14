package com.grievora.controller;

import com.grievora.dto.*;
import com.grievora.entity.ComplaintPriority;
import com.grievora.entity.ComplaintStatus;
import com.grievora.entity.User;
import com.grievora.exception.UnauthorizedException;
import com.grievora.repository.UserRepository;
import com.grievora.service.AdminService;
import com.grievora.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, ReportService reportService, UserRepository userRepository) {
        this.adminService = adminService;
        this.reportService = reportService;
        this.userRepository = userRepository;
    }

    private User getAdminUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("Unauthorized");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UnauthorizedException("Admin account not found"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboardOverview() {
        return ResponseEntity.ok(adminService.getDashboardOverview());
    }

    @GetMapping("/complaints")
    public ResponseEntity<Page<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) ComplaintPriority priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<ComplaintResponse> complaints = adminService.searchAndFilterComplaints(
                search, status, priority, category, departmentId, PageRequest.of(page, size, sort)
        );
        return ResponseEntity.ok(complaints);
    }

    @PatchMapping("/complaints/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintStatusUpdateRequest request,
            Authentication auth) {

        User admin = getAdminUser(auth);
        ComplaintResponse updated = adminService.updateStatus(id, request, admin.getId());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/complaints/{id}/priority")
    public ResponseEntity<ComplaintResponse> updatePriority(
            @PathVariable Long id,
            @Valid @RequestBody PriorityUpdateRequest request,
            Authentication auth) {

        User admin = getAdminUser(auth);
        ComplaintResponse updated = adminService.updatePriority(id, request, admin.getId());
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/complaints/{id}/assignment")
    public ResponseEntity<ComplaintResponse> updateAssignment(
            @PathVariable Long id,
            @RequestBody AssignmentUpdateRequest request,
            Authentication auth) {

        User admin = getAdminUser(auth);
        ComplaintResponse updated = adminService.updateAssignment(id, request, admin.getId());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/complaints/{id}/resolution")
    public ResponseEntity<ComplaintResponse> resolveComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ResolutionRequest request,
            Authentication auth) {

        User admin = getAdminUser(auth);
        ComplaintResponse resolved = adminService.resolveComplaint(id, request, admin.getId());
        return ResponseEntity.ok(resolved);
    }

    @PostMapping("/complaints/{id}/rejection")
    public ResponseEntity<ComplaintResponse> rejectComplaint(
            @PathVariable Long id,
            @Valid @RequestBody RejectionRequest request,
            Authentication auth) {

        User admin = getAdminUser(auth);
        ComplaintResponse rejected = adminService.rejectComplaint(id, request, admin.getId());
        return ResponseEntity.ok(rejected);
    }

    @GetMapping("/reports")
    public ResponseEntity<ReportDto> getReports() {
        return ResponseEntity.ok(reportService.generateAnalyticsReport());
    }

    @GetMapping("/reports/export-csv")
    public ResponseEntity<String> exportComplaintsCsv() {
        String csv = reportService.generateComplaintsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"grievora_campus_complaints.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}
