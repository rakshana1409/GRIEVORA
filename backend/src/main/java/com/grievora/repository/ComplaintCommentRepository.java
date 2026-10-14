package com.grievora.repository;

import com.grievora.entity.CommentVisibility;
import com.grievora.entity.ComplaintComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintCommentRepository extends JpaRepository<ComplaintComment, Long> {
    List<ComplaintComment> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
    List<ComplaintComment> findByComplaintIdAndVisibilityOrderByCreatedAtAsc(Long complaintId, CommentVisibility visibility);
}
