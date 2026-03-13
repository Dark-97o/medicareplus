import { useState } from "react";
import { registerPatient } from "../services/patientService";

function RegisterPatient(){

const [name,setName]=useState("");
const [symptoms,setSymptoms]=useState("");

const handleSubmit=async()=>{

 await registerPatient({
   name,
   symptoms
 });

 alert("Patient Registered");

};

return(

<div className="container">

<h2>Register Patient</h2>

<input
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Symptoms"
onChange={(e)=>setSymptoms(e.target.value)}
/>

<button onClick={handleSubmit}>
Register
</button>

</div>

);

}

export default RegisterPatient;