import { useState } from "react";
import { registerDoctor } from "../services/doctorService";

function RegisterDoctor(){

const [name,setName]=useState("");
const [specialization,setSpecialization]=useState("");

const handleSubmit=async()=>{

 await registerDoctor({
   name,
   specialization,
   slotDuration:15,
   startTime:"10:00",
   endTime:"16:00"
 });

 alert("Doctor Registered");

};

return(

<div className="container">

<h2>Register Doctor</h2>

<input
placeholder="Doctor Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Specialization"
onChange={(e)=>setSpecialization(e.target.value)}
/>

<button onClick={handleSubmit}>
Register
</button>

</div>

);

}

export default RegisterDoctor;