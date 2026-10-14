package com.grievora;

import com.grievora.dto.ReportDto;
import com.grievora.entity.Complaint;
import com.grievora.entity.ComplaintPriority;
import com.grievora.entity.ComplaintStatus;
import com.grievora.repository.ComplaintRepository;
import com.grievora.service.ReportService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @InjectMocks
    private ReportService reportService;

    @Test
    @DisplayName("Verify resolution rate calculation and non-inclusion of rejected tickets as resolved")
    void testResolutionRateCalculation() {
        when(complaintRepository.count()).thenReturn(10L);
        when(complaintRepository.countByStatus(ComplaintStatus.RESOLVED)).thenReturn(6L);
        when(complaintRepository.countByStatus(ComplaintStatus.REJECTED)).thenReturn(2L);
        when(complaintRepository.countComplaintsByCategory()).thenReturn(Collections.emptyList());
        when(complaintRepository.countComplaintsByPriority()).thenReturn(Collections.emptyList());
        when(complaintRepository.countComplaintsByDepartment()).thenReturn(Collections.emptyList());
        when(complaintRepository.findAll()).thenReturn(Collections.emptyList());

        // Create resolved complaint resolved in 4 hours
        Complaint c = new Complaint();
        c.setSubmittedAt(LocalDateTime.now().minusHours(4));
        c.setResolvedAt(LocalDateTime.now());
        when(complaintRepository.findAllResolved()).thenReturn(List.of(c));

        ReportDto report = reportService.generateAnalyticsReport();

        assertNotNull(report);
        assertEquals(10L, report.getTotalReceived());
        assertEquals(6L, report.getTotalResolved());
        assertEquals(2L, report.getTotalRejected());
        assertEquals(2L, report.getTotalOpen()); // 10 - 6 - 2 = 2
        assertEquals(60.0, report.getResolutionRatePercentage()); // (6 / 10) * 100
        assertTrue(report.getAverageResolutionTimeHours() > 3.5 && report.getAverageResolutionTimeHours() < 4.5);
    }
}
