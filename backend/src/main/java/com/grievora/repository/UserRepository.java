package com.grievora.repository;

import com.grievora.entity.Role;
import com.grievora.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByInstitutionalId(String institutionalId);
    boolean existsByEmail(String email);
    boolean existsByInstitutionalId(String institutionalId);
    List<User> findByRole(Role role);
    List<User> findByDepartmentId(Long departmentId);
}
