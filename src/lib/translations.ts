export const translations = {
  en: {
    nav: {
      admin: "Admin",
      doctor: "Doctor",
      lab: "Lab",
      home: "Home",
      health_checkup: "Health Checkup"
    },
    hero: {
      badge: "Jaipur's Trusted Healthcare Partner",
      title_prefix: "The Pink City's Reliable,",
      title_highlight: "Medical Network.",
      description: "Experience world-class medical care in Jaipur. Instant specialist matching and secure, seamless booking for every patient.",
      book_now: "Book Appointment",
      explore: "Our Services",
      physician_gateway: "Doctor's Portal"
    },
    admin: {
      console: "Administration",
      auth_only: "Authorized Personnel Only",
      email: "Admin Email",
      access_key: "Access Key",
      uplink: "Secure Admin Login",
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
      global_command: "System Management",
      system_online: "System Online",
      terminate_session: "Sign Out",
      pending_applications: "Review Applications",
      initializing_secure_channel: "Connecting to Secure Server..."
    },
    doctor: {
      portal: "Doctor's Portal",
      sign_in: "Sign In",
      apply: "Join Our Network",
      email: "Registered Email",
      password: "Password",
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
      fee: "Consultation Fee (₹)",
      qualification: "Qualification & Institution",
      degree: "Degree(s)",
      institution: "Institution",
      hospital: "Hospital / Clinic",
      verification: "Verification Documents",
      submit: "Submit Application",
      hello: "Hello, Dr.",
      sign_out: "Sign Out",
      tabs: {
        pipeline: "Current Appointments",
        slots: "My Schedule",
        security: "Account Security"
      },
      stats: {
        total: "Total Patients",
        pending: "Upcoming Visits",
        treated: "Consultations Completed"
      },
      auth: {
        invalid_credentials: "The credentials provided are incorrect.",
        application_pending: "Your account is currently being reviewed by our team.",
        failed_authenticate: "Unable to authenticate at this time.",
        email_registered: "This email is already registered in our system.",
        registration_failed: "We couldn't process your registration. Please try again.",
        application_submitted: "Application Received!",
        application_review_message: "Thank you for interest. Our team will review your credentials and notify you once access is granted.",
        sign_out_reset: "Reset & Sign Out",
        access_gateway: "Physician Secure Entry",
        sign_in: "Doctor Sign In",
        apply_register: "Apply to Join",
        portal_title: "Healthcare Provider Portal",
        secure_access: "Verified Personnel Only",
        registered_email: "Email Address",
        secure_password: "Password",
        access_records: "Login to Dashboard",
        partnership_title: "Doctor",
        partnership_highlight: "Collaboration",
        join_network: "Partner with MedicarePlus",
        login_credentials: "Secure Credentials",
        email_address: "Email Address",
        password: "Password",
        professional_profile: "Medical Profile",
        full_name: "Full Name",
        phone_number: "Phone Number",
        age: "Age",
        experience: "Years of Experience",
        specialization: "Area of Specialization",
        consultation_fee: "Consultation Fee (₹)",
        qualification_institution: "Educational Background",
        degree: "Academic Degree",
        institution: "University/Institution",
        hospital_clinic: "Primary Hospital/Clinic",
        verification_assets: "Verification Links",
        profile_image_url: "Photo Link",
        proof_of_degree_url: "Certificate Link",
        submit_application: "Complete Application"
      },
      availability: {
        update_success: "Your availability has been updated.",
        save_error: "We couldn't save your schedule changes."
      },
      security: {
        password_length_error: "Passwords must be at least 6 characters long.",
        password_update_success: "Your password has been changed successfully.",
        password_change_error: "Unable to update password. Please contact support.",
        desc: "Protect your account by regularly updating your secure password.",
        update_cta: "Update Password",
        placeholder: "Minimum 6 characters"
      },
      email_actions: {
        pre_consultation_instructions: "Patient Instructions",
        sent_success: "Instructions have been sent to {{email}}",
        dispatch_error: "Delivery failed. Please check the patient's email."
      },
      appointments: {
        title: "Today's Schedule",
        no_apt: "No appointments scheduled for today.",
        concluded: "Completed",
        video: "Start Video Consultation",
        pre_reqs: "Requirements",
        cancel: "Cancel",
        fetch_error: "Unable to load appointments.",
        check_firestore: "Check your internet connection.",
        confirm_conclude: "Mark this consultation as finished?",
        confirm_cancel: "Are you sure you want to cancel? The patient will receive a refund.",
        reported_symptoms: "Patient Symptoms"
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
        title: "Regional Health",
        highlight: "Updates",
        desc: "Stay informed with real-time health alerts and preventive tips from our local hospital network.",
        fetching: "Loading health updates...",
        no_alerts: "No active alerts in your area.",
        alert: "Notice",
        no_details: "Click 'View Details' for the full health advisory.",
        read_report: "View Details"
      },
      features: {
        instant: {
          title: "Quick Matching",
          desc: "Our system automatically identifies the best specialist for your needs."
        },
        realtime: {
          title: "Live Schedules",
          desc: "Book directly into your doctor's calendar with real-time availability."
        },
        encrypted: {
          title: "Private & Secure",
          desc: "Your medical history is protected with industry-leading encryption."
        }
      }
    },
    lab: {
      portal: "Lab Diagnostics",
      auth: "Lab Specialist Access",
      register: "Register Facility",
      tests: "Manage Test Catalog",
      bookings: "Lab Bookings",
      book_test: "Schedule Test",
      hospital: "Diagnostic Center",
      charges: "Test Rate",
      select_test: "Choose Laboratory Test",
      catalog_desc: "DIAGNOSTIC TEST CATALOG",
      confirm: "Book & Pay",
      registration_pending: "Your laboratory center registration is under review.",
      no_tests_found: "No available tests were found in the catalog."
    },
    patient: {
      portal: "Patient Portal",
      welcome: "Welcome back,",
      book_new: "New Appointment",
      sign_out: "Sign Out",
      upcoming: "Upcoming Visits",
      history: "Past Appointments",
      no_upcoming: "No upcoming visits scheduled.",
      no_history: "No previous records found.",
      rebook: "Book Again",
      cancel: "Cancel",
      online: "Video Call",
      offline: "Clinic Visit"
    },
    booking: {
      title: "Book An Appointment",
      step: "Step {{current}} of 3",
      symptoms: {
        title: "How are you feeling today?",
        desc: "Describe your symptoms and our assistant will suggest the right specialist for you.",
        placeholder: "Describe your condition (e.g., persistent cough, dizziness)...",
        cta: "Analyze Symptoms"
      },
      triage: {
        result: "Recommended Specialist",
        ai: "Health Assessment",
        engine_desc: "Preliminary Symptom Review",
        local_engine: "MedicarePlus Assistant",
        disclaimer: "This is a computer-aided suggestion. Please consult your doctor for a final diagnosis."
      },
      doctors: {
        title: "Available Specialists",
        none: "We couldn't find available specialists for this category right now.",
        register_desc: "Search for doctors in this specialization:",
        cta: "Choose Slot"
      },
      slots: {
        type: "Visit Type",
        in_person: "Clinic Visit",
        virtual: "Video Consultation",
        date: "Appointment Date",
        time: "Available Time",
        cta: "Pay ₹{{fee}} & Confirm"
      }
    },
    metrics: {
      specialists: "Renowned Specialists",
      satisfaction: "Patient Smiles",
      booking_time: "Avg. Wait Time",
      charges: "Service Fee"
    },
    common: {
      sign_out: "Sign Out",
      language: "Language",
      hello: "Namaste",
      reset: "Clear All",
      save: "Save Changes",
      sending: "Sending..."
    }
  },
  hi: {
    nav: {
      admin: "प्रशासक",
      doctor: "चिकित्सक",
      lab: "जांच केंद्र",
      home: "मुख्य पृष्ठ",
      health_checkup: "स्वास्थ्य जांच"
    },
    hero: {
      badge: "जयपुर की सबसे विश्वसनीय स्वास्थ्य सेवा",
      title_prefix: "गुलाबी नगरी का सबसे सुरक्षित,",
      title_highlight: "चिकित्सा नेटवर्क।",
      description: "जयपुर में विश्व स्तरीय स्वास्थ्य सेवा। तुरंत विशेषज्ञ मिलान और सुरक्षित, सरल बुकिंग अनुभव।",
      book_now: "अपॉइंटमेंट लें",
      explore: "हमारी सेवाएँ",
      physician_gateway: "डॉक्टर विशेषज्ञ पोर्टल"
    },
    admin: {
      console: "प्रशासकीय पैनल",
      auth_only: "केवल अधिकृत अधिकारियों के लिए",
      email: "प्रशासक ईमेल",
      access_key: "एक्सेस कुंजी",
      uplink: "सुरक्षित लॉगिन",
      edit: "बदलें",
      cancel: "रद्द करें",
      save: "बदलाव सुरक्षित करें",
      approve: "मंजूरी दें",
      decline: "अस्वीकार करें",
      doctor: "चिकित्सक",
      patient: "मरीज",
      booking: "बुकिंग",
      status_approved: "स्वीकृत",
      status_pending: "लंबित",
      status_declined: "अस्वीकृत",
      global_command: "सिस्टम प्रबंधन",
      system_online: "सिस्टम सक्रिय है",
      terminate_session: "लॉग आउट",
      pending_applications: "आवेदनों की समीक्षा",
      initializing_secure_channel: "सुरक्षित कनेक्शन स्थापित किया जा रहा है..."
    },
    doctor: {
      portal: "चिकित्सक पोर्टल",
      sign_in: "लॉगिन",
      apply: "नेटवर्क से जुड़ें",
      email: "पंजीकृत ईमेल",
      password: "पासवर्ड",
      access_records: "डैशबोर्ड पर जाएँ",
      partnership: "चिकित्सक साझेदारी",
      join: "मेडिकेयर प्लस नेटवर्क में शामिल हों",
      credentials: "लॉगिन विवरण",
      profile: "पेशेवर जानकारी",
      full_name: "पूरा नाम",
      phone: "संपर्क नंबर",
      age: "उम्र",
      experience: "अनुभव (वर्ष)",
      specialization: "विशेषज्ञता",
      fee: "परामर्श शुल्क (₹)",
      qualification: "शिक्षा और संस्थान",
      degree: "डिग्री",
      institution: "विश्वविद्यालय/संस्थान",
      hospital: "अस्पताल / क्लिनिक",
      verification: "सत्यापन दस्तावेज",
      submit: "आवेदन भेजें",
      hello: "नमस्ते, डॉ.",
      sign_out: "साइन आउट",
      tabs: {
        pipeline: "निर्धारित अपॉइंटमेंट",
        slots: "मेरा शेड्यूल",
        security: "खाता सुरक्षा"
      },
      stats: {
        total: "कुल मरीज",
        pending: "आगामी अपॉइंटमेंट",
        treated: "परामर्श पूर्ण"
      },
      auth: {
        invalid_credentials: "विवरण गलत हैं।",
        application_pending: "आपका आवेदन अभी समीक्षा के अधीन है।",
        failed_authenticate: "लॉगिन विफल रहा।",
        email_registered: "यह ईमेल पहले से पंजीकृत है।",
        registration_failed: "पंजीकरण विफल रहा।",
        application_submitted: "आवेदन प्राप्त हुआ!",
        application_review_message: "पंजीकरण के बाद आप लॉगिन कर पाएंगे।",
        sign_out_reset: "साइन आउट",
        access_gateway: "डॉक्टर पोर्टल प्रवेश",
        sign_in: "साइन इन",
        apply_register: "जुड़ें / पंजीकरण",
        portal_title: "डॉक्टर पोर्टल",
        secure_access: "सुरक्षित पहुंच",
        registered_email: "पंजीकृत ईमेल",
        secure_password: "पासवर्ड",
        access_records: "डैशबोर्ड पर जाएं",
        partnership_title: "डॉक्टर",
        partnership_highlight: "साझेदारी",
        join_network: "नेटवर्क में शामिल हों",
        login_credentials: "लॉगिन विवरण",
        email_address: "ईमेल पता",
        password: "पासवर्ड",
        professional_profile: "पेशेवर प्रोफाइल",
        full_name: "पूरा नाम",
        phone_number: "संपर्क नंबर",
        age: "उम्र",
        experience: "अनुभव",
        specialization: "विशेषज्ञता",
        consultation_fee: "परामर्श शुल्क",
        qualification_institution: "शिक्षा",
        degree: "डिग्री",
        institution: "संस्थान",
        hospital_clinic: "अस्पताल",
        verification_assets: "दस्तावेज",
        profile_image_url: "फोटो लिंक",
        proof_of_degree_url: "प्रमाण पत्र",
        submit_application: "आवेदन भेजें"
      },
      availability: {
        update_success: "उपलब्धता अपडेट कर दी गई है।",
        save_error: "अपडेट विफल रहा।"
      },
      security: {
        password_length_error: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
        password_update_success: "पासवर्ड सफलतापूर्वक बदल दिया गया है।",
        password_change_error: "पासवर्ड बदलना विफल रहा।",
        desc: "अपना पासवर्ड नियमित रूप से बदलकर अपने खाते को सुरक्षित रखें।",
        update_cta: "पासवर्ड अपडेट करें",
        placeholder: "कम से कम 6 अक्षर"
      },
      email_actions: {
        pre_consultation_instructions: "मरीज के लिए निर्देश",
        sent_success: "निर्देश भेज दिए गए हैं",
        dispatch_error: "ईमेल भेजने में त्रुटि।"
      },
      appointments: {
        title: "आज के अपॉइंटमेंट",
        no_apt: "आज कोई अपॉइंटमेंट नहीं है।",
        concluded: "पूर्ण",
        video: "वीडियो कॉल",
        pre_reqs: "जरूरी निर्देश",
        cancel: "रद्द करें",
        fetch_error: "डेटा लोड करने में त्रुटि",
        check_firestore: "इंटरनेट कनेक्शन की जांच करें",
        confirm_conclude: "क्या अपॉइंटमेंट पूर्ण हो गया है?",
        confirm_cancel: "क्या आप रद्द करना चाहते हैं?",
        reported_symptoms: "मरीज के लक्षण"
      }
    },
    specialities: {
      general_physician: "सामान्य चिकित्सक",
      cardiology: "हृदय रोग विशेषज्ञ",
      neurology: "न्यूरोलॉजिस्ट",
      orthopedics: "हड्डी रोग विशेषज्ञ",
      dermatology: "त्वचा रोग विशेषज्ञ",
      pediatrics: "बाल रोग विशेषज्ञ",
      oncology: "कैंसर विशेषज्ञ",
      psychiatry: "मनोचिकित्सक",
      urology: "मूत्र रोग विशेषज्ञ",
      radiology: "रेडियोलॉजिस्ट",
      endocrinology: "एंडोक्रिनोलॉजिस्ट",
      pathology: "पैथोलॉजिस्ट",
      surgery: "सर्जन"
    },
    home: {
      intelligence: {
        title: "क्षेत्रीय स्वास्थ्य",
        highlight: "अपडेट",
        desc: "स्थानीय अस्पतालों से स्वास्थ्य चेतावनियाँ और निवारक सुझाव सीधे अपने पोर्टल पर प्राप्त करें।",
        fetching: "ताज़ा जानकारी लोड की जा रही है...",
        no_alerts: "आपके क्षेत्र में इस समय कोई महत्वपूर्ण अलर्ट नहीं है।",
        alert: "चेतावनी",
        no_details: "पूरी जानकारी के लिए विवरण देखें पर क्लिक करें।",
        read_report: "विवरण देखें"
      },
      features: {
        instant: {
          title: "तुरंत मिलान",
          desc: "हमारा सिस्टम आपकी ज़रूरतों के आधार पर सही डॉक्टर का सुझाव देता है।"
        },
        realtime: {
          title: "लाइव शेड्यूल",
          desc: "डॉक्टर की उपलब्धता के अनुसार तुरंत अपॉइंटमेंट बुक करें।"
        },
        encrypted: {
          title: "पूर्णतः सुरक्षित",
          desc: "आपकी चिकित्सा जानकारी आधुनिक एन्क्रिप्शन के साथ निजी रखी जाती है।"
        }
      }
    },
    lab: {
      portal: "लैब और जांच",
      auth: "लैब लॉगिन",
      register: "लैब पंजीकरण",
      tests: "जांच सूची",
      bookings: "बुकिंग",
      book_test: "लैब टेस्ट बुक करें",
      hospital: "जांच केंद्र",
      charges: "शुल्क",
      select_test: "जांच चुनें",
      confirm: "बुक करें और भुगतान करें",
      registration_pending: "आपका लैब पंजीकरण समीक्षा के अधीन है।",
      no_tests_found: "कोई स्वीकृत टेस्ट नहीं मिला।"
    },
    patient: {
      portal: "मरीज पोर्टल",
      welcome: "स्वागत है,",
      book_new: "नया अपॉइंटमेंट",
      sign_out: "साइन आउट",
      upcoming: "आगामी मुलाकात",
      history: "पुराने रिकॉर्ड",
      no_upcoming: "कोई आगामी अपॉइंटमेंट नहीं है।",
      no_history: "कोई पुराना रिकॉर्ड नहीं मिला।",
      rebook: "फिर से बुक करें",
      cancel: "रद्द करें",
      online: "वीडियो कॉल",
      offline: "क्लिनिक विजिट"
    },
    booking: {
      title: "अपॉइंटमेंट बुकिंग",
      step: "चरण {{current}}/3",
      symptoms: {
        title: "आज आप कैसा महसूस कर रहे हैं?",
        desc: "अपने लक्षणों के बारे में बताएं और हमारा सहायक आपके लिए सही विशेषज्ञ का सुझाव देगा।",
        placeholder: "जैसे: लगातार खांसी, सिरदर्द या चक्कर आना...",
        cta: "लक्षणों का विश्लेषण करें"
      },
      triage: {
        result: "अनुशंसित विशेषज्ञ",
        ai: "स्वास्थ्य मूल्यांकन",
        engine_desc: "प्रारंभिक लक्षण समीक्षा",
        local_engine: "मेडिकेयर प्लस सहायक",
        disclaimer: "यह केवल एक सुझाव है। कृपया चिकित्सक से परामर्श अवश्य लें।"
      },
      doctors: {
        title: "उपलब्ध विशेषज्ञ",
        none: "इस श्रेणी में फिलहाल कोई डॉक्टर उपलब्ध नहीं है।",
        register_desc: "इस विशेषज्ञता के डॉक्टरों की अन्य अस्पतालों में खोज करें:",
        cta: "समय चुनें"
      },
      slots: {
        type: "परामर्श का प्रकार",
        in_person: "क्लिनिक पर (ऑफलाइन)",
        virtual: "वीडियो कॉल (ऑनलाइन)",
        date: "तारीख चुनें",
        time: "उपलब्ध समय",
        cta: "₹{{fee}} भुगतान करें और बुक करें"
      }
    },
    metrics: {
      specialists: "प्रमुख विशेषज्ञ",
      satisfaction: "मरीजों की संतुष्टि",
      booking_time: "औसत बुकिंग समय",
      charges: "बुकिंग शुल्क"
    },
    common: {
      sign_out: "लॉग आउट",
      language: "भाषा",
      hello: "नमस्ते",
      reset: "रीसेट करें",
      save: "सुरक्षित करें",
      sending: "भेजा जा रहा है..."
    }
  }
};
