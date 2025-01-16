package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import java.time.LocalDateTime;

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    
    // Onboarding fields
    private String accountId;
    private String laptopSerialNumber;
    private String staffPassId;
    private boolean welcomePackIssued;
    private LocalDateTime onboardingCompletedAt;
    private String onboardingStatus; // PENDING, IN_PROGRESS, COMPLETED, FAILED

    // Default constructor
    public Employee() {
    }

    // Constructor with basic fields
    public Employee(String name, String email) {
        this.name = name;
        this.email = email;
        this.onboardingStatus = "PENDING";
    }

    // Getters and setters
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }

    public String getLaptopSerialNumber() { return laptopSerialNumber; }
    public void setLaptopSerialNumber(String laptopSerialNumber) { 
        this.laptopSerialNumber = laptopSerialNumber; 
    }

    public String getStaffPassId() { return staffPassId; }
    public void setStaffPassId(String staffPassId) { this.staffPassId = staffPassId; }

    public boolean isWelcomePackIssued() { return welcomePackIssued; }
    public void setWelcomePackIssued(boolean welcomePackIssued) { 
        this.welcomePackIssued = welcomePackIssued; 
    }

    public LocalDateTime getOnboardingCompletedAt() { return onboardingCompletedAt; }
    public void setOnboardingCompletedAt(LocalDateTime onboardingCompletedAt) { 
        this.onboardingCompletedAt = onboardingCompletedAt; 
    }

    public String getOnboardingStatus() { return onboardingStatus; }
    public void setOnboardingStatus(String onboardingStatus) { 
        this.onboardingStatus = onboardingStatus; 
    }
}