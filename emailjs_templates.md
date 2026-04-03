# EmailJS Templates Blueprint

Here is the complete blueprint for the **6 EmailJS Templates** you will need to create in your EmailJS dashboard. 

When you create these, just make sure to include the exact variable names (e.g., `{{variable_name}}`) in the template design.

---

### 1. Patient Booking Confirmation (Universal)
*Sent to the Patient when they book either a Doctor Appointment or a Lab Test.*
* **To Email Field:** `{{to_email}}`
* **Suggested Subject:** `Your Booking is Confirmed: {{service_type}}`
* **Message Body Variables needed:**
  * `{{to_name}}` (Patient's name)
  * `{{service_type}}` (e.g., "Doctor Appointment" or "Lab Test")
  * `{{provider_name}}` (e.g., "Dr. Smith" or "City Labs")
  * `{{date}}` (Date of booking)
  * `{{time}}` (Time of booking)

---

### 2. Provider Booking Alert (Universal)
*Sent to the Doctor or the Lab to notify them of a new booking.*
* **To Email Field:** `{{provider_email}}`
* **Suggested Subject:** `New Booking Alert: {{service_type}} with {{patient_name}}`
* **Message Body Variables needed:**
  * `{{provider_name}}` (Doctor's or Lab's name)
  * `{{patient_name}}` 
  * `{{service_type}}`
  * `{{date}}`
  * `{{time}}`

---

### 3. Patient Cancellation & Refund Notice
*Sent to the Patient if a Doctor or Lab cancels their booking.*
* **To Email Field:** `{{to_email}}`
* **Suggested Subject:** `Cancellation Notice: Your {{service_type}} with {{provider_name}}`
* **Message Body Variables needed:**
  * `{{to_name}}`
  * `{{service_type}}`
  * `{{provider_name}}`
  * `{{date}}`
  * `{{refund_amount}}` (e.g., "₹500" or "80%")

---

### 4. Provider Cancellation Alert
*Sent to the Doctor or Lab if the Patient cancels the booked service.*
* **To Email Field:** `{{provider_email}}`
* **Suggested Subject:** `Cancelled: {{service_type}} on {{date}}`
* **Message Body Variables needed:**
  * `{{provider_name}}`
  * `{{patient_name}}`
  * `{{service_type}}`
  * `{{date}}`

---

### 5. Admin Enquiry Alert
*Sent to the Admin when someone submits a quick enquiry on the website.*
* **To Email Field:** `{{admin_email}}` (You can hardcode your admin email here)
* **Suggested Subject:** `New User Enquiry from {{user_name}}`
* **Message Body Variables needed:**
  * `{{user_name}}` 
  * `{{user_email}}` 
  * `{{message}}`

---

### 6. Pre-Consultation Instructions (Already Used)
*Sent manually by the Doctor from their dashboard to the Patient.*
* **To Email Field:** `{{to_email}}`
* **Suggested Subject:** `Important Instructions from Dr. {{doctor_name}}`
* **Message Body Variables needed:**
  * `{{to_name}}`
  * `{{doctor_name}}`
  * `{{date}}`
  * `{{time}}`
  * `{{message}}` (The custom instructions from the doctor)

---

### Next Steps 🚀
Once you have created these in your EmailJS dashboard, you will have **6 new Template IDs** (they usually look like `template_xxxxxx`). 

Whenever you are ready, just drop those 6 IDs into your application code to activate them!
