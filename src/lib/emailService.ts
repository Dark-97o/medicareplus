import emailjs from '@emailjs/browser';

// 1. Patient Booking Confirmation (Universal)
export const sendPatientBookingConfirmation = async (data: {
  to_email: string;
  to_name: string;
  service_type: string;
  provider_name: string;
  date: string;
  time: string;
  transaction_id: string;
  amount_paid: string;
}) => {
  return emailjs.send(
    'service_wgminnp', 
    'template_sbvt3ze', 
    data, 
    'nEbb9aPtYh8imCD0M'
  );
};

// 2. Provider Booking Alert (Universal)
export const sendProviderBookingAlert = async (data: {
  provider_email: string;
  provider_name: string;
  patient_name: string;
  service_type: string;
  date: string;
  time: string;
}) => {
  return emailjs.send(
    'service_wgminnp', 
    'template_smasli7', 
    data, 
    'nEbb9aPtYh8imCD0M'
  );
};

// 3. Patient Cancellation & Refund Notice
export const sendPatientCancellationNotice = async (data: {
  to_email: string;
  to_name: string;
  service_type: string;
  provider_name: string;
  date: string;
  refund_amount: string;
}) => {
  return emailjs.send(
    'service_2m6dz0e', 
    'template_6oggzg3', 
    data, 
    's5aMYZtxqGdrZT9vc'
  );
};

// 4. Provider Cancellation Alert
export const sendProviderCancellationAlert = async (data: {
  provider_email: string;
  provider_name: string;
  patient_name: string;
  service_type: string;
  date: string;
}) => {
  return emailjs.send(
    'service_2m6dz0e', 
    'template_91wi0ok', 
    data, 
    's5aMYZtxqGdrZT9vc'
  );
};

// 5. Admin Enquiry Alert
export const sendAdminEnquiryAlert = async (data: {
  admin_email: string;
  user_name: string;
  user_email: string;
  message: string;
}) => {
  return emailjs.send(
    'service_dqgwwy6', 
    'template_gcfzw6b', 
    data, 
    '3UJlMGm-hN6jMZVG5'
  );
};

// 6. Pre-Consultation Instructions
export const sendPreConsultationInstructions = async (data: {
  to_email: string;
  to_name: string;
  doctor_name: string;
  date: string;
  time: string;
  message: string;
}) => {
  return emailjs.send(
    'service_dqgwwy6', 
    'template_xvugtmq', 
    data, 
    '3UJlMGm-hN6jMZVG5'
  );
};

// 7. System Auto-Cancellation Notice
export const sendSystemAutoCancellationNotice = async (data: {
  to_email: string;
  to_name: string;
  provider_name: string;
  date: string;
  time: string;
}) => {
  return emailjs.send(
    'service_2m6dz0e', 
    '<NEW_TEMPLATE_ID_PLACEHOLDER>', 
    data, 
    's5aMYZtxqGdrZT9vc'
  );
};

// 8. Doctor No-Show Notice
export const sendDoctorNoShowNotice = async (data: {
  to_email: string;
  to_name: string;
  provider_name: string;
  date: string;
  time: string;
}) => {
  return emailjs.send(
    'service_2m6dz0e', 
    '<NEW_TEMPLATE_ID_PLACEHOLDER>', 
    data, 
    's5aMYZtxqGdrZT9vc'
  );
};

// 9. Patient Review Request (+12h Feedback)
export const sendPatientReviewRequest = async (data: {
  to_email: string;
  to_name: string;
  provider_name: string;
  date: string;
}) => {
  return emailjs.send(
    'service_2m6dz0e', 
    '<NEW_TEMPLATE_ID_PLACEHOLDER>', 
    data, 
    's5aMYZtxqGdrZT9vc'
  );
};
