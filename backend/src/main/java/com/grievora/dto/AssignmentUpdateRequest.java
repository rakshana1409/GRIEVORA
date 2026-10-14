package com.grievora.dto;

public class AssignmentUpdateRequest {

    private Long departmentId;
    private Long staffUserId;
    private String assignmentNote;

    public AssignmentUpdateRequest() {}

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public Long getStaffUserId() { return staffUserId; }
    public void setStaffUserId(Long staffUserId) { this.staffUserId = staffUserId; }

    public String getAssignmentNote() { return assignmentNote; }
    public void setAssignmentNote(String assignmentNote) { this.assignmentNote = assignmentNote; }
}
