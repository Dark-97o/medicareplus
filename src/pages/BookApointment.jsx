import { useEffect, useState } from "react";
import { getDoctors } from "../services/doctorService";
import { generateSlots } from "../utils/slotGenerator";
import { bookAppointment } from "../services/appointmentService";

function BookAppointment(){

const [doctors,setDoctors]=useState([]);

useEffect(()=>{

 const loadDoctors=async()=>{

 const data=await getDoctors();
 setDoctors(data);

 };

 loadDoctors();

},[]);

return(

<div className="container">

<h2>Book Appointment</h2>

{doctors.map(doc=>{

 const slots = generateSlots(
   doc.startTime,
   doc.endTime,
   doc.slotDuration
 );

 return(

 <div key={doc.id}>

 <h4>{doc.name}</h4>

 {slots.map(slot=>(
   <button
   key={slot}
   onClick={()=>bookAppointment(doc.id,"patient1",slot)}
   >
   {slot}
   </button>
 ))}

 </div>

 );

})}

</div>

);

}

export default BookAppointment;