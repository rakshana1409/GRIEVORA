package com.grievora.entity;

public enum ComplaintStatus {
    SUBMITTED,
    UNDER_REVIEW,
    ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    REJECTED;

    public boolean canTransitionTo(ComplaintStatus next) {
        if (this == next) return true;
        return switch (this) {
            case SUBMITTED -> (next == UNDER_REVIEW || next == REJECTED);
            case UNDER_REVIEW -> (next == ASSIGNED || next == IN_PROGRESS || next == REJECTED);
            case ASSIGNED -> (next == IN_PROGRESS || next == REJECTED);
            case IN_PROGRESS -> (next == RESOLVED || next == REJECTED || next == ASSIGNED);
            case RESOLVED, REJECTED -> false; // Terminal states
        };
    }
}
