import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const doctors = [
{
name: "Dr. Rahul Sharma",
specialization: "Cardiology",
slotDuration: 15,
startTime: "10:00",
endTime: "16:00",
availableDays: ["Mon","Tue","Wed","Thu"]
},
{
name: "Dr. Priya Mehta",
specialization: "Dermatology",
slotDuration: 20,
startTime: "09:00",
endTime: "14:00",
availableDays: ["Mon","Wed","Fri"]
},
{
name: "Dr. Anil Gupta",
specialization: "General Medicine",
slotDuration: 10,
startTime: "08:30",
endTime: "13:30",
availableDays: ["Mon","Tue","Wed","Thu","Fri"]
},
{
name: "Dr. Kavita Singh",
specialization: "Orthopedics",
slotDuration: 20,
startTime: "11:00",
endTime: "17:00",
availableDays: ["Tue","Thu","Sat"]
},
{
name: "Dr. Rohit Verma",
specialization: "Neurology",
slotDuration: 30,
startTime: "10:30",
endTime: "15:30",
availableDays: ["Mon","Wed","Fri"]
}
];

export const seedDoctors = async () => {

for (let doctor of doctors) {

await addDoc(collection(db, "doctors"), doctor);

}

console.log("Doctors added successfully");

};