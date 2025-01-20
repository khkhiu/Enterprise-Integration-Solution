package com.example.demo.controller;

import com.example.demo.entity.Employee;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.OnboardingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @Autowired
    private EmployeeRepository repository; // Connects to the database

    @Autowired
    private KafkaTemplate<String, Employee> kafkaTemplate; // Sends messages to Kafka

    @Autowired
    private OnboardingService onboardingService; // Service for onboarding functionality

    private static final String TOPIC = "new-employees";

    // CREATE: Adding of a new employee
    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        try {
            Employee savedEmployee = repository.save(employee); // Save to database
            kafkaTemplate.send(TOPIC, savedEmployee); // Notify other systems
            return savedEmployee;
        } catch (Exception e) {
            throw new RuntimeException("Failed to add employee: " + e.getMessage());
        }
    }

    // READ: Get all employees
    @GetMapping
    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    // READ: Get a single employee by ID
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    // UPDATE: Update an existing employee
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee updatedEmployee) {
        return repository.findById(id)
                .map(existingEmployee -> {
                    // Update basic info
                    existingEmployee.setName(updatedEmployee.getName());
                    existingEmployee.setEmail(updatedEmployee.getEmail());
                    
                    // Update onboarding status and related fields
                    existingEmployee.setOnboardingStatus(updatedEmployee.getOnboardingStatus());
                    existingEmployee.setOnboardingCompletedAt(updatedEmployee.getOnboardingCompletedAt());
                    
                    // Update equipment and access
                    existingEmployee.setAccountId(updatedEmployee.getAccountId());
                    existingEmployee.setLaptopSerialNumber(updatedEmployee.getLaptopSerialNumber());
                    existingEmployee.setStaffPassId(updatedEmployee.getStaffPassId());
                    existingEmployee.setWelcomePackIssued(updatedEmployee.isWelcomePackIssued());
                    
                    return repository.save(existingEmployee);
                })
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    // DELETE: Delete an employee
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Employee with id " + id + " has been deleted.";
        } else {
            throw new RuntimeException("Employee not found with id: " + id);
        }
    }

    // Onboarding: Get onboarding details for an employee
    @GetMapping("/{id}/onboarding")
    public ResponseEntity<?> getOnboardingDetails(@PathVariable Long id) {
        try {
            Employee employee = onboardingService.getEmployeeById(id);
            if (employee == null) {
                return ResponseEntity.notFound().build();
            }

            // Create a DTO with only the onboarding-related fields
            var onboardingDetails = new OnboardingDetailsDTO(
                    employee.getOnboardingStatus(),
                    employee.getOnboardingCompletedAt(),
                    employee.getAccountId(),
                    employee.getLaptopSerialNumber(),
                    employee.getStaffPassId(),
                    employee.isWelcomePackIssued()
            );

            return ResponseEntity.ok(onboardingDetails);
        } catch (Exception e) {
            logger.error("Error fetching onboarding details for employee {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().body("Error fetching onboarding details");
        }
    }

    // Onboarding: Retry onboarding for an employee
    @PostMapping("/{id}/onboarding/retry")
    public ResponseEntity<?> retryOnboarding(@PathVariable Long id) {
        try {
            Employee employee = onboardingService.getEmployeeById(id);
            if (employee == null) {
                return ResponseEntity.notFound().build();
            }

            onboardingService.startOnboarding(employee);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error retrying onboarding for employee {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().body("Error retrying onboarding");
        }
    }

    // DTO class for onboarding details
    private static class OnboardingDetailsDTO {
        private String status;
        private LocalDateTime completedAt;
        private String accountId;
        private String laptopSerialNumber;
        private String staffPassId;
        private boolean welcomePackIssued;

        public OnboardingDetailsDTO(
                String status,
                LocalDateTime completedAt,
                String accountId,
                String laptopSerialNumber,
                String staffPassId,
                boolean welcomePackIssued) {
            this.status = status;
            this.completedAt = completedAt;
            this.accountId = accountId;
            this.laptopSerialNumber = laptopSerialNumber;
            this.staffPassId = staffPassId;
            this.welcomePackIssued = welcomePackIssued;
        }

        // Getters
        public String getStatus() { return status; }
        public LocalDateTime getCompletedAt() { return completedAt; }
        public String getAccountId() { return accountId; }
        public String getLaptopSerialNumber() { return laptopSerialNumber; }
        public String getStaffPassId() { return staffPassId; }
        public boolean isWelcomePackIssued() { return welcomePackIssued; }
    }
}
