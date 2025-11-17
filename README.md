# Student Enrollment System

A modern internal web application built with **Angular 20** and **Firebase**, designed to manage students, courses, and enrollments within an educational environment.

This system centralizes the full workflow of capturing and organizing student information, assigning them to courses, and managing enrollment states (pending, accepted, rejected).

Fully modular, scalable, and ready for future extensions such as analytics, roles, and administrative dashboards.

---

## 🚀 Features

### 👤 Student Management
- Create, edit, delete students  
- Detailed student profiles  
- List with search and filters  
- Fields include: name, surname, email, phone, DNI, address, city, province, employment status, interests list

### 📚 Course Management
- Create and manage courses  
- Course detail view  
- Course metadata: name, code, interests, start date, end date  

### 📝 Enrollment Management
- Link students with courses  
- Manage enrollment status (Pending, Accepted, Rejected)  
- Filter enrollment list by student or course  

### 🔐 Authentication & Security
- Firebase Authentication  
- Firestore rules for read/write protection  
- Optional role-based access in future iterations  

---

## 🧱 Tech Stack

- **Angular 20** (standalone components + modern architecture)
- **Firebase**  
  - Authentication  
  - Firestore  
  - Hosting  
- **AngularFire v17+**  
- **TypeScript strict**  
- **Material Design (optional)**

---

## 📂 Project Structure

```plaintext
src/
  app/
    core/
      models/
        student-model.ts
        course-model.ts
        enrollment-model.ts
      services/
        student.service.ts
        course.service.ts
        enrollment.service.ts
    features/
      students/
      courses/
      enrollments/
      auth/
        login/
      home/
    shared/
      components/
      utils/
```

---

## 📄 License

This project is licensed under the MIT License.  

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
