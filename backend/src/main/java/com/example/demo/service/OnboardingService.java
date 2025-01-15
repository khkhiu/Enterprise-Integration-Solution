package com.example.demo.service;

import com.example.demo.entity.Employee;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OnboardingService {
    private static final Logger logger = LoggerFactory.getLogger(OnboardingService.class);
    private final Random random = new Random();

    public void startOnboarding(Employee employee) throws Exception {
        createAccount(employee);
        performOnboardingTasks(employee);
    }

    private void createAccount(Employee employee) throws Exception {
        logger.info("Creating account for: {}", employee.getName());
        if (random.nextDouble() < 0.2) { // 20% chance of failure
            throw new Exception("Account creation failed");
        }
    }

    private void performOnboardingTasks(Employee employee) throws Exception {
        logger.info("Issuing laptop, staff pass, and goody bag for: {}", employee.getName());
        if (random.nextDouble() < 0.2) { // 20% chance of failure
            throw new Exception("Onboarding tasks failed");
        }
    }
}