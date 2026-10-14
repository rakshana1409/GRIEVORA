package com.grievora;

import com.grievora.dto.ComplaintRequest;
import com.grievora.dto.ComplaintResponse;
import com.grievora.entity.Complaint;
import com.grievora.entity.ComplaintPriority;
import com.grievora.entity.ComplaintStatus;
import com.grievora.entity.Role;
import com.grievora.entity.User;
import com.grievora.exception.BadRequestException;
import com.grievora.repository.AttachmentRepository;
import com.grievora.repository.ComplaintCommentRepository;
import com.grievora.repository.ComplaintRepository;
import com.grievora.repository.ComplaintStatusHistoryRepository;
import com.grievora.repository.UserRepository;
import com.grievora.service.ComplaintService;
import com.grievora.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @Mock
    private ComplaintStatusHistoryRepository historyRepository;

    @Mock
    private ComplaintCommentRepository commentRepository;

    @Mock
    private AttachmentRepository attachmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ComplaintService complaintService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Rakshana", "310625205222", "rakshana@grievora.edu", "hash", Role.STUDENT, null, "1234567890");
        sampleUser.setId(10L);
    }

    @Test
    @DisplayName("Should create complaint with initial SUBMITTED status and generate reference")
    void testCreateComplaintSuccess() {
        ComplaintRequest req = new ComplaintRequest();
        req.setTitle("Library AC cooling failure");
        req.setCategory("Electrical Issues");
        req.setDescription("Air conditioning unit in Library Block B is leaking warm air.");
        req.setLocation("Central Library");
        req.setBuilding("Block B");
        req.setFloorOrRoom("2nd Floor");
        req.setPriority(ComplaintPriority.MEDIUM);

        when(userRepository.findById(10L)).thenReturn(Optional.of(sampleUser));
        when(complaintRepository.count()).thenReturn(5L);
        when(complaintRepository.save(any(Complaint.class))).thenAnswer(invocation -> {
            Complaint saved = invocation.getArgument(0);
            saved.setId(101L);
            return saved;
        });

        ComplaintResponse response = complaintService.createComplaint(req, 10L);

        assertNotNull(response);
        assertEquals(ComplaintStatus.SUBMITTED, response.getStatus());
        assertTrue(response.getComplaintReference().startsWith("GRV-"));
        assertEquals("Library AC cooling failure", response.getTitle());

        verify(historyRepository, times(1)).save(any());
        verify(notificationService, times(1)).createNotification(eq(sampleUser), any(), anyString(), anyString());
    }

    @Test
    @DisplayName("Should reject URGENT complaint if justification is empty")
    void testUrgentWithoutReasonFails() {
        ComplaintRequest req = new ComplaintRequest();
        req.setTitle("Major water pipe burst");
        req.setCategory("Plumbing and Water Supply");
        req.setDescription("Water pipe burst in hallway creating dangerous flooding.");
        req.setLocation("Academic Block C");
        req.setBuilding("Block C");
        req.setPriority(ComplaintPriority.URGENT);
        req.setUrgencyReason(""); // Empty justification

        when(userRepository.findById(10L)).thenReturn(Optional.of(sampleUser));

        assertThrows(BadRequestException.class, () -> complaintService.createComplaint(req, 10L));
    }
}
