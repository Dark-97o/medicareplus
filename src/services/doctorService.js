import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const registerDoctor = async (doctor) => {

 await addDoc(collection(db,"doctors"),doctor);

};

export const getDoctors = async () => {

 const snapshot = await getDocs(collection(db,"doctors"));

 return snapshot.docs.map(doc => ({
   id: doc.id,
   ...doc.data()
 }));

};