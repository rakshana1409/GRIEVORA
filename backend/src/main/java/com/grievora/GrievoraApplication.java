package com.grievora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * GRIEVORA: Smart Campus Complaint Management System
 * Main Spring Boot Application Entry Point
 *
 * "Your Voice. Our Campus. Better Together."
 */
@SpringBootApplication
@EnableJpaAuditing
public class GrievoraApplication {

    public static void main(String[] args) {
        SpringApplication.run(GrievoraApplication.class, args);
    }
}
