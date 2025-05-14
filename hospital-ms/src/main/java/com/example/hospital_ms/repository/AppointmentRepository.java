package com.example.hospital_ms.repository;

import com.example.hospital_ms.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    //  You can add custom query methods here if needed
    //  For example:
    //  List<Appointment> findByDoctorId(Long doctorId);
    //  List<Appointment> findByPatientId(Long patientId);
    //  List<Appointment> findByAppointmentDate(LocalDate appointmentDate);
}

