package com.grievora.dto;

import com.grievora.entity.ComplaintPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Detailed description is required")
    @Size(min = 20, max = 2500, message = "Description must provide at least 20 characters of detail")
    private String description;

    @NotBlank(message = "Campus location is required")
    private String location;

    @NotBlank(message = "Building or block is required")
    private String building;

    private String floorOrRoom;

    @NotNull(message = "Priority is required")
    private ComplaintPriority priority;

    private String urgencyReason;

    public ComplaintRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getFloorOrRoom() { return floorOrRoom; }
    public void setFloorOrRoom(String floorOrRoom) { this.floorOrRoom = floorOrRoom; }

    public ComplaintPriority getPriority() { return priority; }
    public void setPriority(ComplaintPriority priority) { this.priority = priority; }

    public String getUrgencyReason() { return urgencyReason; }
    public void setUrgencyReason(String urgencyReason) { this.urgencyReason = urgencyReason; }
}
