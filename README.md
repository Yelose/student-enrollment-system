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


---

## 📝 Enrollment model & Firestore collection

Enrollments represent the relationship between **one student** and **one course**, along with the current status of that assignment.
They are stored in the Firestore collection:

* **Collection name:** `dicampus-enrollments`

Each document links a student to a course and stores denormalized information to improve listing performance and avoid unnecessary joins.

### **Required fields**

* `studentId: string`
  Firebase document ID of the student.

* `courseId: string`
  Firebase document ID of the course.

* `status: EnrollmentStatus`
  Current state of the enrollment:

  * `pending` – Enrollment created but not yet confirmed
  * `in_progress` – Student is actively taking the course
  * `completed` – Student finished the course
  * `cancelled` – Enrollment was canceled

### **Denormalized student data**

Stored inside each enrollment for faster querying and display:

* `studentName: string` – Combined name + surname
* `studentEmail: string` – Used heavily for filtering and communication

### **Denormalized course data**

Also stored for performance and independence from course edits:

* `courseName: string`
* `courseCode: string`

### **Date fields**

Enrollments have their own date range, which may differ from the course’s official schedule:

* `startDate: Date | null`
* `endDate: Date | null`

### **Audit fields**

* `createdAt: Date | null`
* `updatedAt?: Date | null`

These values are automatically set and normalized through the `DateConvertionService` inside `EnrollmentsService`.

---

### **Type definition**

The enrollment model is strongly typed through:

* Interface:
  **`EnrollmentInterface`**
  `src/app/core/models/enrollment/enrollment-interface.ts`

* Status type:
  **`EnrollmentStatus`**
  `enrollment-status.type.ts`

* Status labels:
  **`ENROLLMENT_STATUS_OPTIONS`**
  `enrollment-status.constant.ts`

---

### 🔄 Enrollment workflow in the app

1. **List view (`EnrollmentsList`)**

   * Displays all enrollments with:

     * Student info
     * Course info
     * Status badge
     * Start/end dates
   * Includes filters:

     * Autocomplete by student
     * Autocomplete by course
     * Free-text search across all fields

2. **Create / Edit form (`EnrollmentsForm`)**

   * Uses autocompletes to pick a student and a course
   * Denormalizes fields into the document automatically
   * Supports editing through `selectedEnrollmentSignal`
   * Prevents stale edit state by resetting signals when navigating to “New enrollment”

3. **Firestore synchronization**

   * All parsing and date normalization handled by:

     * `DateConvertionService`
     * `EnrollmentsService.stripUndefined()`
     * `EnrollmentsService.prepForFirestore()`

4. **Deletion**

   * Always confirmed through `ConfirmDialogComponent`
   * Automatically resets selection signals after removal

---

### 🧩 Why enrollments use denormalization

Firestore does not support joins.
To prevent repeated lookups into `students` and `courses`, each enrollment caches:

* Student name
* Student email
* Course name
* Course code

This allows:

* Fast listing
* Lightweight filtering
* Minimal Firestore reads
* Stable UI even if a referenced student or course is later deleted

