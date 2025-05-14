
package com.example.hospital_ms.repository;

import com.example.hospital_ms.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // You can add custom query methods here if needed
    // For example:
    // Patient findByEmail(String email);
}
