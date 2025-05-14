package com.example.hospital_ms.service;

import com.example.hospital_ms.model.Patient;
import com.example.hospital_ms.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient savePatient(Patient patient) {
        // You can add business logic here before saving
        // For example, validating the data

        // In a real application, you would hash the password here
        // before saving it to the database.
        // Example (using a hypothetical PasswordEncoder):
        // String hashedPassword = passwordEncoder.encode(patient.getPassword());
        // patient.setPassword(hashedPassword);

        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
