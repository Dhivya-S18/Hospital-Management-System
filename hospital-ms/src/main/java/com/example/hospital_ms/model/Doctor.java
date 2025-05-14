package com.example.hospital_ms.model;
import jakarta.persistence.*;
@Entity
@Table(name = "doctors")
public class Doctor {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   @Column(nullable = false)
   private String name;
   @Column(nullable = false, unique = true)
   private String specialization;
   private String department;
   private String contactNumber;
   @Column(nullable = false, unique = true)
   private String email;
   @Column(nullable = false)
   private String password; // Added password field
   // Constructors
   public Doctor() {
   }
   public Doctor(String name, String specialization, String department, String contactNumber, String email, String password) {
       this.name = name;
       this.specialization = specialization;
       this.department = department;
       this.contactNumber = contactNumber;
       this.email = email;
       this.password = password;
   }
   // Getters and Setters
   public Long getId() {
       return id;
   }
   public void setId(Long id) {
       this.id = id;
   }
   public String getName() {
       return name;
   }
   public void setName(String name) {
       this.name = name;
   }
   public String getSpecialization() {
       return specialization;
   }
   public void setSpecialization(String specialization) {
       this.specialization = specialization;
   }
   public String getDepartment() {
       return department;
   }
   public void setDepartment(String department) {
       this.department = department;
   }
   public String getContactNumber() {
       return contactNumber;
   }
   public void setContactNumber(String contactNumber) {
       this.contactNumber = contactNumber;
   }
   public String getEmail() {
       return email;
   }
   public void setEmail(String email) {
       this.email = email;
   }
   public String getPassword() {
       return password;
   }
   public void setPassword(String password) {
       this.password = password;
   }
   @Override
   public String toString() {
       return "Doctor{" +
              "id=" + id +
              ", name='" + name + '\'' +
              ", specialization='" + specialization + '\'' +
              ", department='" + department + '\'' +
              ", contactNumber='" + contactNumber + '\'' +
              ", email='" + email + '\'' +
              ", password='" + password + '\'' + // Removed the '[PROTECTED]' masking
              '}';
   }
}
