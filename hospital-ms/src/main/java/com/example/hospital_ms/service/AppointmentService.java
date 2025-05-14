package com.example.hospital_ms.service;

import com.example.hospital_ms.model.Appointment;
import com.example.hospital_ms.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment saveAppointment(Appointment appointment) {
        //  Add any business logic before saving. For example, check for valid doctor and patient IDs.
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(id);
        if (appointmentOptional.isPresent()) {
            Appointment appointment = appointmentOptional.get();
            appointment.setDoctorId(appointmentDetails.getDoctorId()); // Corrected field name
            appointment.setPatientId(appointmentDetails.getPatientId());  // Corrected field name
            appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
            appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
            appointment.setReason(appointmentDetails.getReason());
            //  Add any other fields you want to update
            return appointmentRepository.save(appointment);
        }
        return null; // Or throw an exception
    }
}

