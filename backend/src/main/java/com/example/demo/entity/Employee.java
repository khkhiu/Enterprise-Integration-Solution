package com.example.demo.entity;
// Employee Data Model: This represents an employee's data (name and email).


import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // Marks this as a database table
@Access(AccessType.FIELD)
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates ID
    private Long id;
    private String name;
    private String email;

    // Default constructor (required by JPA)
    public Employee() {
    }

    // Parameterized constructor (optional, for convenience)
    public Employee(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Getter for id
    public Long getId() {
        return id;
    }

    // Getter for name
    public String getName() {
        return name;
    }

    // Setter for name
    public void setName(String name) {
        this.name = name;
    }

    // Getter for email
    public String getEmail() {
        return email;
    }

    // Setter for email
    public void setEmail(String email) {
        this.email = email;
    }
}