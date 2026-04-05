# MedicarePlus Platform - Complete Project Context & Architecture

## Overview
MedicarePlus is a modern, high-performance healthcare booking application built specifically for the Jaipur/Rajasthan region. It seamlessly connects patients with specialized doctors, laboratories, and advanced diagnostic centers using a sophisticated, premium "Dark Mode" aesthetic and a highly interactive UI.

---

## 💻 Tech Stack
- **Frontend Framework:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, overriding traditional CSS with a sleek glassmorphism design system using CSS Variables (`--color-accent-blue`, etc.).
- **Animations:** Framer Motion (page transitions, micro-interactions, modal spring physics)
- **Database & Authentication:** Google Firebase (Firestore DB, Firebase Auth)
- **AI Triage & Assistant:** Groq API natively integrated (utilizing `llama-3.1-8b-instant`)
- **Payments:** Razorpay JavaScript Integration (Test Mode) for frictionless checkout 
- **Email System:** EmailJS API mapping dynamic template variables
- **3D Graphics:** Spline Integration (`spline-viewer`)

---

## 🏥 Portals & Core Modules

### 1. Patient Experience (Public & Authenticated)
- **Groq-Powered AI Triage:** Patients can enter free-text symptoms (e.g., "blurring vision and headache"). The AI instantly analyzes the symptoms, provides a brief disease assessment, and routes the patient to the accurate medical specialization (e.g., Neurology).
- **Graceful Triage Fallback:** If the AI API fails or rate-limits, it instantly steps down to a completely local lightning-fast Regex engine without breaking the user flow.
- **Dual Flow Booking Booking:**
  - **Doctor Appointments:** Filter by specialty, choose in-person or video consultation, select date/time slot, and pay via Razorpay.
  - **Lab Booking:** Search dynamic lab catalogs, view pricing, and schedule facility visits.
- **Patient Dashboard:** Patients can view appointment history, check upcoming visits, trigger booking cancellations (with auto-calculated refunds), and download digital Diagnosis Reports created by the doctor.

### 2. Doctor Portal
- **Onboarding Pipeline:** Doctors submit an application containing credentials, fees, and specialization. Requires Admin Approval before login activates.
- **Appointment Pipeline:** Manage daily schedule. Doctors can access patient symptoms provided during the AI triage.
- **Post-Consultation Engine:** Doctors can use the "Fill Report" module to digitally diagnose patients and write prescriptions. This data pushes straight to the Patient Dashboard in real time.
- **Email Action Triggers:** "Pre-Consultation Instructions" allow doctors to dynamically hit an EmailJS template with just clicks to alert a patient.
- **Consultation Links:** One-click launch for Video Consultation links for remote appointments.

### 3. Lab / Diagnostics Portal
- **Facility Registration:** Diagnostic centers can register and await admin approval.
- **Active Test Catalog:** Labs can dynamically add blood work, MRIs, and checkups into the global Firestore `lab_tests` collection along with live pricing.
- **Booking Management:** Labs can track incoming tests and patient details.

### 4. Admin Command Center
- **Security Key access:** Isolated entry portal for system heads.
- **Application Approvals:** Administrators can review, approve, or reject pending Doctor and pending Lab registrations.
- **Global Overview:** Unified view of platform statistics.

---

## ✨ Features & Quality of Life (QoL) Enhancements

### 1. Interactive AI Chat Assistant (Widget)
- A highly polished floating AI widget built on Framer Motion. 
- It actively syncs with the live Firestore database, so it knows the exact names, fees, and hospitals of the registered doctors and labs. Users can converse natively with it.

### 2. Comprehensive Localization (English / Hindi)
- Integrated `translations.ts` centralizes a dictionary covering the entire application. 
- A seamless toggle in the header allows users from the Rajasthan region to comfortably switch between English and Hindi text immediately, promoting accessibility.

### 3. Universal Email Notification Architecture
- Implemented a strategic logic matrix that maps complex billing scenarios (booking confirmed, provider cancelled, patient cancelled, patient refund) into exactly **5 streamlined EmailJS Universal Templates** to avoid maintenance overhead. Dynamic properties insert provider names, costs, and dates invisibly.

### 4. Spline 3D Integration & Scrollytelling
- Rather than heavy standard assets, the App integrates interactive 3D WebGL scenes using Spline for a lightweight, futuristic feel (e.g., Medical DNA interactions) reacting seamlessly to mouse hovers and clicks.

### 5. Advanced UI Micro-Interactions
- **Glassmorphism:** Navigation bars, dashboards, and booking cards use layered translucency with `backdrop-blur`.
- **Skeleton Loaders & Pulsing:** Elements exhibit gentle pulsations while fetching data (e.g., Aura AI syncing status). 
- **Animated Toast Alerts:** Instant toast-style feedback drops in for errors, success events, and pending authentications.

### 6. Robust Error Handling & Empty States
- Custom illustrated or strictly formatted "Empty States" across all dashboards (e.g., if a doctor has zero appointments, a clean graphic UI explains this rather than displaying a broken table).
- Granular error capturing during Firebase Auth cycles to correctly alert the users (Wrong Password vs Email Already Exists).

### 7. Automated Time-Based Rules Engine (Lazy Sweep)
- **Background Execution:** Because the app is 100% serverless, a 'Lazy Sweep' engine evaluates timestamp validity silently when any user visits the site, handling triggers without backend cron processes.
- **Auto-Cancellations & Free Rescheduling:** Automatically cancels upcoming appointments if the doctor does not attend within +30 minutes of the scheduled time. Patients are subsequently offered a 100% refund OR a "Free Reschedule" token that intelligently bypasses Razorpay entirely and filters doctors of the exact same medical specialization.
- **Doctor No-Show Button:** Unlocks precisely +10 minutes past the scheduled time in the Doctor Portal, allowing the doctor to tag a patient as absent (forfeiting the patient's right to request refunds).
- **Automated Feedback Loop:** At exactly +5 hours passing a concluded appointment, an internal feedback modal unlocks. At +12 hours, the platform automatically dispatches a dynamic "Please Review" EmailJS alert to the patient.
