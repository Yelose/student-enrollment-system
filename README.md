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



---

## 🔐 Data Protection & Security

The application handles sensitive student information (personal and academic data).
To ensure privacy and prevent unauthorized access, several layers of protection are implemented:

### Firestore Security Rules

All student data stored in Firestore is protected through strict, server-enforced rules.
These rules guarantee that:

* Only authenticated users can read or write data
* Write operations are validated against expected data shapes and fields
* No anonymous access to student records is allowed

Rules can be extended later to support **role-based access** (e.g., admin, coordinator, tutor).

### Controlled Data Flow in Angular

The frontend never exposes more data than required.
Student operations (create, update, delete) are performed through strongly typed services (`StudentService`) which:

* Sanitize and validate payloads before sending them to Firestore
* Prevent unintended fields from being written (`stripUndefined()` logic)
* Keep all transformation logic inside controlled service layers

No direct access to Firestore is performed from components.

### Edit Protection via Signals

Editing a student does **not** use URL parameters to avoid accidental exposure or manipulation through the address bar.
Instead, the selected student is stored in a local signal (`selectedStudentSignal`), ensuring:

* The data never leaves the app context
* No sensitive identifiers are passed through routes
* Editing state is fully contained and automatically reset after updates

### Authentication Layer

All access to the system requires Firebase Authentication.
Anonymous or unverified users cannot interact with or view student data at any time.

---

### 📚 Course model & Firestore collection

Courses are stored in the Firestore collection:

- **Collection name:** `courses`

Each document represents a single course with the following schema:

- **Required fields**
  - `name: string` – Human-readable course name
  - `code: string` – Internal/administrative identifier (unique per course within the center)
  - `startDate: Date` – Planned start date of the course
  - `endDate: Date` – Planned end date of the course

- **Optional fields**
  - `interests: CourseInterest[]` – List of tags describing the area or profile of the course  
    (values derived from `COURSE_INTERESTS`)
  - `createdAt?: Date` – Creation timestamp (set by backend/Firestore)
  - `updatedAt?: Date` – Last update timestamp (set by backend/Firestore)

- **Type definition**
  - Interface: `CourseInterface` (`src/app/core/models/course/course-interface.ts`)
  - Auxiliary types/const:
    - `CourseInterest` (`course-interest.type.ts`)
    - `COURSE_INTERESTS` (`course-interests.constant.ts`)

