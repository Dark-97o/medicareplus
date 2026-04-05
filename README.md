# MedicarePlus (MediCare+)

[![Platform](https://img.shields.io/badge/Platform-Healthcare-blue.svg)](https://medicare-plus.vercel.app/)
[![Tech](https://img.shields.io/badge/Stack-React%2018%20%7C%20Vite%20%7C%20Firebase-orange.svg)](https://reactjs.org/)
[![AI](https://img.shields.io/badge/AI-Groq%20Llama%203.1-green.svg)](https://wow.groq.com/)

MedicarePlus is a high-performance, premium healthcare booking ecosystem specifically designed for the Jaipur/Rajasthan region. It bridges the gap between patients, specialized doctors, and diagnostic laboratories through a sophisticated, 3D-interactive, "Dark Mode" digital experience.

---

## 📖 About the Platform
MediCare+ modernizes the traditional hospital and clinic booking process. Driven by a "Patient-First" philosophy, the platform integrates real-time AI triage with a frictionless booking pipeline, a dual-language interface (English/Hindi), and a state-of-the-art diagnostic catalog.

---

## 🛠 Complete Tech Stack

### Frontend & UI
- **Framework**: React 18 (Vite-powered) with TypeScript.
- **Styling**: Tailwind CSS with custom Glassmorphism/Dark Mode design system.
- **Animations**: Framer Motion for smooth transitions, spring physics, and scroll-linked reveals.
- **3D Implementation**: Spline Integration (`spline-viewer`) for medical-themed scrollytelling.
- **Localization**: `i18next` with `translations.ts` dictionary (English / Hindi support).

### Backend & Infrastructure
- **Real-time Database**: Firebase Firestore (NoSQL).
- **Authentication**: Firebase Auth (persistent session management).
- **Notification Engine**: EmailJS mapping 5 dynamic template types for receipts and alerts.

### 🔌 Third-Party API Orchestration
- **Groq API**: Utilizes `llama-3.1-8b-instant` for AI Triage and the Aura AI Chat Assistant.
- **Razorpay**: Integrated JavaScript SDK (Test Mode) for secure digital payments.
- **NewsData.io**: Real-time health news feed for Rajasthan/India region.

---

## 🏥 Workflow & Portal Flows

### 1. Patient Journey
- **AI Triage**: Enter symptoms -> AI assessment (diseases/specialization mapping) -> Local Regex Fallback.
- **Specialist Selection**: View doctors based on specialty, experience, and fee structure.
- **Slot Allocation**: Choose from real-time doctor availability (Monday-Sunday).
- **Checkout**: Pay via Razorpay to confirm the booking.
- **Post-Booking**: Access Dashboard -> Join Video Consult -> View Diagnosis Report -> Download Prescription.

### 2. Physician (Doctor) Pipeline
- **Onboarding**: Doctors submit degrees, institutions, and clinical proofs for review.
- **Schedule Management**: Configure availability per week.
- **Consultation Modals**: Join video rooms OR receive instructions for in-person visits.
- **Diagnosis Engine**: Fill detailed reports (Diagnosis + Prescription) which auto-sync to the patient.
- **Action Triggers**: Send "Pre-Consultation Instructions" via EmailJS with one click.

### 3. Lab & Diagnostics Flow
- **Service Catalog**: Labs add/remove tests (Blood, MRI, Scans) with dynamic pricing.
- **Dashboard Tracking**: Track upcoming test appointments and sample requirements.

### 4. Administrator Control Center
- **Verification Engine**: Admin reviews and approves pending Doctor and Lab registration applications using a secure master key.
- **Analytics**: Global views of total appointments, total fee volume, and specialty distribution.

---

## 🧠 Business Logic & Algorithms

### 💸 Refund & Cancellation Policy
- **The 24-Hour Rule**:
  - Cancellations > 24 hours before the slot: **90% Refund** initiated instantly via Razorpay.
  - Cancellations < 24 hours before the slot: **30% Refund** initiated.
- **The 10-Minute No-Show Policy**:
  - Doctors can mark a patient as 'No-Show' precisely **+10 minutes** past the scheduled time. A no-show designation forfeits the patient's right to any refund.

### 🔄 Rescheduling Logic
- **"Free Reschedule" Token**: If a doctor is more than **30 minutes late** (System Cancellation), the patient receives a 100% refund OR a "Free Reschedule" token.
- This token intelligently persistent-filters doctors of the same specialty and allows booking a new slot **without triggering the Razorpay gateway**.

### 🤖 Intelligent Feedback Loop
- **Unlock**: The feedback/review modal unlocks exactly **5 hours** after the scheduled time to ensure the consultation has occurred.
- **Nudge**: An automated EmailJS "Review Reminder" is dispatched at **+12 hours** to capture patient satisfaction levels.

### 🛡 Safety Intervention System
- The platform monitors user inputs (notes, symptoms) for high-risk keywords (e.g., "suicide", "harm").
- If detected, the system overrides the UI to display an immediate, supportive **Crisis Intervention Modal** with direct links to AASRA and iCall helplines.

---

## 🎨 Design Aesthetics & Modals

- **Glassmorphism**: Layered translucency using `backdrop-blur` and CSS CSS variables for ambient glows.
- **Scrollytelling**: 3D Spline models (Medical DNA, Hearts) pinned to the background react to scroll position.
- **Modular Components**:
  - `AuthModal`: Unified Firebase login/register.
  - `ReportModal`: High-contrast clinical diagnosis view.
  - `FeedbackModal`: Star rating + text feedback system.
  - `SafetyModal`: Crisis support overlay.

---

## 🔒 Proprietary License & Copyright

**Copyright © 2026 MedicarePlus (MediCare+). All rights reserved.**

### 🛑 IMPORTANT LEGAL NOTICE
This project, including its source code, logic, design assets, and unique algorithms (Rescheduling Tokenization, AI Triage Fallback Logic), is **Proprietary Software**.
- **No usage**, reproduction, modification, or distribution is permitted without **explicit written permission** from the copyright holder.
- Any attempt to copy, clone, or "steal" project logic for commercial or public use will result in immediate legal action.
- This codebase is for **authorized demonstration purposes only**.

---

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/Dark-97o/medicareplus.git
   cd medicareplus
   npm install
   ```

2. **Environment Variables**: Create a `.env` file with:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_GROQ_API_KEY=your_key
   VITE_RAZORPAY_KEY=your_key
   ```

3. **Run**:
   ```bash
   npm run dev
   ```
