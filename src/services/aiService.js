export const suggestSpecialization = (symptom)=>{

 const map = {

   "chest pain":"Cardiology",
   "skin rash":"Dermatology",
   "bone pain":"Orthopedics",
   "headache":"Neurology",
   "fever":"General Medicine"

 };

 return map[symptom.toLowerCase()] || "General Medicine";

};