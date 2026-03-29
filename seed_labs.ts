import { db } from './src/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const seed = async () => {
  try {
    // Add Lab Specialist
    const labDoc = await addDoc(collection(db, 'lab_doctors'), {
      name: "Dr. Alok Verma",
      labName: "Verma Diagnostics",
      hospital: "Apollo Jaipur",
      email: "alok@verma.com",
      status: "approved",
      createdAt: new Date().toISOString()
    });

    const labId = labDoc.id;

    // Add Tests
    const tests = [
      {
        name: "Full Body Health Checkup",
        category: "General",
        charges: 2999,
        labId: labId,
        labName: "Verma Diagnostics",
        hospitalName: "Apollo Jaipur",
        imageUrl: "https://images.unsplash.com/photo-1579152276503-60506663f721?w=800&auto=format&fit=crop"
      },
      {
        name: "Diabetes Panel (HbA1c)",
        category: "Pathology",
        charges: 850,
        labId: labId,
        labName: "Verma Diagnostics",
        hospitalName: "Apollo Jaipur",
        imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop"
      },
      {
        name: "MRI Brain Scan",
        category: "Radiology",
        charges: 6500,
        labId: labId,
        labName: "Verma Diagnostics",
        hospitalName: "Apollo Jaipur",
        imageUrl: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=800&auto=format&fit=crop"
      }
    ];

    for (const test of tests) {
      await addDoc(collection(db, 'lab_tests'), test);
    }

    console.log("Seeding successful!");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
};

seed();
