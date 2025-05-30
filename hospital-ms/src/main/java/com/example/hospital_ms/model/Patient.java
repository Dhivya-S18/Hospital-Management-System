package com.example.hospital_ms.model;
import jakarta.persistence.*;
@Entity
@Table(name = "patients")
public class Patient {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   @Column(nullable = false)
   private String name;
   @Column(nullable = false, unique = true)
   private String email;
   @Column(nullable = false)
   private String password; // Added password attribute
   private String phone;
   private String address;
   // Constructors
   public Patient() {
   }
   public Patient(String name, String email, String password, String phone, String address) {
       this.name = name;
       this.email = email;
       this.password = password;
       this.phone = phone;
       this.address = address;
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
   public String getPhone() {
       return phone;
   }
   public void setPhone(String phone) {
       this.phone = phone;
   }
   public String getAddress() {
       return address;
   }
   public void setAddress(String address) {
       this.address = address;
   }
   @Override
   public String toString() {
       return "Patient{" +
              "id=" + id +
              ", name='" + name + '\'' +
              ", email='" + email + '\'' +
              ", password='[PROTECTED]'" + // Masking password in toString for security
              ", phone='" + phone + '\'' +
              ", address='" + address + '\'' +
              '}';
   }
}
