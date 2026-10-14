package com.grievora.repository;

import com.grievora.entity.Complaint;
import com.grievora.entity.ComplaintPriority;
import com.grievora.entity.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long>, JpaSpecificationExecutor<Complaint> {

    Optional<Complaint> findByComplaintReference(String complaintReference);

    Page<Complaint> findBySubmittedById(Long userId, Pageable pageable);

    List<Complaint> findBySubmittedByIdOrderBySubmittedAtDesc(Long userId);

    long countBySubmittedById(Long userId);

    long countBySubmittedByIdAndStatus(Long userId, ComplaintStatus status);

    long countByStatus(ComplaintStatus status);

    long countByPriority(ComplaintPriority priority);

    long countByStatusNot(ComplaintStatus status);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.priority = 'URGENT' AND c.status NOT IN ('RESOLVED', 'REJECTED')")
    long countUrgentOpenComplaints();

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countComplaintsByCategory();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countComplaintsByStatus();

    @Query("SELECT c.priority, COUNT(c) FROM Complaint c GROUP BY c.priority")
    List<Object[]> countComplaintsByPriority();

    @Query("SELECT c.assignedDepartment.name, COUNT(c) FROM Complaint c WHERE c.assignedDepartment IS NOT NULL GROUP BY c.assignedDepartment.name")
    List<Object[]> countComplaintsByDepartment();

    @Query("SELECT c FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'REJECTED') AND c.submittedAt <= :cutoff ORDER BY c.submittedAt ASC")
    List<Complaint> findLongPendingComplaints(@Param("cutoff") LocalDateTime cutoff, Pageable pageable);

    @Query("SELECT c FROM Complaint c WHERE c.resolvedAt IS NOT NULL AND c.status = 'RESOLVED'")
    List<Complaint> findAllResolved();
}
