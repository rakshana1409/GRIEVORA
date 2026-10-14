package com.grievora.service;

import com.grievora.dto.AuthRequest;
import com.grievora.dto.AuthResponse;
import com.grievora.dto.RegisterRequest;
import com.grievora.dto.UserDto;
import com.grievora.entity.Department;
import com.grievora.entity.Role;
import com.grievora.entity.User;
import com.grievora.exception.BadRequestException;
import com.grievora.exception.ResourceNotFoundException;
import com.grievora.repository.DepartmentRepository;
import com.grievora.repository.UserRepository;
import com.grievora.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       DepartmentRepository departmentRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Enforce password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirmation password do not match");
        }

        // Prevent self-registration as ADMIN
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Administrator registration is restricted to system administrators");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with this institutional email already exists");
        }

        if (userRepository.existsByInstitutionalId(request.getInstitutionalId().trim())) {
            throw new BadRequestException("An account with this institutional ID already exists");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        }

        User user = new User(
                request.getFullName().trim(),
                request.getInstitutionalId().trim(),
                normalizedEmail,
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                department,
                request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null
        );

        user = userRepository.save(user);

        return new AuthResponse(
                "Registration successful. Please sign in with your credentials.",
                UserDto.fromEntity(user),
                "/login"
        );
    }

    public AuthResponse login(AuthRequest request, HttpServletRequest httpRequest) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String redirect = (user.getRole() == Role.ADMIN) ? "/admin/overview" : "/dashboard";

        return new AuthResponse(
                "Login successful. Welcome back, " + user.getFullName(),
                UserDto.fromEntity(user),
                redirect
        );
    }

    public void logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }

        String email = auth.getName();
        return userRepository.findByEmail(email)
                .map(UserDto::fromEntity)
                .orElse(null);
    }
}
