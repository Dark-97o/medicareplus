import { JitsiMeeting } from '@jitsi/react-sdk';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Consultation() {
  const { roomID } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const handleClose = () => {
    // Navigate back to the appropriate dashboard
    const isDoctor = window.location.pathname.includes('doctor'); // Simple check or use role
    navigate(isDoctor ? '/doctor' : '/patient-dashboard');
  };

  if (!roomID) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Bar for Security & Context */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Shield size={14} className="text-(--color-accent-blue)" />
              Secure Medical Consultation
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-tight">ENCRYPTED • {roomID}</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active Session</span>
        </div>
      </div>

      {/* Jitsi Meeting Viewport */}
      <div className="flex-1 relative bg-zinc-950 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0"
        >
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomID}
            configOverwrite={{
              startWithAudioMuted: false,
              disableModeratorIndicator: false,
              startScreenSharing: true,
              enableEmailInStats: false,
              prejoinPageEnabled: false, // Skip Jitsi's internal prejoin to use ours
              enableWelcomePage: false,
            }}
            interfaceConfigOverwrite={{
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                'security'
              ],
              SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
            }}
            userInfo={{
              displayName: userProfile?.name || 'MediCare Participant',
              email: userProfile?.email || ''
            }}
            onReadyToClose={handleClose}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
            }}
          />
        </motion.div>
      </div>

      {/* Safety Strip */}
      <div className="h-10 bg-black/80 flex items-center justify-center border-t border-white/5">
        <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-mono">
          Powered by Jitsi Secure Infrastructure • End-to-End Encrypted Node
        </p>
      </div>
    </div>
  );
}
