package com.example.demo.service;

import com.example.demo.entity.Employee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaListenerService {
    private static final Logger logger = LoggerFactory.getLogger(KafkaListenerService.class);
    private final OnboardingService onboardingService;

    public KafkaListenerService(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @KafkaListener(topics = "new-employees", groupId = "${spring.kafka.consumer.group-id}")
    public void handleNewEmployee(Employee employee) {
        try {
            logger.info("New employee received: {}", employee.getName());
            onboardingService.startOnboarding(employee);
        } catch (Exception e) {
            logger.error("Error processing new employee: {}", e.getMessage());
            handleFailure(employee, e);
        }
    }

    private void handleFailure(Employee employee, Exception e) {
        logger.error("Failed to process employee {}: {}", employee.getName(), e.getMessage());
        // Add any failure handling logic here
    }
}