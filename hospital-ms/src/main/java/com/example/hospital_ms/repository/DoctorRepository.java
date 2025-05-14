package com.example.hospital_ms.repository;
import com.example.hospital_ms.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // You can add custom query methods here if needed
    // For example:
    // List<Doctor> findBySpecialization(String specialization);
}

