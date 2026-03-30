export const translations = {
  en: {
    nav: {
      admin: "Admin",
      doctor: "Doctor",
      lab: "Lab",
      home: "Home"
    },
    hero: {
      badge: "Pink City's Premium Care Engine",
      title_prefix: "The Future of",
      title_highlight: "Jaipur Health.",
      description: "Experience the pinnacle of medical technology in Rajasthan. Powered by hyper-local intelligent symptom matching and an ultra-secure, seamless booking architecture for patients across Jaipur.",
      book_now: "Book Appointment",
      explore: "Explore Scale",
      physician_gateway: "Healthcare Provider Gateway"
    },
    admin: {
      console: "Admin Console",
      auth_only: "Authorised Personnel Only",
      email: "Admin Email",
      access_key: "Access Key",
      uplink: "Establish Secure Uplink",
      edit: "Edit",
      cancel: "Cancel",
      save: "Save Changes",
      approve: "Approve",
      decline: "Decline",
      doctor: "Doctor",
      patient: "Patient",
      booking: "Booking",
      status_approved: "Approved",
      status_pending: "Pending",
      status_declined: "Declined",
      global_command: "Global Command",
      system_online: "System Online",
      terminate_session: "Terminate",
      pending_applications: "Pending Applications",
      initializing_secure_channel: "Initializing Secure Channel..."
    },
    doctor: {
      portal: "Physician Portal",
      sign_in: "Sign In",
      apply: "Apply / Register",
      email: "Registered Email",
      password: "Secure Password",
      access_records: "Access Records",
      partnership: "Doctor Partnership",
      join: "Join the MedicarePlus Network",
      credentials: "Login Credentials",
      profile: "Professional Profile",
      full_name: "Full Name",
      phone: "Phone Number",
      age: "Age",
      experience: "Experience (Years)",
      specialization: "Specialization",
      fee: "Consultation Fee (â‚¹)",
      qualification: "Qualification & Institution",
      degree: "Degree(s)",
      institution: "Institution",
      hospital: "Hospital / Clinic",
      verification: "Verification Assets (URLs)",
      submit: "Submit Application",
      hello: "Hello, Dr.",
      sign_out: "Sign Out",
      tabs: {
        pipeline: "Patient Pipeline",
        slots: "Manage Slots",
        security: "Security Portal"
      },
      stats: {
        total: "Total Assigned",
        pending: "Pending Pipeline",
        treated: "Successfully Treated"
      },
      auth: {
        invalid_credentials: "Invalid doctor credentials.",
        application_pending: "Application is still under review by Administration.",
        failed_authenticate: "Failed to authenticate.",
        email_registered: "Email already registered.",
        registration_failed: "Registration failed.",
        application_submitted: "Application Submitted!",
        application_review_message: "Your credentials are under Admin review. You'll be able to log in once approved.",
        sign_out_reset: "Sign Out / Terminal Reset",
        access_gateway: "Physician Access Gateway",
        sign_in: "Sign In",
        apply_register: "Apply / Register",
        portal_title: "Physician Portal",
        secure_access: "Secure Access Only",
        registered_email: "Registered Email",
        secure_password: "Secure Password",
        access_records: "Access Records",
        partnership_title: "Doctor",
        partnership_highlight: "Partnership",
        join_network: "Join the MedicarePlus Network",
        login_credentials: "Login Credentials",
        email_address: "Email Address",
        password: "Password",
        professional_profile: "Professional Profile",
        full_name: "Full Name",
        phone_number: "Phone Number",
        age: "Age",
        experience: "Experience (Years)",
        specialization: "Specialization",
        consultation_fee: "Consultation Fee (â‚¹)",
        qualification_institution: "Qualification & Institution",
        degree: "Degree(s)",
        institution: "Institution",
        hospital_clinic: "Hospital / Clinic",
        verification_assets: "Verification Assets (URLs)",
        profile_image_url: "Profile Image URL",
        proof_of_degree_url: "Proof of Degree URL",
        submit_application: "Submit Application"
      },
      availability: {
        update_success: "Weekly availability updated successfully.",
        save_error: "Failed to save availability."
      },
      security: {
        password_length_error: "Password must be 6+ characters.",
        password_update_success: "Password updated. Please use new credentials next time.",
        password_change_error: "Failed to change password."
      },
      email_actions: {
        pre_consultation_instructions: "Pre-Consultation Instructions",
        sent_success: "Instructions sent to {{email}}",
        dispatch_error: "Error dispatching Email."
      },
      appointments: {
        title: "Scheduled Patients",
        no_apt: "No appointments scheduled yet.",
        concluded: "Concluded",
        video: "Join Video Call",
        pre_reqs: "Pre-Reqs",
        cancel: "Cancel",
        fetch_error: "Failed to load appointments",
        check_firestore: "Check Firestore index/permissions",
        confirm_conclude: "Mark this appointment as Concluded?",
        confirm_cancel: "Cancel this appointment? The patient will be refunded.",
        reported_symptoms: "Reported Symptoms"
      }
    },
    specialities: {
      general_physician: "General Physician",
      cardiology: "Cardiology",
      neurology: "Neurology",
      orthopedics: "Orthopedics",
      dermatology: "Dermatology",
      pediatrics: "Pediatrics",
      oncology: "Oncology",
      psychiatry: "Psychiatry",
      urology: "Urology",
      radiology: "Radiology",
      endocrinology: "Endocrinology",
      pathology: "Pathology",
      surgery: "Surgery"
    },
    home: {
      intelligence: {
        title: "Jaipur Health",
        highlight: "Intelligence",
        desc: "Real-time localized health alerts and preventive measures aggregated from our network of regional hospitals directly to your portal.",
        fetching: "Fetching Real-time Intelligence...",
        no_alerts: "No active health alerts in your region.",
        alert: "Alert",
        no_details: "No specific details reported. Click 'Read Report' to view the full advisory.",
        read_report: "Read Report"
      },
      features: {
        instant: {
          title: "Instant Assignment",
          desc: "No more waiting. Our AI determines your specialty needs immediately."
        },
        realtime: {
          title: "Realtime Availability",
          desc: "Doctors' schedules are dynamically synced through our ultra-low latency infrastructure."
        },
        encrypted: {
          title: "Encrypted Records",
          desc: "Your medical data stays private with military-grade end-to-end encryption."
        }
      }
    },
    lab: {
      portal: "Lab & Diagnostics",
      auth: "Lab Specialist Access",
      register: "Register Laboratory",
      tests: "Manage Test Catalog",
      bookings: "Lab Appointments",
      book_test: "Book Lab Test",
      hospital: "Testing Center",
      charges: "Test Charges",
      select_test: "Select Laboratory Test",
      confirm: "Confirm & Pay",
      registration_pending: "Your Laboratory registration is pending Admin approval.",
      no_tests_found: "No approved tests found in the catalog."
    },
    patient: {
      portal: "Patient Portal",
      welcome: "Welcome back,",
      book_new: "Book New Appointment",
      sign_out: "Sign Out",
      upcoming: "Upcoming Appointments",
      history: "History & Records",
      no_upcoming: "No scheduled appointments.",
      no_history: "No past records found.",
      rebook: "Rebook",
      cancel: "Cancel",
      online: "Online",
      offline: "Offline"
    },
    booking: {
      title: "Intelligent Booking",
      step: "Step {{current}} of 3",
      symptoms: {
        title: "Describe Your Symptoms",
        desc: "Our engine will analyze your condition and instantly route you to the correct specialist.",
        placeholder: "e.g., I've been experiencing severe migraines...",
        cta: "Run AI Triage"
      },
      triage: {
        result: "Triage Result",
        ai: "AI Analysis",
        engine_desc: "AI Preliminary Assessment",
        local_engine: "Local Engine",
        disclaimer: "Not a diagnosis. Possible conditions based on your description â€” your doctor will confirm."
      },
      doctors: {
        title: "Available Specialists",
        none: "No matching specialists found in database.",
        register_desc: "Please register a doctor with specialization:",
        cta: "Proceed to Slots"
      },
      slots: {
        type: "Consultation Type",
        in_person: "In-Person (Offline)",
        virtual: "Virtual (Online Video)",
        date: "Select Date",
        time: "Select Time Slot",
        cta: "Pay â‚¹{{fee}} & Confirm"
      }
    },
    metrics: {
      specialists: "Top Specialists",
      satisfaction: "Patient Satisfaction",
      booking_time: "Avg Booking Time",
      charges: "Booking Charges"
    },
    common: {
      sign_out: "Sign Out",
      language: "Language",
      hello: "Hello",
      reset: "Reset"
    }
  },
  hi: {
    nav: {
      admin: "à¤ªà¥à¤°à¤¶à¤¾à¤¸à¤•",
      doctor: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤•",
      lab: "à¤œà¤¾à¤‚à¤š à¤•à¥‡à¤‚à¤¦à¥à¤°",
      home: "à¤®à¥à¤–à¥à¤¯ à¤ªà¥ƒà¤·à¥à¤ "
    },
    hero: {
      badge: "à¤œà¤¯à¤ªà¥à¤° à¤•à¤¾ à¤ªà¥à¤°à¥€à¤®à¤¿à¤¯à¤® à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤¸à¥‡à¤µà¤¾ à¤‡à¤‚à¤œà¤¨",
      title_prefix: "à¤­à¤µà¤¿à¤·à¥à¤¯ à¤•à¤¾",
      title_highlight: "à¤œà¤¯à¤ªà¥à¤° à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤¸à¥‡à¤µà¤¾à¥¤",
      description: "à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨ à¤®à¥‡à¤‚ à¤†à¤§à¥à¤¨à¤¿à¤• à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤¾ à¤¤à¤•à¤¨à¥€à¤• à¤•à¤¾ à¤…à¤¨à¥à¤­à¤µ à¤•à¤°à¥‡à¤‚à¥¤ à¤œà¤¯à¤ªà¥à¤° à¤•à¥‡ à¤¨à¤¿à¤µà¤¾à¤¸à¤¿à¤¯à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤à¤†à¤ˆ-à¤¸à¤‚à¤šà¤¾à¤²à¤¿à¤¤ à¤²à¤•à¥à¤·à¤£ à¤®à¤¿à¤²à¤¾à¤¨ à¤”à¤° à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤¬à¥à¤•à¤¿à¤‚à¤— à¤¸à¥à¤µà¤¿à¤§à¤¾à¥¤",
      book_now: "à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚",
      explore: "à¤µà¤¿à¤µà¤°à¤£ à¤¦à¥‡à¤–à¥‡à¤‚",
      physician_gateway: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤• à¤ªà¥‹à¤°à¥à¤Ÿà¤² à¤—à¥‡à¤Ÿà¤µà¥‡"
    },
    admin: {
      console: "à¤ªà¥à¤°à¤¶à¤¾à¤¸à¤•à¥€à¤¯ à¤•à¤‚à¤¸à¥‹à¤²",
      auth_only: "à¤•à¥‡à¤µà¤² à¤…à¤§à¤¿à¤•à¥ƒà¤¤ à¤•à¤°à¥à¤®à¤¿à¤¯à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤",
      email: "à¤ªà¥à¤°à¤¶à¤¾à¤¸à¤• à¤ˆà¤®à¥‡à¤²",
      access_key: "à¤à¤•à¥à¤¸à¥‡à¤¸ à¤•à¥€",
      uplink: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤ªà¥‹à¤°à¥à¤Ÿà¤² à¤²à¥‰à¤—à¤¿à¤¨",
      edit: "à¤¸à¤‚à¤¶à¥‹à¤§à¤¿à¤¤ à¤•à¤°à¥‡à¤‚",
      cancel: "à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚",
      save: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤•à¤°à¥‡à¤‚",
      approve: "à¤¸à¥à¤µà¥€à¤•à¤¾à¤°à¥‡à¤‚",
      decline: "à¤…à¤¸à¥à¤µà¥€à¤•à¤¾à¤°à¥‡à¤‚",
      doctor: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤•",
      patient: "à¤®à¤°à¥€à¤œ",
      booking: "à¤¬à¥à¤•à¤¿à¤‚à¤—",
      status_approved: "à¤¸à¥à¤µà¥€à¤•à¥ƒà¤¤",
      status_pending: "à¤²à¤‚à¤¬à¤¿à¤¤",
      status_declined: "à¤…à¤¸à¥à¤µà¥€à¤•à¥ƒà¤¤",
      global_command: "à¤—à¥à¤²à¥‹à¤¬à¤² à¤•à¤®à¤¾à¤‚à¤¡",
      system_online: "à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤‘à¤¨à¤²à¤¾à¤‡à¤¨",
      terminate_session: "à¤¸à¤¤à¥à¤° à¤¸à¤®à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚",
      pending_applications: "à¤²à¤‚à¤¬à¤¿à¤¤ à¤†à¤µà¥‡à¤¦à¤¨",
      initializing_secure_channel: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤šà¥ˆà¤¨à¤² à¤ªà¥à¤°à¤¾à¤°à¤‚à¤­ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ..."
    },
    doctor: {
      portal: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤• à¤ªà¥‹à¤°à¥à¤Ÿà¤²",
      sign_in: "à¤²à¥‰à¤—à¤¿à¤¨",
      apply: "à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£ à¤•à¤°à¥‡à¤‚",
      email: "à¤ˆà¤®à¥‡à¤²",
      password: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡",
      access_records: "à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¦à¥‡à¤–à¥‡à¤‚",
      partnership: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤• à¤­à¤¾à¤—à¥€à¤¦à¤¾à¤°à¥€",
      join: "à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤¸à¥‡ à¤œà¥à¥œà¥‡à¤‚",
      credentials: "à¤²à¥‰à¤—à¤¿à¤¨ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€",
      profile: "à¤ªà¥‡à¤¶à¥‡à¤µà¤° à¤µà¤¿à¤µà¤°à¤£",
      full_name: "à¤ªà¥‚à¤°à¤¾ à¤¨à¤¾à¤®",
      phone: "à¤«à¥‹à¤¨",
      age: "à¤†à¤¯à¥",
      experience: "à¤…à¤¨à¥à¤­à¤µ (à¤µà¤°à¥à¤·)",
      specialization: "à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤žà¤¤à¤¾",
      fee: "à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶ à¤¶à¥à¤²à¥à¤• (â‚¹)",
      qualification: "à¤¶à¤¿à¤•à¥à¤·à¤¾ à¤”à¤° à¤¸à¤‚à¤¸à¥à¤¥à¤¾à¤¨",
      degree: "à¤¡à¤¿à¤—à¥à¤°à¥€",
      institution: "à¤¸à¤‚à¤¸à¥à¤¥à¤¾à¤¨",
      hospital: "à¤…à¤¸à¥à¤ªà¤¤à¤¾à¤² / à¤•à¥à¤²à¤¿à¤¨à¤¿à¤•",
      verification: "à¤¸à¤¤à¥à¤¯à¤¾à¤ªà¤¨ à¤ªà¥à¤°à¤®à¤¾à¤£",
      submit: "à¤†à¤µà¥‡à¤¦à¤¨ à¤­à¥‡à¤œà¥‡à¤‚",
      hello: "à¤¨à¤®à¤¸à¥à¤¤à¥‡, à¤¡à¥‰.",
      sign_out: "à¤¸à¤¾à¤‡à¤¨ à¤†à¤‰à¤Ÿ",
      tabs: {
        pipeline: "à¤®à¤°à¥€à¤œ à¤¸à¥‚à¤šà¥€",
        slots: "à¤¸à¤®à¤¯ à¤ªà¥à¤°à¤¬à¤‚à¤§à¤¨",
        security: "à¤¸à¥à¤°à¤•à¥à¤·à¤¾ à¤ªà¥‹à¤°à¥à¤Ÿà¤²"
      },
      stats: {
        total: "à¤•à¥à¤² à¤®à¤°à¥€à¤œ",
        pending: "à¤²à¤‚à¤¬à¤¿à¤¤ à¤®à¤°à¥€à¤œ",
        treated: "à¤¸à¤«à¤² à¤‰à¤ªà¤šà¤¾à¤°"
      },
      auth: {
        invalid_credentials: "à¤µà¤¿à¤µà¤°à¤£ à¤—à¤²à¤¤ à¤¹à¥ˆà¤‚à¥¤",
        application_pending: "à¤†à¤µà¥‡à¤¦à¤¨ à¤¸à¤®à¥€à¤•à¥à¤·à¤¾à¤§à¥€à¤¨ à¤¹à¥ˆà¥¤",
        failed_authenticate: "à¤²à¥‰à¤—à¤¿à¤¨ à¤µà¤¿à¤«à¤² à¤°à¤¹à¤¾à¥¤",
        email_registered: "à¤ˆà¤®à¥‡à¤² à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤¹à¥ˆà¥¤",
        registration_failed: "à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£ à¤µà¤¿à¤«à¤² à¤°à¤¹à¤¾à¥¤",
        application_submitted: "à¤†à¤µà¥‡à¤¦à¤¨ à¤œà¤®à¤¾ à¤¹à¥‹ à¤—à¤¯à¤¾!",
        application_review_message: "à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£ à¤¸à¥à¤µà¥€à¤•à¥ƒà¤¤à¤¿ à¤•à¥‡ à¤¬à¤¾à¤¦ à¤†à¤ª à¤²à¥‰à¤—à¤¿à¤¨ à¤•à¤° à¤¸à¤•à¥‡à¤‚à¤—à¥‡à¥¤",
        sign_out_reset: "à¤¸à¤¾à¤‡à¤¨ à¤†à¤‰à¤Ÿ",
        access_gateway: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤• à¤ªà¥à¤°à¤µà¥‡à¤¶ à¤¦à¥à¤µà¤¾à¤°",
        sign_in: "à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨",
        apply_register: "à¤œà¥à¥œà¥‡à¤‚ / à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£",
        portal_title: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤• à¤ªà¥‹à¤°à¥à¤Ÿà¤²",
        secure_access: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤ªà¤¹à¥à¤‚à¤š",
        registered_email: "à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤ˆà¤®à¥‡à¤²",
        secure_password: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡",
        access_records: "à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¦à¥‡à¤–à¥‡à¤‚",
        partnership_title: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤•",
        partnership_highlight: "à¤­à¤¾à¤—à¥€à¤¦à¤¾à¤°à¥€",
        join_network: "à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤®à¥‡à¤‚ à¤¶à¤¾à¤®à¤¿à¤² à¤¹à¥‹à¤‚",
        login_credentials: "à¤²à¥‰à¤—à¤¿à¤¨ à¤µà¤¿à¤µà¤°à¤£",
        email_address: "à¤ˆà¤®à¥‡à¤² à¤ªà¤¤à¤¾",
        password: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡",
        professional_profile: "à¤ªà¥‡à¤¶à¥‡à¤µà¤° à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²",
        full_name: "à¤ªà¥‚à¤°à¤¾ à¤¨à¤¾à¤®",
        phone_number: "à¤¸à¤‚à¤ªà¤°à¥à¤• à¤¨à¤‚à¤¬à¤°",
        age: "à¤†à¤¯à¥",
        experience: "à¤…à¤¨à¥à¤­à¤µ",
        specialization: "à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤žà¤¤à¤¾",
        consultation_fee: "à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶ à¤¶à¥à¤²à¥à¤•",
        qualification_institution: "à¤¶à¤¿à¤•à¥à¤·à¤¾",
        degree: "à¤¡à¤¿à¤—à¥à¤°à¥€",
        institution: "à¤¸à¤‚à¤¸à¥à¤¥à¤¾à¤¨",
        hospital_clinic: "à¤…à¤¸à¥à¤ªà¤¤à¤¾à¤²",
        verification_assets: "à¤¦à¤¸à¥à¤¤à¤¾à¤µà¥‡à¤œ",
        profile_image_url: "à¤«à¥‹à¤Ÿà¥‹ à¤²à¤¿à¤‚à¤•",
        proof_of_degree_url: "à¤ªà¥à¤°à¤®à¤¾à¤£",
        submit_application: "à¤†à¤µà¥‡à¤¦à¤¨ à¤­à¥‡à¤œà¥‡à¤‚"
      },
      availability: {
        update_success: "à¤‰à¤ªà¤²à¤¬à¥à¤§à¤¤à¤¾ à¤…à¤ªà¤¡à¥‡à¤Ÿ à¤•à¥€ à¤—à¤ˆà¥¤",
        save_error: "à¤…à¤ªà¤¡à¥‡à¤Ÿ à¤µà¤¿à¤«à¤² à¤°à¤¹à¤¾à¥¤"
      },
      security: {
        password_length_error: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤•à¤® à¤¸à¥‡ à¤•à¤® 6 à¤…à¤•à¥à¤·à¤°à¥‹à¤‚ à¤•à¤¾ à¤¹à¥‹à¤¨à¤¾ à¤šà¤¾à¤¹à¤¿à¤à¥¤",
        password_update_success: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤¬à¤¦à¤² à¤¦à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾ à¤¹à¥ˆà¥¤",
        password_change_error: "à¤¬à¤¦à¤²à¤¾à¤µ à¤µà¤¿à¤«à¤² à¤°à¤¹à¤¾à¥¤"
      },
      email_actions: {
        pre_consultation_instructions: "à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶-à¤ªà¥‚à¤°à¥à¤µ à¤¨à¤¿à¤°à¥à¤¦à¥‡à¤¶",
        sent_success: "à¤¨à¤¿à¤°à¥à¤¦à¥‡à¤¶ à¤­à¥‡à¤œ à¤¦à¤¿à¤ à¤—à¤ à¤¹à¥ˆà¤‚",
        dispatch_error: "à¤ˆà¤®à¥‡à¤² à¤­à¥‡à¤œà¤¨à¥‡ à¤®à¥‡à¤‚ à¤¤à¥à¤°à¥à¤Ÿà¤¿à¥¤"
      },
      appointments: {
        title: "à¤¨à¤¿à¤°à¥à¤§à¤¾à¤°à¤¿à¤¤ à¤®à¤°à¥€à¤œ",
        no_apt: "à¤•à¥‹à¤ˆ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾à¥¤",
        concluded: "à¤ªà¥‚à¤°à¥à¤£",
        video: "à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤•à¥‰à¤²",
        pre_reqs: "à¤œà¤°à¥‚à¤°à¥€ à¤¨à¤¿à¤°à¥à¤¦à¥‡à¤¶",
        cancel: "à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚",
        fetch_error: "à¤¤à¥à¤°à¥à¤Ÿà¤¿",
        check_firestore: "à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤œà¤¾à¤‚à¤šà¥‡à¤‚",
        confirm_conclude: "à¤•à¥à¤¯à¤¾ à¤ªà¥‚à¤°à¥à¤£ à¤¹à¥‹ à¤—à¤¯à¤¾ à¤¹à¥ˆ?",
        confirm_cancel: "à¤°à¤¦à¥à¤¦ à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚?",
        reported_symptoms: "à¤²à¤•à¥à¤·à¤£"
      }
    },
    specialities: {
      general_physician: "à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤•",
      cardiology: "à¤¹à¥ƒà¤¦à¤¯ à¤°à¥‹à¤— à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž",
      neurology: "à¤¨à¥à¤¯à¥‚à¤°à¥‹à¤²à¥‰à¤œà¤¿à¤¸à¥à¤Ÿ",
      orthopedics: "à¤¹à¤¡à¥à¤¡à¥€ à¤°à¥‹à¤— à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž",
      dermatology: "à¤¤à¥à¤µà¤šà¤¾ à¤°à¥‹à¤— à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž",
      pediatrics: "à¤¬à¤¾à¤² à¤°à¥‹à¤— à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž",
      oncology: "à¤•à¥ˆà¤‚à¤¸à¤° à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž",
      psychiatry: "à¤®à¤¨à¥‹à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤•",
      urology: "à¤®à¥‚à¤¤à¥à¤° à¤°à¥‹à¤—",
      radiology: "à¤°à¥‡à¤¡à¤¿à¤¯à¥‹à¤²à¥‰à¤œà¤¿à¤¸à¥à¤Ÿ",
      endocrinology: "à¤à¤‚à¤¡à¥‹à¤•à¥à¤°à¤¿à¤¨à¥‹à¤²à¥‰à¤œà¤¿à¤¸à¥à¤Ÿ",
      pathology: "à¤ªà¥ˆà¤¥à¥‹à¤²à¥‰à¤œà¤¿à¤¸à¥à¤Ÿ",
      surgery: "à¤¸à¤°à¥à¤œà¤¨"
    },
    home: {
      intelligence: {
        title: "à¤œà¤¯à¤ªà¥à¤° à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯",
        highlight: "à¤¸à¥‚à¤šà¤¨à¤¾",
        desc: "à¤•à¥à¤·à¥‡à¤¤à¥à¤°à¥€à¤¯ à¤…à¤¸à¥à¤ªà¤¤à¤¾à¤²à¥‹à¤‚ à¤¸à¥‡ à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤…à¤²à¤°à¥à¤Ÿ à¤¸à¥€à¤§à¥‡ à¤†à¤ªà¤•à¥‡ à¤ªà¥‹à¤°à¥à¤Ÿà¤² à¤ªà¤°à¥¤",
        fetching: "à¤¸à¥‚à¤šà¤¨à¤¾ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¥€ à¤œà¤¾ à¤°à¤¹à¥€ à¤¹à¥ˆ...",
        no_alerts: "à¤…à¤²à¤°à¥à¤Ÿ à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾à¥¤",
        alert: "à¤…à¤²à¤°à¥à¤Ÿ",
        no_details: "à¤µà¤¿à¤µà¤°à¤£ à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾à¥¤",
        read_report: "à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤ªà¥à¥‡à¤‚"
      },
      features: {
        instant: {
          title: "à¤¤à¥à¤µà¤°à¤¿à¤¤ à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾",
          desc: "à¤à¤†à¤ˆ à¤¸à¤¹à¥€ à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤šà¥à¤¨à¤¤à¤¾ à¤¹à¥ˆà¥¤"
        },
        realtime: {
          title: "à¤¸à¤Ÿà¥€à¤• à¤¸à¤®à¤¯",
          desc: "à¤‰à¤ªà¤²à¤¬à¥à¤§à¤¤à¤¾ à¤¤à¥à¤°à¤‚à¤¤ à¤…à¤ªà¤¡à¥‡à¤Ÿ à¤•à¥€ à¤œà¤¾à¤¤à¥€ à¤¹à¥ˆà¥¤"
        },
        encrypted: {
          title: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤",
          desc: "à¤®à¥‡à¤¡à¤¿à¤•à¤² à¤¡à¥‡à¤Ÿà¤¾ à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤¹à¥ˆà¥¤"
        }
      }
    },
    lab: {
      portal: "à¤²à¥ˆà¤¬ à¤”à¤° à¤œà¤¾à¤‚à¤š",
      auth: "à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤²à¥‰à¤—à¤¿à¤¨",
      register: "à¤²à¥ˆà¤¬ à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£",
      tests: "à¤œà¤¾à¤‚à¤š à¤¸à¥‚à¤šà¥€",
      bookings: "à¤¬à¥à¤•à¤¿à¤‚à¤—",
      book_test: "à¤²à¥ˆà¤¬ à¤Ÿà¥‡à¤¸à¥à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚",
      hospital: "à¤œà¤¾à¤‚à¤š à¤•à¥‡à¤‚à¤¦à¥à¤°",
      charges: "à¤¶à¥à¤²à¥à¤•",
      select_test: "à¤Ÿà¥‡à¤¸à¥à¤Ÿ à¤šà¥à¤¨à¥‡à¤‚",
      confirm: "à¤ªà¥à¤·à¥à¤Ÿà¤¿ à¤”à¤° à¤­à¥à¤—à¤¤à¤¾à¤¨",
      registration_pending: "à¤†à¤ªà¤•à¤¾ à¤²à¥ˆà¤¬ à¤ªà¤‚à¤œà¥€à¤•à¤°à¤£ à¤¸à¤®à¥€à¤•à¥à¤·à¤¾à¤§à¥€à¤¨ à¤¹à¥ˆà¥¤",
      no_tests_found: "à¤•à¥‹à¤ˆ à¤¸à¥à¤µà¥€à¤•à¥ƒà¤¤ à¤Ÿà¥‡à¤¸à¥à¤Ÿ à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾à¥¤"
    },
    patient: {
      portal: "à¤®à¤°à¥€à¤œ à¤ªà¥‹à¤°à¥à¤Ÿà¤²",
      welcome: "à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆ,",
      book_new: "à¤¨à¤¯à¤¾ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ",
      sign_out: "à¤²à¥‰à¤— à¤†à¤‰à¤Ÿ",
      upcoming: "à¤†à¤—à¤¾à¤®à¥€ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ",
      history: "à¤ªà¤¿à¤›à¤²à¤¾ à¤‡à¤¤à¤¿à¤¹à¤¾à¤¸",
      no_upcoming: "à¤•à¥‹à¤ˆ à¤†à¤—à¤¾à¤®à¥€ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤",
      no_history: "à¤•à¥‹à¤ˆ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾à¥¤",
      rebook: "à¤ªà¥à¤¨à¤ƒ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚",
      cancel: "à¤°à¤¦à¥à¤¦ à¤•à¤°à¥‡à¤‚",
      online: "à¤‘à¤¨à¤²à¤¾à¤‡à¤¨",
      offline: "à¤‘à¤«à¤²à¤¾à¤‡à¤¨"
    },
    booking: {
      title: "à¤¸à¥à¤®à¤¾à¤°à¥à¤Ÿ à¤¬à¥à¤•à¤¿à¤‚à¤—",
      step: "3 à¤•à¤¾ à¤šà¤°à¤£ {{current}}",
      symptoms: {
        title: "à¤²à¤•à¥à¤·à¤£à¥‹à¤‚ à¤•à¤¾ à¤µà¤¿à¤µà¤°à¤£ à¤¦à¥‡à¤‚",
        desc: "à¤¹à¤®à¤¾à¤°à¤¾ à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤†à¤ªà¤•à¥€ à¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤•à¤¾ à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£ à¤•à¤° à¤¸à¤¹à¥€ à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤¤à¤• à¤ªà¤¹à¥à¤‚à¤šà¤¾à¤à¤—à¤¾à¥¤",
        placeholder: "à¤œà¥ˆà¤¸à¥‡: à¤®à¥à¤à¥‡ à¤¸à¤¿à¤° à¤®à¥‡à¤‚ à¤¤à¥‡à¤œ à¤¦à¤°à¥à¤¦ à¤¹à¥ˆ...",
        cta: "à¤à¤†à¤ˆ à¤œà¤¾à¤‚à¤š à¤•à¤°à¥‡à¤‚"
      },
      triage: {
        result: "à¤œà¤¾à¤‚à¤š à¤ªà¤°à¤¿à¤£à¤¾à¤®",
        ai: "à¤à¤†à¤ˆ à¤µà¤¿à¤¶à¥à¤²à¥‡à¤·à¤£",
        engine_desc: "à¤ªà¥à¤°à¤¾à¤°à¤‚à¤­à¤¿à¤• à¤®à¥‚à¤²à¥à¤¯à¤¾à¤‚à¤•à¤¨",
        local_engine: "à¤²à¥‹à¤•à¤² à¤‡à¤‚à¤œà¤¨",
        disclaimer: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤• à¤¸à¥‡ à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯ à¤¹à¥ˆà¥¤"
      },
      doctors: {
        title: "à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
        none: "à¤•à¥‹à¤ˆ à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤¨à¤¹à¥€à¤‚ à¤®à¤¿à¤²à¤¾à¥¤",
        register_desc: "à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž à¤•à¥‹ à¤…à¤¸à¥à¤ªà¤¤à¤¾à¤² à¤®à¥‡à¤‚ à¤œà¥‹à¥œà¥‡à¤‚:",
        cta: "à¤¸à¤®à¤¯ à¤šà¥à¤¨à¥‡à¤‚"
      },
      slots: {
        type: "à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶ à¤ªà¥à¤°à¤•à¤¾à¤°",
        in_person: "à¤•à¥à¤²à¤¿à¤¨à¤¿à¤• à¤ªà¤° (à¤‘à¤«à¤²à¤¾à¤‡à¤¨)",
        virtual: "à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤•à¥‰à¤² (à¤‘à¤¨à¤²à¤¾à¤‡à¤¨)",
        date: "à¤¦à¤¿à¤¨à¤¾à¤‚à¤• à¤šà¥à¤¨à¥‡à¤‚",
        time: "à¤¸à¤®à¤¯ à¤šà¥à¤¨à¥‡à¤‚",
        cta: "â‚¹{{fee}} à¤­à¥à¤—à¤¤à¤¾à¤¨"
      }
    },
    metrics: {
      specialists: "à¤ªà¥à¤°à¤®à¥à¤– à¤µà¤¿à¤¶à¥‡à¤·à¤œà¥à¤ž",
      satisfaction: "à¤®à¤°à¥€à¤œà¥‹à¤‚ à¤•à¥€ à¤¸à¤‚à¤¤à¥à¤·à¥à¤Ÿà¤¿",
      booking_time: "à¤”à¤¸à¤¤ à¤¸à¤®à¤¯",
      charges: "à¤¬à¥à¤•à¤¿à¤‚à¤— à¤¶à¥à¤²à¥à¤•"
    },
    common: {
      sign_out: "à¤²à¥‰à¤— à¤†à¤‰à¤Ÿ",
      language: "à¤­à¤¾à¤·à¤¾",
      hello: "à¤¨à¤®à¤¸à¥à¤¤à¥‡",
      reset: "à¤°à¥€à¤¸à¥‡à¤Ÿ"
    }
  },
  rj: {
    nav: {
      admin: "à¤ªà¥à¤°à¤¶à¤¾à¤¸à¤•",
      doctor: "à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤¸à¤¾'à¤¬",
      lab: "à¤œà¤¾à¤‚à¤š à¤˜à¤°",
      home: "à¤˜à¤°"
    },
    hero: {
      badge: "à¤œà¤¯à¤ªà¥à¤° à¤°à¥‹ à¤‰à¤®à¥à¤¦à¤¾ à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤ªà¥à¤²à¥‡à¤Ÿà¥žà¥‰à¤°à¥à¤®",
      title_prefix: "à¤†à¤µà¤£ à¤†à¤³à¥‹ à¤•à¤¾à¤³",
      title_highlight: "à¤œà¤¯à¤ªà¥à¤° à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯ à¤°à¥‹à¥¤",
      description: "à¤°à¤¾à¤œà¤¸à¥à¤¥à¤¾à¤¨ à¤°à¥€ à¤šà¥‹à¤–à¥€ à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤¾ à¤¤à¤•à¤¨à¥€à¤• à¤°à¥‹ à¤…à¤¨à¥à¤­à¤µ à¤•à¤°à¥‹à¥¤ à¤¸à¤¾à¤‚à¤—à¤¾à¤¨à¥‡à¤°à¥€ à¤—à¥‡à¤Ÿ à¤¸à¥ à¤²à¥‡à¤° à¤µà¥ˆà¤¶à¤¾à¤²à¥€ à¤¤à¤•, à¤¸à¤—à¤³à¤¾ à¤œà¤¯à¤ªà¥à¤° à¤µà¤¾à¤¸à¥à¤¯à¤¾à¤‚ à¤–à¤¾à¤¤à¤¿à¤° à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤¸à¥‡à¤µà¤¾à¥¤",
      book_now: "à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‹",
      explore: "à¤“à¤° à¤¦à¥‡à¤–à¥‹",
      physician_gateway: "à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤¸à¤¾'à¤¬ à¤°à¥‹ à¤¦à¥à¤µà¤¾à¤°"
    },
    admin: {
      console: "à¤à¤¡à¤®à¤¿à¤¨ à¤•à¤‚à¤¸à¥‹à¤²",
      auth_only: "à¤¸à¤¿à¤°à¤« à¤–à¤¾à¤¸ à¤²à¥‹à¤—à¤¾à¤‚ à¤–à¤¾à¤¤à¤¿à¤°",
      email: "à¤à¤¡à¤®à¤¿à¤¨ à¤ˆà¤®à¥‡à¤²",
      access_key: "à¤à¤•à¥à¤¸à¥‡à¤¸ à¤•à¥€",
      uplink: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤œà¥à¥œà¤¾à¤µ à¤•à¤°à¥‹",
      edit: "à¤¬à¤¦à¤²à¤¾à¤µ",
      cancel: "à¤°à¤¦à¥à¤¦",
      save: "à¤¸à¤¹à¥‡à¤œà¥‡à¤‚",
      approve: "à¤®à¤‚à¤œà¥‚à¤°à¥€",
      decline: "à¤®à¤¨à¤¾",
      doctor: "à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      patient: "à¤®à¤°à¥€à¤œ",
      booking: "à¤¬à¥à¤•à¤¿à¤‚à¤—",
      status_approved: "à¤®à¤‚à¤œà¥‚à¤°",
      status_pending: "à¤°à¥à¤•à¥à¤¯à¥‹à¥œà¥‹",
      status_declined: "à¤°à¤¦à¥à¤¦",
      global_command: "à¤—à¥à¤²à¥‹à¤¬à¤² à¤•à¤®à¤¾à¤‚à¤¡",
      system_online: "à¤¸à¤¿à¤¸à¥à¤Ÿà¤® à¤‘à¤¨à¤²à¤¾à¤‡à¤¨",
      terminate_session: "à¤¸à¤¤à¥à¤° à¤¸à¤®à¤¾à¤ªà¥à¤¤",
      pending_applications: "à¤¬à¤¾à¤•à¥€ à¤†à¤µà¥‡à¤¦à¤¨",
      initializing_secure_channel: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤œà¥à¥œà¤¾à¤µ à¤¹à¥‹ à¤°à¤¹à¥à¤¯à¥‹ à¤¹à¥ˆ..."
    },
    doctor: {
      portal: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤• à¤ªà¥‹à¤°à¥à¤Ÿà¤²",
      sign_in: "à¤²à¥‰à¤—à¤¿à¤¨",
      apply: "à¤°à¤œà¤¿à¤¸à¥à¤Ÿà¥à¤°à¥‡à¤¶à¤¨",
      email: "à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤ˆà¤®à¥‡à¤²",
      password: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡",
      access_records: "à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¦à¥‡à¤–à¥‹",
      partnership: "à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤¸à¤¾'à¤¬ à¤°à¥€ à¤­à¤¾à¤—à¥€à¤¦à¤¾à¤°à¥€",
      join: "à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤®à¥‡à¤‚ à¤œà¥à¥œà¥‹",
      credentials: "à¤²à¥‰à¤—à¤¿à¤¨ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€",
      profile: "à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²",
      full_name: "à¤ªà¥‚à¤°à¥‹ à¤¨à¤¾à¤®",
      phone: "à¤«à¥‹à¤¨",
      age: "à¤‰à¤®à¥à¤°",
      experience: "à¤…à¤¨à¥à¤­à¤µ",
      specialization: "à¤–à¤¾à¤¸à¤¿à¤¯à¤¤",
      fee: "à¤«à¥€à¤¸ (â‚¹)",
      qualification: "à¤ªà¥à¤¾à¤ˆ",
      degree: "à¤¡à¤¿à¤—à¥à¤°à¥€",
      institution: "à¤¸à¤‚à¤¸à¥à¤¥à¤¾",
      hospital: "à¤…à¤¸à¥à¤ªà¤¤à¤¾à¤²",
      verification: "à¤•à¤¾à¤—à¤œ",
      submit: "à¤­à¥‡à¤œ à¤¦à¥‡à¤µà¥‹",
      hello: "à¤–à¤®à¥à¤®à¤¾ à¤˜à¤£à¥€, à¤¡à¥‰.",
      sign_out: "à¤¸à¤¾à¤‡à¤¨ à¤†à¤‰à¤Ÿ",
      tabs: {
        pipeline: "à¤®à¤°à¥€à¤œ",
        slots: "à¤¸à¤®à¤¯",
        security: "à¤¸à¥à¤°à¤•à¥à¤·à¤¾"
      },
      stats: {
        total: "à¤¸à¤—à¤³à¤¾",
        pending: "à¤¬à¤¾à¤•à¥€",
        treated: "à¤ à¥€à¤• à¤¹à¥‹à¤—à¥à¤¯à¤¾"
      },
      auth: {
        invalid_credentials: "à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤—à¤²à¤¤ à¤¹à¥ˆà¥¤",
        application_pending: "à¤à¤¡à¤®à¤¿à¤¨ à¤¦à¥‡à¤– à¤°à¤¹à¥à¤¯à¥‹ à¤¹à¥ˆà¥¤",
        failed_authenticate: "à¤²à¥‰à¤—à¤¿à¤¨ à¤•à¥‹à¤¨à¥€ à¤¹à¥à¤¯à¥‹à¥¤",
        email_registered: "à¤ˆà¤®à¥‡à¤² à¤ªà¥‡à¤¹à¤²à¥à¤¯à¤¾ à¤¸à¥ à¤¹à¥ˆà¥¤",
        registration_failed: "à¤°à¤œà¤¿à¤¸à¥à¤Ÿà¥à¤°à¥‡à¤¶à¤¨ à¤«à¥‡à¤² à¤¹à¥‹à¤—à¥à¤¯à¥‹à¥¤",
        application_submitted: "à¤«à¥‰à¤°à¥à¤® à¤œà¤®à¤¾ à¤¹à¥‹à¤—à¥à¤¯à¥‹!",
        application_review_message: " à¤®à¤‚à¤œà¥‚à¤°à¥€ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥€ à¤²à¥‰à¤—à¤¿à¤¨ à¤¹à¥‹ à¤œà¤¾à¤µà¥‡à¤²à¤¾à¥¤",
        sign_out_reset: "à¤¸à¤¾à¤‡à¤¨ à¤†à¤‰à¤Ÿ",
        access_gateway: "à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤ªà¥à¤°à¤µà¥‡à¤¶",
        sign_in: "à¤²à¥‰à¤—à¤¿à¤¨",
        apply_register: "à¤œà¥à¥œà¥‹",
        portal_title: "à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤¸à¤¾'à¤¬ à¤°à¥‹ à¤ªà¥‹à¤°à¥à¤Ÿà¤²",
        secure_access: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤ªà¥‹à¤°à¥à¤Ÿà¤²",
        registered_email: "à¤ªà¤‚à¤œà¥€à¤•à¥ƒà¤¤ à¤ˆà¤®à¥‡à¤²",
        secure_password: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡",
        access_records: "à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤¦à¥‡à¤–à¥‹",
        partnership_title: "à¤¸à¤¾à¤à¥‡à¤¦à¤¾à¤°à¥€",
        partnership_highlight: "à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
        join_network: "à¤¨à¥‡à¤Ÿà¤µà¤°à¥à¤• à¤®à¥‡à¤‚ à¤†à¤“",
        login_credentials: "à¤²à¥‰à¤—à¤¿à¤¨ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€",
        email_address: "à¤ˆà¤®à¥‡à¤²",
        password: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡",
        professional_profile: "à¤ªà¥à¤°à¥‹à¤«à¤¾à¤‡à¤²",
        full_name: "à¤ªà¥‚à¤°à¥‹ à¤¨à¤¾à¤®",
        phone_number: "à¤«à¥‹à¤¨",
        age: "à¤‰à¤®à¥à¤°",
        experience: "à¤…à¤¨à¥à¤­à¤µ",
        specialization: "à¤–à¤¾à¤¸à¤¿à¤¯à¤¤",
        consultation_fee: "à¤«à¥€à¤¸",
        qualification_institution: "à¤ªà¥à¤¾à¤ˆ",
        degree: "à¤¡à¤¿à¤—à¥à¤°à¥€",
        institution: "à¤¸à¤‚à¤¸à¥à¤¥à¤¾",
        hospital_clinic: "à¤…à¤¸à¥à¤ªà¤¤à¤¾à¤²",
        verification_assets: "à¤•à¤¾à¤—à¤œ",
        profile_image_url: "à¤«à¥‹à¤Ÿà¥‹",
        proof_of_degree_url: "à¤ªà¥à¤°à¤®à¤¾à¤£",
        submit_application: "à¤­à¥‡à¤œà¥‹"
      },
      availability: {
        update_success: "à¤¸à¤®à¤¯ à¤¬à¤¦à¤²à¤—à¥à¤¯à¥‹à¥¤",
        save_error: "à¤¸à¤®à¤¯ à¤•à¥‹à¤¨à¥€ à¤¬à¤¦à¤²à¥à¤¯à¥‹à¥¤"
      },
      security: {
        password_length_error: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¥¬ à¤…à¤•à¥à¤·à¤° à¤¸à¥ à¤¬à¤¡à¥‹ à¤¹à¥‹à¤£à¥‹ à¤šà¤¾à¤¹à¤µà¥‡à¥¤",
        password_update_success: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤¬à¤¦à¤²à¤—à¥à¤¯à¥‹à¥¤",
        password_change_error: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤•à¥‹à¤¨à¥€ à¤¬à¤¦à¤²à¥à¤¯à¥‹à¥¤"
      },
      email_actions: {
        pre_consultation_instructions: "à¤¸à¤²à¤¾à¤¹ à¤°à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€",
        sent_success: "à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤­à¥‡à¤œ à¤¦à¥€ {{email}} à¤ªà¤°",
        dispatch_error: "à¤ˆà¤®à¥‡à¤² à¤•à¥‹à¤¨à¥€ à¤—à¤¯à¥‹à¥¤"
      },
      appointments: {
        title: "à¤®à¤°à¥€à¤œ",
        no_apt: "à¤•à¥‹à¤ˆ à¤®à¤°à¥€à¤œ à¤•à¥‹à¤¨à¥€à¥¤",
        concluded: "à¤¹à¥‹à¤—à¥à¤¯à¥‹",
        video: "à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤•à¥‰à¤²",
        pre_reqs: "à¤œà¤°à¥‚à¤°à¥€ à¤šà¥€à¥›",
        cancel: "à¤°à¤¦à¥à¤¦",
        fetch_error: "à¤¤à¥à¤°à¥à¤Ÿà¤¿",
        check_firestore: "à¤œà¤¾à¤‚à¤šà¥‹",
        confirm_conclude: "à¤•à¤¾à¤® à¤ªà¥‚à¤°à¤¾ à¤¹à¥‹à¤—à¥à¤¯à¥‹?",
        confirm_cancel: "à¤°à¤¦à¥à¤¦ à¤•à¤°à¤£à¤¾ à¤šà¤¾à¤¹à¤µà¥‹?",
        reported_symptoms: "à¤¬à¥€à¤®à¤¾à¤°à¥€ à¤°à¤¾ à¤²à¤•à¥à¤·à¤£"
      }
    },
    specialities: {
      general_physician: "à¤†à¤® à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      cardiology: "à¤¦à¤¿à¤² à¤°à¥‹ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      neurology: "à¤¨à¤¸à¤¾à¤‚ à¤°à¥‹ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      orthopedics: "à¤¹à¤¡à¥à¤¡à¤¿à¤¯à¤¾à¤‚ à¤°à¥‹ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      dermatology: "à¤šà¤¾à¤®à¥œà¥€ à¤°à¥‹ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      pediatrics: "à¤Ÿà¤¾à¤¬à¤°à¤¾à¤‚ à¤°à¥‹ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      oncology: "à¤•à¥ˆà¤‚à¤¸à¤° à¤°à¥‹ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      psychiatry: "à¤®à¤¨ à¤°à¥‹ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
      urology: "à¤®à¥‚à¤¤à¥à¤° à¤°à¥‹à¤—",
      radiology: "à¤°à¥‡à¤¡à¤¿à¤¯à¥‹à¤²à¥‰à¤œà¥€",
      endocrinology: "à¤—à¥à¤°à¤‚à¤¥à¤¿ à¤°à¥‹à¤—",
      pathology: "à¤œà¤¾à¤‚à¤š à¤˜à¤°",
      surgery: "à¤‘à¤ªà¤°à¥‡à¤¶à¤¨"
    },
    home: {
      intelligence: {
        title: "à¤œà¤¯à¤ªà¥à¤° à¤¸à¥à¤µà¤¾à¤¸à¥à¤¥à¥à¤¯",
        highlight: "à¤œà¤¾à¤£à¤•à¤¾à¤°à¥€",
        desc: "à¤…à¤¸à¥à¤ªà¤¤à¤¾à¤²à¤¾à¤‚ à¤¸à¥ à¤¸à¥€à¤§à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤¥à¤¾à¤°à¥‡ à¤ªà¥‹à¤°à¥à¤Ÿà¤² à¤ªà¤°à¥¤",
        fetching: "à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤²à¥‡ à¤°à¤¯à¤¾ à¤¹à¤¾à¤‚...",
        no_alerts: "à¤¹à¤¾à¤² à¤•à¥‹à¤ˆ à¤–à¤¬à¤° à¤•à¥‹à¤¨à¥€à¥¤",
        alert: "à¤šà¥‡à¤¤à¤¾à¤µà¤¨à¥€",
        no_details: "à¤ªà¥‚à¤°à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤®à¥‡à¤‚ à¤¦à¥‡à¤–à¥‹à¥¤",
        read_report: "à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤ªà¥à¥‹"
      },
      features: {
        instant: {
          title: "à¤¤à¥à¤°à¤‚à¤¤ à¤¡à¥‰à¤•à¥à¤Ÿà¤°",
          desc: "à¤¸à¤¹à¥€ à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤šà¥à¤¨à¥‡à¤²à¤¾à¥¤"
        },
        realtime: {
          title: "à¤¹à¤¾à¤¥à¥‹à¤‚-à¤¹à¤¾à¤¥",
          desc: "à¤Ÿà¤¾à¤‡à¤® à¤¬à¤¿à¤²à¤•à¥à¤² à¤¸à¤¹à¥€ à¤¦à¤¿à¤–à¥‡à¤²à¤¾à¥¤"
        },
        encrypted: {
          title: "à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤",
          desc: "à¤¡à¥‡à¤Ÿà¤¾ à¤à¤•à¤¦à¤® à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤°à¥‡à¤µà¥‡à¤²à¤¾à¥¤"
        }
      }
    },
    lab: {
      portal: "à¤œà¤¾à¤‚à¤š à¤˜à¤°",
      auth: "à¤²à¥‰à¤—à¤¿à¤¨",
      register: "à¤¨à¤¯à¥‹ à¤œà¤¾à¤‚à¤š à¤˜à¤°",
      tests: "à¤œà¤¾à¤‚à¤š à¤¸à¥‚à¤šà¥€",
      bookings: "à¤¬à¥à¤•à¤¿à¤‚à¤—",
      book_test: "à¤œà¤¾à¤‚à¤š à¤¬à¥à¤• à¤•à¤°à¥‹",
      hospital: "à¤œà¤¾à¤‚à¤š à¤•à¥‡à¤‚à¤¦à¥à¤°",
      charges: "à¤«à¥€à¤¸",
      select_test: "à¤œà¤¾à¤‚à¤š à¤šà¥à¤¨à¥‹",
      confirm: "à¤ªà¤•à¥à¤•à¤¾ à¤•à¤°à¥‹",
      registration_pending: "à¤¥à¤¾à¤•à¥‹ à¤†à¤µà¥‡à¤¦à¤¨ à¤à¤¡à¤®à¤¿à¤¨ à¤¦à¥‡à¤– à¤°à¤¹à¥à¤¯à¥‹ à¤¹à¥ˆà¥¤",
      no_tests_found: "à¤•à¥‹à¤ˆ à¤®à¤‚à¤œà¥‚à¤° à¤œà¤¾à¤‚à¤š à¤•à¥‹à¤¨à¥€ à¤®à¤¿à¤²à¥€à¥¤"
    },
    patient: {
      portal: "à¤®à¤°à¥€à¤œ à¤ªà¥‹à¤°à¥à¤Ÿà¤²",
      welcome: "à¤ªà¤§à¤¾à¤°à¥‹ à¤¸à¤¾,",
      book_new: "à¤¨à¤¯à¥‹ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ",
      sign_out: "à¤¬à¤¾'à¤° à¤¨à¤¿à¤•à¤³à¥‹",
      upcoming: "à¤†à¤µà¤£ à¤†à¤³à¤¾ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ",
      history: "à¤ªà¤¿à¤›à¤²à¥‹ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡",
      no_upcoming: "à¤•à¥‹à¤ˆ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤•à¥‹à¤¨à¥€à¥¤",
      no_history: "à¤•à¥‹à¤ˆ à¤°à¤¿à¤•à¥‰à¤°à¥à¤¡ à¤•à¥‹à¤¨à¥€à¥¤",
      rebook: "à¤ªà¤¾à¤›à¥‹ à¤¬à¥à¤• à¤•à¤°à¥‹",
      cancel: "à¤°à¤¦à¥à¤¦",
      online: "à¤‘à¤¨à¤²à¤¾à¤‡à¤¨",
      offline: "à¤‘à¤«à¤²à¤¾à¤‡à¤¨"
    },
    booking: {
      title: "à¤¬à¥à¤•à¤¿à¤‚à¤—",
      step: "à¥© à¤¸à¥ à¤šà¤°à¤£ {{current}}",
      symptoms: {
        title: "à¤¬à¥€à¤®à¤¾à¤°à¥€ à¤¬à¤¤à¤¾à¤“",
        desc: "à¤¸à¤¹à¥€ à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤•à¤¨à¥ˆ à¤­à¥‡à¤œà¥‡à¤²à¤¾à¥¤",
        placeholder: "à¤œà¥ˆà¤¸à¥‡, à¤®à¥à¤¹à¤¾à¤°à¥ˆ à¤®à¤¾à¤¥à¤¾ à¤®à¥‡à¤‚ à¤¦à¤°à¥à¤¦ à¤¹à¥ˆ...",
        cta: "à¤à¤†à¤ˆ à¤¸à¥ à¤ªà¥‚à¤›à¥‹"
      },
      triage: {
        result: "à¤ªà¤°à¤¿à¤£à¤¾à¤®",
        ai: "à¤à¤†à¤ˆ à¤œà¤¾à¤‚à¤š",
        engine_desc: "à¤¶à¥à¤°à¥à¤†à¤¤à¥€ à¤œà¤¾à¤‚à¤š",
        local_engine: "à¤²à¥‹à¤•à¤² à¤‡à¤‚à¤œà¤¨",
        disclaimer: "à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤¸à¥ à¤®à¤¿à¤²à¤£à¥‹ à¤œà¤°à¥‚à¤°à¥€ à¤¹à¥ˆà¥¤"
      },
      doctors: {
        title: "à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤¸à¤¾'à¤¬",
        none: "à¤•à¥‹à¤¨à¥€ à¤®à¤¿à¤²à¥à¤¯à¤¾à¥¤",
        register_desc: "à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¤• à¤¨à¥‡ à¤œà¥‹à¥œà¥‹:",
        cta: "à¤Ÿà¤¾à¤‡à¤® à¤šà¥à¤£à¥‹"
      },
      slots: {
        type: "à¤ªà¤°à¤¾à¤®à¤°à¥à¤¶ à¤¤à¤°à¥€à¤•à¥‹",
        in_person: "à¤®à¤¿à¤²'à¤° (à¤‘à¤«à¤²à¤¾à¤‡à¤¨)",
        virtual: "à¤µà¥€à¤¡à¤¿à¤¯à¥‹ (à¤‘à¤¨à¤²à¤¾à¤‡à¤¨)",
        date: "à¤¤à¤¾à¤°à¥€à¤– à¤šà¥à¤£à¥‹",
        time: "à¤Ÿà¤¾à¤‡à¤® à¤šà¥à¤£à¥‹",
        cta: "â‚¹{{fee}} à¤ªà¤•à¥à¤•à¥‹ à¤•à¤°à¥‹"
      }
    },
    metrics: {
      specialists: "à¤–à¤¾à¤¸ à¤¡à¥‰à¤•à¥à¤Ÿà¤° à¤¸à¤¾'à¤¬",
      satisfaction: "à¤–à¥à¤¶ à¤®à¤°à¥€à¤œ",
      booking_time: "à¤”à¤¸à¤¤ à¤Ÿà¤¾à¤‡à¤®",
      charges: "à¤«à¥€à¤¸"
    },
    common: {
      sign_out: "à¤¬à¤¾'à¤° à¤¨à¤¿à¤•à¤³à¥‹",
      language: "à¤­à¤¾à¤¸à¤¾",
      hello: "à¤–à¤®à¥à¤®à¤¾ à¤˜à¤£à¥€",
      reset: "à¤°à¥€à¤¸à¥‡à¤Ÿ"
    }
  }
};
