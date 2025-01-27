package com.example.demo.repository;

import com.example.demo.entity.LaptopInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LaptopInventoryRepository extends JpaRepository<LaptopInventory, String> {
    @Query("SELECT l FROM LaptopInventory l WHERE l.assigned = false ORDER BY l.serialNumber ASC LIMIT 1")
    Optional<LaptopInventory> findFirstUnassignedLaptop();
}