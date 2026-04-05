import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { sendSystemAutoCancellationNotice, sendPatientReviewRequest } from './emailService';

let isSweeping = false;

export const runMaintenanceSweep = async () => {
  // Prevent parallel overlapping sweeps if called multiple times rapidly
  if (isSweeping) return;
  isSweeping = true;

  try {
    const q = query(
      collection(db, 'appointments'),
      where('status', 'in', ['upcoming', 'concluded'])
    );

    const snapshot = await getDocs(q);
    const now = new Date();

    for (const document of snapshot.docs) {
      const app = { id: document.id, ...document.data() } as any;
      
      // Parse scheduled time safely
      if (!app.date || !app.time) continue;
      const scheduledDate = new Date(`${app.date}T${app.time}`);
      const diffMs = now.getTime() - scheduledDate.getTime();

      // Rule A: +30 Mins Auto-Cancellation for Upcoming
      if (app.status === 'upcoming') {
        const thirtyMins = 30 * 60 * 1000;
        if (diffMs > thirtyMins) {
          console.log(`[SweepEngine] Auto-cancelling appointment ${app.id}`);
          
          await updateDoc(doc(db, 'appointments', app.id), {
            status: 'system_cancelled',
            updatedAt: now
          });

          // Attempt to send email, fail gracefully if keys missing
          try {
            await sendSystemAutoCancellationNotice({
              to_email: app.patientEmail || '',
              to_name: app.patientName || 'Patient',
              provider_name: app.doctorName || 'Doctor',
              date: app.date,
              time: app.time
            });
          } catch (e) {
            console.error('[SweepEngine] Failed to send cancel email:', e);
          }
        }
      }

      // Rule B: +12 Hours Review Request for Concluded
      if (app.status === 'concluded' && !app.reviewEmailed) {
        const twelveHours = 12 * 60 * 60 * 1000;
        if (diffMs > twelveHours) {
          console.log(`[SweepEngine] Requesting review for appointment ${app.id}`);
          
          await updateDoc(doc(db, 'appointments', app.id), {
            reviewEmailed: true,
            updatedAt: now
          });

          // Attempt to send email, fail gracefully
          try {
            await sendPatientReviewRequest({
              to_email: app.patientEmail || '',
              to_name: app.patientName || 'Patient',
              provider_name: app.doctorName || 'Doctor',
              date: app.date
            });
          } catch (e) {
            console.error('[SweepEngine] Failed to send review email:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('[SweepEngine] Sweep failed:', error);
  } finally {
    isSweeping = false;
  }
};
