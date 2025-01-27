package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class LaptopInventory {
    @Id
    private String serialNumber;
    
    @Column(nullable = false)
    private boolean assigned;

    public LaptopInventory() {}

    public LaptopInventory(String serialNumber) {
        this.serialNumber = serialNumber;
        this.assigned = false;
    }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public boolean isAssigned() { return assigned; }
    public void setAssigned(boolean assigned) { this.assigned = assigned; }
}