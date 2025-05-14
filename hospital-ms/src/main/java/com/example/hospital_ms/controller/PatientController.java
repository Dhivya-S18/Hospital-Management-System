package com.example.hospital_ms.controller;

import com.example.hospital_ms.model.Patient;
import com.example.hospital_ms.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;  // Import the PasswordEncoder

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inject PasswordEncoder for secure password handling

    // 1. Create (POST)
    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        //  Encode the password before saving.  This is VERY important for security.
        String encodedPassword = passwordEncoder.encode(patient.getPassword());
        patient.setPassword(encodedPassword);
        Patient savedPatient = patientRepository.save(patient);
        return new ResponseEntity<>(savedPatient, HttpStatus.CREATED);
    }

    // 2. Read (GET) - All patients
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    // 3. Read (GET) - Single patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Optional<Patient> patientOptional = patientRepository.findById(id);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            return new ResponseEntity<>(patient, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 4. Update (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        Optional<Patient> patientOptional = patientRepository.findById(id);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();

            // Update fields only if they are provided in the request
            if (patientDetails.getName() != null) {
                patient.setName(patientDetails.getName());
            }
            if (patientDetails.getEmail() != null) {
                patient.setEmail(patientDetails.getEmail());
            }
            if (patientDetails.getPhone() != null) {
                patient.setPhone(patientDetails.getPhone());
            }
            if (patientDetails.getAddress() != null) {
                patient.setAddress(patientDetails.getAddress());
            }
            if (patientDetails.getPassword() != null) {
                // Encode the password if a new password is provided
                patient.setPassword(passwordEncoder.encode(patientDetails.getPassword()));
            }

            Patient updatedPatient = patientRepository.save(patient);
            return new ResponseEntity<>(updatedPatient, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. Delete (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        Optional<Patient> patientOptional = patientRepository.findById(id);
        if (patientOptional.isPresent()) {
            patientRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content for successful deletion
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    

}

