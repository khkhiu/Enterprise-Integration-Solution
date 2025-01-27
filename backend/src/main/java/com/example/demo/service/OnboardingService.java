package com.example.demo.service;

import com.example.demo.entity.Employee;
import com.example.demo.repository.EmployeeRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
public class OnboardingService {
    private static final Logger logger = LoggerFactory.getLogger(OnboardingService.class);
    private final Random random = new Random();
    private final EmployeeRepository employeeRepository;

    public OnboardingService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public void startOnboarding(Employee employee) {
        try {
            employee.setOnboardingStatus("IN_PROGRESS");
            
            // Create account
            createAccount(employee);
            
            // Issue equipment and welcome pack
            issueLaptop(employee);
            issueStaffPass(employee);
            issueWelcomePack(employee);

            // Mark onboarding as completed
            employee.setOnboardingStatus("COMPLETED");
            employee.setOnboardingCompletedAt(LocalDateTime.now());
            
            logger.info("Onboarding completed successfully for employee: {}", employee.getName());
        } catch (Exception e) {
            employee.setOnboardingStatus("FAILED");
            logger.error("Onboarding failed for employee: {}", employee.getName(), e);
            throw new RuntimeException("Onboarding failed: " + e.getMessage());
        }
    }

    private void createAccount(Employee employee) {
        logger.info("Creating account for: {}", employee.getName());
        if (random.nextDouble() < 0.1) { // 10% chance of failure
            throw new RuntimeException("Account creation failed");
        }
        // Generate a unique account ID
        String accountId = "ACC-" + UUID.randomUUID().toString().substring(0, 8);
        employee.setAccountId(accountId);
        logger.info("Account created with ID: {}", accountId);
    }

    private void issueLaptop(Employee employee) {
        logger.info("Issuing laptop for: {}", employee.getName());
        if (random.nextDouble() < 0.1) {
            throw new RuntimeException("Laptop assignment failed");
        }
        // Generate a unique laptop serial number
        String serialNumber = "LAP-" + UUID.randomUUID().toString().substring(0, 8);
        employee.setLaptopSerialNumber(serialNumber);
        logger.info("Laptop issued with serial number: {}", serialNumber);
    }

    private void issueStaffPass(Employee employee) {
        logger.info("Issuing staff pass for: {}", employee.getName());
        if (random.nextDouble() < 0.1) {
            throw new RuntimeException("Staff pass creation failed");
        }
        // Generate a unique staff pass ID
        String passId = "PASS-" + UUID.randomUUID().toString().substring(0, 8);
        employee.setStaffPassId(passId);
        logger.info("Staff pass issued with ID: {}", passId);
    }

    private void issueWelcomePack(Employee employee) {
        logger.info("Issuing welcome pack for: {}", employee.getName());
        if (random.nextDouble() < 0.1) {
            throw new RuntimeException("Welcome pack assignment failed");
        }
        employee.setWelcomePackIssued(true);
        logger.info("Welcome pack issued successfully");
    }
}