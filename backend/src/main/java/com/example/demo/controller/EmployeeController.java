package com.example.demo.controller;

import com.example.demo.entity.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository repository; // Connects to the database

    @Autowired
    private KafkaTemplate<String, Employee> kafkaTemplate; // Sends messages to Kafka

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
                    existingEmployee.setName(updatedEmployee.getName());
                    existingEmployee.setEmail(updatedEmployee.getEmail());
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
}    

