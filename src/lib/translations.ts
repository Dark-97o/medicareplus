export const translations = {
  en: {
    nav: {
      admin: "Admin",
      doctor: "Doctor",
      home: "Home"
    },
    hero: {
      badge: "Pink City's Premium Care Engine",
      title_prefix: "The Future of",
      title_highlight: "Jaipur Healthcare.",
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
      status_declined: "Declined"
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
      fee: "Consultation Fee (₹)",
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
        consultation_fee: "Consultation Fee (₹)",
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
        desc: "Our Groq-powered Llama 3 engine will analyze your condition, predict possible conditions, and instantly route you to the correct specialist.",
        placeholder: "e.g., I've been experiencing severe migraines...",
        cta: "Run AI Triage"
      },
      triage: {
        result: "Triage Result",
        ai: "Groq AI",
        engine_desc: "AI Preliminary Assessment",
        local_engine: "Local Engine",
        disclaimer: "Not a diagnosis. Possible conditions based on your description — your doctor will confirm."
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
        cta: "Pay ₹{{fee}} & Confirm"
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
      hello: "Hello"
    }
  },
  hi: {
    nav: {
      admin: "एडमिन",
      doctor: "डॉक्टर",
      home: "होम"
    },
    hero: {
      badge: "पिंक सिटी का प्रीमियम हेल्थकेयर इंजन",
      title_prefix: "भविष्य का",
      title_highlight: "जयपुर हेल्थकेयर।",
      description: "राजस्थान में चिकित्सा प्रौद्योगिकी के शिखर का अनुभव करें। जयपुर के मरीजों के लिए हाइपर-लोकल इंटेलिजेंट लक्षण मिलान और एक अल्ट्रा-सुरक्षित, सहज बुकिंग आर्किडेक्चर द्वारा संचालित।",
      book_now: "अपॉइंटमेंट बुक करें",
      explore: "स्केल देखें",
      physician_gateway: "स्वास्थ्य सेवा प्रदाता गेटवे"
    },
    admin: {
      console: "एडमिन कंसोल",
      auth_only: "केवल अधिकृत कर्मियों के लिए",
      email: "एडमिन ईमेल",
      access_key: "एक्सेस की",
      uplink: "सुरक्षित अपलिंक स्थापित करें",
      edit: "एडिट",
      cancel: "रद्द करें",
      save: "बदलाव सहेजें",
      approve: "अनुमोदित करें",
      decline: "अस्वीकार करें",
      doctor: "डॉक्टर",
      patient: "मरीज",
      booking: "बुकिंग",
      status_approved: "अनुमोदित",
      status_pending: "लंबित",
      status_declined: "अस्वीकृत"
    },
    doctor: {
      portal: "चिकित्सक पोर्टल",
      sign_in: "साइन इन",
      apply: "आवेदन / पंजीकरण",
      email: "पंजीकृत ईमेल",
      password: "सुरक्षित पासवर्ड",
      access_records: "रिकॉर्ड एक्सेस करें",
      partnership: "डॉक्टर साझेदारी",
      join: "MedicarePlus नेटवर्क में शामिल हों",
      credentials: "लॉगिन क्रेडेंशियल",
      profile: "प्रोफेशनल प्रोफाइल",
      full_name: "पूरा नाम",
      phone: "फोन नंबर",
      age: "आयु",
      experience: "अनुभव (वर्ष)",
      specialization: "विशेषज्ञता",
      fee: "परामर्श शुल्क (₹)",
      qualification: "योग्यता और संस्थान",
      degree: "डिग्री(s)",
      institution: "संस्थान",
      hospital: "अस्पताल / क्लिनिक",
      verification: "सत्यापन संपत्ति (URLs)",
      submit: "आवेदन जमा करें",
      hello: "नमस्ते, डॉ.",
      sign_out: "साइन आउट",
      tabs: {
        pipeline: "मरीज पाइपलाइन",
        slots: "स्लॉट प्रबंधित करें",
        security: "सुरक्षा पोर्टल"
      },
      stats: {
        total: "कुल आवंटित",
        pending: "लंबित पाइपलाइन",
        treated: "सफलतापूर्वक उपचार"
      },
      auth: {
        invalid_credentials: "डॉक्टर के क्रेडेंशियल अमान्य हैं।",
        application_pending: "आवेदन अभी भी प्रशासन द्वारा समीक्षाधीन है।",
        failed_authenticate: "प्रमाणीकरण विफल रहा।",
        email_registered: "ईमेल पहले से पंजीकृत है।",
        registration_failed: "पंजीकरण विफल रहा।",
        application_submitted: "आवेदन जमा किया गया!",
        application_review_message: "आपके क्रेडेंशियल एडमिन की समीक्षा के अधीन हैं। स्वीकृत होने के बाद आप लॉग इन कर पाएंगे।",
        sign_out_reset: "साइन आउट / टर्मिनल रीसेट",
        access_gateway: "चिकित्सक एक्सेस गेटवे",
        sign_in: "साइन इन",
        apply_register: "आवेदन / पंजीकरण",
        portal_title: "चिकित्सक पोर्टल",
        secure_access: "केवल सुरक्षित एक्सेस",
        registered_email: "पंजीकृत ईमेल",
        secure_password: "सुरक्षित पासवर्ड",
        access_records: "रिकॉर्ड एक्सेस करें",
        partnership_title: "डॉक्टर",
        partnership_highlight: "साझेदारी",
        join_network: "MedicarePlus नेटवर्क में शामिल हों",
        login_credentials: "लॉगिन क्रेडेंशियल",
        email_address: "ईमेल पता",
        password: "पासवर्ड",
        professional_profile: "प्रोफेशनल प्रोफाइल",
        full_name: "पूरा नाम",
        phone_number: "फोन नंबर",
        age: "आयु",
        experience: "अनुभव (वर्ष)",
        specialization: "विशेषज्ञता",
        consultation_fee: "परामर्श शुल्क (₹)",
        qualification_institution: "योग्यता और संस्थान",
        degree: "डिग्री(s)",
        institution: "संस्थान",
        hospital_clinic: "अस्पताल / क्लिनिक",
        verification_assets: "सत्यापन संपत्ति (URLs)",
        profile_image_url: "प्रोफाइल इमेज यूआरएल",
        proof_of_degree_url: "डिग्री का प्रमाण यूआरएल",
        submit_application: "आवेदन जमा करें"
      },
      availability: {
        update_success: "साप्ताहिक उपलब्धता सफलतापूर्वक अपडेट की गई।",
        save_error: "उपलब्धता सहेजने में विफल।"
      },
      security: {
        password_length_error: "पासवर्ड 6+ वर्णों का होना चाहिए।",
        password_update_success: "पासवर्ड अपडेट हो गया। कृपया अगली बार नए क्रेडेंशियल का उपयोग करें।",
        password_change_error: "पासवर्ड बदलने में विफल।"
      },
      email_actions: {
        pre_consultation_instructions: "परामर्श-पूर्व निर्देश",
        sent_success: "निर्देश {{email}} को भेजे गए",
        dispatch_error: "ईमेल भेजने में त्रुटि।"
      },
      appointments: {
        title: "अनुसूचित मरीज",
        no_apt: "अभी तक कोई अपॉइंटमेंट अनुसूचित नहीं है।",
        concluded: "संपन्न",
        video: "वीडियो कॉल ज्वाइन करें",
        pre_reqs: "पूर्व-आवश्यकताएँ",
        cancel: "रद्द करें",
        fetch_error: "अपॉइंटमेंट लोड करने में विफल",
        check_firestore: "फायरस्टोर इंडेक्स/अनुमतियां जांचें",
        confirm_conclude: "क्या आप इस अपॉइंटमेंट को संपन्न के रूप में चिह्नित करना चाहते हैं?",
        confirm_cancel: "क्या आप इस अपॉइंटमेंट को रद्द करना चाहते हैं? मरीज को पैसे वापस कर दिए जाएंगे।",
        reported_symptoms: "रिपोर्ट किए गए लक्षण"
      }
    },
    specialities: {
      general_physician: "सामान्य चिकित्सक",
      cardiology: "हृदय रोग",
      neurology: "न्यूरोलॉजी",
      orthopedics: "हड्डियों का डॉक्टर",
      dermatology: "त्वचा विशेषज्ञ",
      pediatrics: "बाल रोग",
      oncology: "कैंसर रोग",
      psychiatry: "मनोचिकित्सा",
      urology: "यूरोलॉजी",
      radiology: "रेडियोलॉजी",
      endocrinology: "एंडोक्रिनोलॉजी",
      pathology: "पैथोलॉजी",
      surgery: "सर्जरी"
    },
    home: {
      intelligence: {
        title: "जयपुर स्वास्थ्य",
        highlight: "इंटेलिजेंस",
        desc: "क्षेत्रीय अस्पतालों के हमारे नेटवर्क से सीधे आपके पोर्टल पर एकत्रित वास्तविक समय के स्थानीय स्वास्थ्य अलर्ट और निवारक उपाय।",
        fetching: "वास्तविक समय की इंटेलिजेंस प्राप्त की जा रही है...",
        no_alerts: "आपके क्षेत्र में कोई सक्रिय स्वास्थ्य अलर्ट नहीं है।",
        alert: "अलर्ट",
        no_details: "कोई विशिष्ट विवरण रिपोर्ट नहीं किया गया। पूर्ण सलाह देखने के लिए 'रिपोर्ट पढ़ें' पर क्लिक करें।",
        read_report: "रिपोर्ट पढ़ें"
      },
      features: {
        instant: {
          title: "तत्काल असाइनमेंट",
          desc: "अब और प्रतीक्षा नहीं। हमारी एआई तुरंत आपकी विशेषज्ञता की जरूरतों को निर्धारित करती है।"
        },
        realtime: {
          title: "वास्तविक समय की उपलब्धता",
          desc: "डॉक्टरों के शेड्यूल हमारे अल्ट्रा-लो लेटेंसी इंफ्रास्ट्रक्चर के माध्यम से गतिशील रूप से सिंक किए जाते हैं।"
        },
        encrypted: {
          title: "एन्क्रिप्टेड रिकॉर्ड",
          desc: "आपका मेडिकल डेटा सैन्य-स्तर के एंड-टू-एंड एन्क्रिप्शन के साथ निजी रहता है।"
        }
      }
    },
    patient: {
      portal: "मरीज पोर्टल",
      welcome: "वापसी पर स्वागत है,",
      book_new: "नया अपॉइंटमेंट बुक करें",
      sign_out: "साइन आउट",
      upcoming: "आगामी अपॉइंटमेंट",
      history: "इतिहास और रिकॉर्ड",
      no_upcoming: "कोई अनुसूचित अपॉइंटमेंट नहीं।",
      no_history: "कोई पिछला रिकॉर्ड नहीं मिला।",
      rebook: "रीबुक",
      cancel: "रद्द करें",
      online: "ऑनलाइन",
      offline: "ऑफलाइन"
    },
    booking: {
      title: "इंटेलिजेंट बुकिंग",
      step: "3 का चरण {{current}}",
      symptoms: {
        title: "अपने लक्षणों का वर्णन करें",
        desc: "हमारा Groq-संचालित Llama 3 इंजन आपकी स्थिति का विश्लेषण करेगा, संभावित स्थितियों की भविष्यवाणी करेगा, और तुरंत आपको सही विशेषज्ञ के पास भेज देगा।",
        placeholder: "जैसे, मुझे पिछले तीन दिनों से गंभीर माइग्रेन हो रहा है...",
        cta: "एआई ट्राइएज चलाएं"
      },
      triage: {
        result: "ट्राइएज परिणाम",
        ai: "Groq एआई",
        engine_desc: "एआई प्रारंभिक मूल्यांकन",
        local_engine: "लोकल इंजन",
        disclaimer: "निदान नहीं है। आपके वर्णन के आधार पर संभावित स्थितियां — आपका डॉक्टर इसकी पुष्टि करेगा।"
      },
      doctors: {
        title: "उपलब्ध विशेषज्ञ",
        none: "डेटाबेस में कोई मिलान विशेषज्ञ नहीं मिला।",
        register_desc: "कृपया इस विशेषज्ञता के साथ डॉक्टर पंजीकृत करें:",
        cta: "स्लॉट पर आगे बढ़ें"
      },
      slots: {
        type: "परामर्श का प्रकार",
        in_person: "व्यक्तिगत रूप से (ऑफलाइन)",
        virtual: "वर्चुअल (ऑनलाइन वीडियो)",
        date: "तारीख चुनें",
        time: "समय स्लॉट चुनें",
        cta: "₹{{fee}} भुगतान करें और पुष्टि करें"
      }
    },
    metrics: {
      specialists: "शीर्ष विशेषज्ञ",
      satisfaction: "मरीज की संतुष्टि",
      booking_time: "औसत बुकिंग समय",
      charges: "बुकिंग शुल्क"
    },
    common: {
      sign_out: "साइन आउट",
      language: "भाषा",
      hello: "नमस्ते"
    }
  }
};
