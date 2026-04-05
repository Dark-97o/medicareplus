import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const seedTherapists = async () => {
  const therapists = [
    {
      name: "Dr. Sameer Wankhede",
      email: "therapist1@medicareplus.com",
      speciality: "Therapist",
      hospital: "City Mental Wellness",
      fees: 1200,
      status: "approved",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",
      availability: {
        Monday: ["09:00 AM", "11:00 AM", "02:00 PM"],
        Wednesday: ["10:00 AM", "12:00 PM", "04:00 PM"],
        Friday: ["09:00 AM", "01:00 PM", "05:00 PM"]
      },
      experience: "12 Years",
      rating: 4.9,
      role: "Doctor",
      createdAt: new Date().toISOString()
    },
    {
      name: "Dr. Rashi Khanna",
      email: "therapist2@medicareplus.com",
      speciality: "Therapist",
      hospital: "Global Mind Clinic",
      fees: 1500,
      status: "approved",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800",
      availability: {
        Tuesday: ["10:00 AM", "01:00 PM", "03:00 PM"],
        Thursday: ["09:00 AM", "11:00 AM", "02:00 PM"],
        Saturday: ["10:00 AM", "12:00 PM"]
      },
      experience: "8 Years",
      rating: 4.8,
      role: "Doctor",
      createdAt: new Date().toISOString()
    }
  ];

  try {
    for (const t of therapists) {
      const docRef = await addDoc(collection(db, 'doctors'), t);
      console.log("Therapist added with ID:", docRef.id);
    }
    console.log("Seeding complete!");
  } catch (e) {
    console.error("Error seeding therapists:", e);
  }
};

seedTherapists();
