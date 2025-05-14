package com.example.hospital_ms.service;

import com.example.hospital_ms.model.Doctor;
import com.example.hospital_ms.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // Import PasswordEncoder
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder; // Inject PasswordEncoder

    @Autowired
    public DoctorService(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public Doctor saveDoctor(Doctor doctor) {
        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(doctor.getPassword());
        doctor.setPassword(encodedPassword);
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Optional<Doctor> doctorOptional = doctorRepository.findById(id);
        if (doctorOptional.isPresent()) {
            Doctor doctor = doctorOptional.get();
            doctor.setName(doctorDetails.getName());
            doctor.setSpecialization(doctorDetails.getSpecialization());
            doctor.setDepartment(doctorDetails.getDepartment());
            doctor.setContactNumber(doctorDetails.getContactNumber());
            doctor.setEmail(doctorDetails.getEmail());
            if (doctorDetails.getPassword() != null && !doctorDetails.getPassword().isEmpty()) {
                // Encode the new password if provided
                String encodedPassword = passwordEncoder.encode(doctorDetails.getPassword());
                doctor.setPassword(encodedPassword);
            }
            return doctorRepository.save(doctor);
        }
        return null; // Or throw an exception
    }
}
