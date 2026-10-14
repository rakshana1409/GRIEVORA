package com.grievora.dto;

import com.grievora.entity.Role;
import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Institutional ID is required")
    @Size(min = 3, max = 50, message = "Institutional ID must be valid")
    private String institutionalId;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid institutional email address")
    private String email;

    @NotNull(message = "Role is required (STUDENT or FACULTY)")
    private Role role;

    private Long departmentId;

    @Pattern(regexp = "^$|[0-9+\\-() ]{7,20}", message = "Phone number must be valid")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @AssertTrue(message = "You must accept the terms and conditions")
    private boolean termsAccepted;

    public RegisterRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getInstitutionalId() { return institutionalId; }
    public void setInstitutionalId(String institutionalId) { this.institutionalId = institutionalId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }

    public boolean isTermsAccepted() { return termsAccepted; }
    public void setTermsAccepted(boolean termsAccepted) { this.termsAccepted = termsAccepted; }
}
