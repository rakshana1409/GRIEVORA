package com.grievora.dto;

import com.grievora.entity.Department;

public class DepartmentDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String contactEmail;
    private String headOfDepartment;

    public DepartmentDto() {}

    public static DepartmentDto fromEntity(Department d) {
        if (d == null) return null;
        DepartmentDto dto = new DepartmentDto();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setCode(d.getCode());
        dto.setDescription(d.getDescription());
        dto.setContactEmail(d.getContactEmail());
        dto.setHeadOfDepartment(d.getHeadOfDepartment());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getHeadOfDepartment() { return headOfDepartment; }
    public void setHeadOfDepartment(String headOfDepartment) { this.headOfDepartment = headOfDepartment; }
}
