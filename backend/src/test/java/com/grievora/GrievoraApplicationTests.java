package com.grievora;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class GrievoraApplicationTests {

    @Test
    void contextLoads() {
        // Validates that Spring Boot application context initializes cleanly
    }
}
