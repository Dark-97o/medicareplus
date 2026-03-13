import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const registerPatient = async (patient) => {

 await addDoc(collection(db,"patients"),patient);

};