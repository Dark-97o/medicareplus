import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const bookAppointment = async (doctorId, patientId, time) => {

 const q = query(
   collection(db,"appointments"),
   where("doctorId","==",doctorId),
   where("time","==",time)
 );

 const snapshot = await getDocs(q);

 if(!snapshot.empty){
   alert("Slot already booked");
   return;
 }

 await addDoc(collection(db,"appointments"),{
   doctorId,
   patientId,
   time,
   status:"scheduled"
 });

};