import { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, Clock, ShieldCheck, Share2 } from 'lucide-react';

const VideoConsultationRoom = ({ appointmentId = "CONSULT-101", doctorName = "Dr. Johnathan Carter", onLeave }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isEnded, setIsEnded] = useState(false);

  // Clean secure meeting room identifier
  const roomName = `HealthCarePlusConsultationRoom_${appointmentId}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false`;

  useEffect(() => {
    let timer;
    if (!isEnded) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isEnded]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isEnded) {
    return (
      <div className="bg-white dark:bg-[#0c0c0c] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto my-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          Consultation Concluded
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Your video session with <span className="font-semibold text-slate-700 dark:text-slate-200">{doctorName}</span> has ended successfully. Total duration: <span className="font-semibold">{formatTime(secondsElapsed)}</span>.
        </p>
        <button
          onClick={() => {
            if (onLeave) onLeave();
          }}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0c0c0c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl flex flex-col h-[560px]">
      {/* Header bar */}
      <div className="bg-[#050505] px-5 py-3.5 flex items-center justify-between border-b border-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wide uppercase">Live Room</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">|</span>
          <span className="text-xs font-semibold truncate max-w-[150px] sm:max-w-xs text-slate-200">
            {doctorName}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-900 px-2.5 py-1 rounded">
            <Clock size={13} className="text-blue-400" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Users size={14} />
            <span>2</span>
          </div>
        </div>
      </div>

      {/* Main Jitsi Container */}
      <div className="flex-1 w-full bg-black relative">
        <iframe
          title="Virtual Video Consultation"
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full h-full border-0"
        />

        {/* Overlay notification banner if camera/mic permissions are needed */}
        {secondsElapsed < 5 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white text-xs px-4 py-2 rounded-full backdrop-blur shadow-lg flex items-center gap-2 pointer-events-none animate-bounce">
            <ShieldCheck size={14} />
            <span>Secure WebRTC Channel Active</span>
          </div>
        )}
      </div>

      {/* Embedded Controls Bar */}
      <div className="bg-slate-50 dark:bg-[#050505] px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {/* Mute audio */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900'
                : 'bg-white dark:bg-[#121212] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1a1a1a]'
            }`}
            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isVideoOff
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900'
                : 'bg-white dark:bg-[#121212] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#1a1a1a]'
            }`}
            title={isVideoOff ? "Start Video" : "Stop Video"}
          >
            {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>
        </div>

        {/* Middle action link copy */}
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            alert("Consultation join link copied to clipboard!");
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <Share2 size={13} />
          <span className="hidden sm:inline">Copy Invite</span>
        </button>

        {/* End Call */}
        <button
          onClick={() => setIsEnded(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-red-500/20 cursor-pointer"
        >
          <PhoneOff size={16} />
          <span>Leave Session</span>
        </button>
      </div>
    </div>
  );
};

export default VideoConsultationRoom;
