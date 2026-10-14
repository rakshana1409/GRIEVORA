package com.grievora;

import com.grievora.entity.ComplaintStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ComplaintStatusWorkflowTest {

    @Test
    @DisplayName("Verify valid complaint state machine progression")
    void testValidTransitions() {
        // SUBMITTED can move to UNDER_REVIEW or REJECTED
        assertTrue(ComplaintStatus.SUBMITTED.canTransitionTo(ComplaintStatus.UNDER_REVIEW));
        assertTrue(ComplaintStatus.SUBMITTED.canTransitionTo(ComplaintStatus.REJECTED));
        assertFalse(ComplaintStatus.SUBMITTED.canTransitionTo(ComplaintStatus.RESOLVED));

        // UNDER_REVIEW can move to ASSIGNED, IN_PROGRESS, or REJECTED
        assertTrue(ComplaintStatus.UNDER_REVIEW.canTransitionTo(ComplaintStatus.ASSIGNED));
        assertTrue(ComplaintStatus.UNDER_REVIEW.canTransitionTo(ComplaintStatus.IN_PROGRESS));
        assertTrue(ComplaintStatus.UNDER_REVIEW.canTransitionTo(ComplaintStatus.REJECTED));
        assertFalse(ComplaintStatus.UNDER_REVIEW.canTransitionTo(ComplaintStatus.RESOLVED));

        // ASSIGNED can move to IN_PROGRESS or REJECTED
        assertTrue(ComplaintStatus.ASSIGNED.canTransitionTo(ComplaintStatus.IN_PROGRESS));
        assertTrue(ComplaintStatus.ASSIGNED.canTransitionTo(ComplaintStatus.REJECTED));

        // IN_PROGRESS can move to RESOLVED or REJECTED
        assertTrue(ComplaintStatus.IN_PROGRESS.canTransitionTo(ComplaintStatus.RESOLVED));
        assertTrue(ComplaintStatus.IN_PROGRESS.canTransitionTo(ComplaintStatus.REJECTED));

        // Terminal states cannot transition to other states
        assertFalse(ComplaintStatus.RESOLVED.canTransitionTo(ComplaintStatus.IN_PROGRESS));
        assertFalse(ComplaintStatus.REJECTED.canTransitionTo(ComplaintStatus.IN_PROGRESS));
    }
}
