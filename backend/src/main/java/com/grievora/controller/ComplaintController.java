package com.grievora.controller;

import com.grievora.dto.*;
import com.grievora.entity.User;
import com.grievora.exception.UnauthorizedException;
import com.grievora.repository.UserRepository;
import com.grievora.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    public ComplaintController(ComplaintService complaintService, UserRepository userRepository) {
        this.complaintService = complaintService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UnauthorizedException("User record not found"));
    }

    @PostMapping
    public ResponseEntity<ComplaintResponse> submitComplaint(@Valid @RequestBody ComplaintRequest request, Authentication auth) {
        User user = getAuthenticatedUser(auth);
        ComplaintResponse response = complaintService.createComplaint(request, user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ComplaintResponse>> getMyComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            Authentication auth) {

        User user = getAuthenticatedUser(auth);
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<ComplaintResponse> complaints = complaintService.getUserComplaints(user.getId(), PageRequest.of(page, size, sort));
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDetailResponse> getComplaintDetail(@PathVariable Long id, Authentication auth) {
        User user = getAuthenticatedUser(auth);
        ComplaintDetailResponse detail = complaintService.getComplaintDetails(id, user.getId(), user.getRole());
        return ResponseEntity.ok(detail);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            Authentication auth) {

        User user = getAuthenticatedUser(auth);
        CommentResponse response = complaintService.addComment(id, request, user.getId(), user.getRole());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
