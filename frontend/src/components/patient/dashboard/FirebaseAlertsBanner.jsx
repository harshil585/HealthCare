import { useState, useEffect } from 'react';
import { Bell, Flame, RefreshCw, X } from 'lucide-react';

const mockAlerts = [
  "🔥 Firebase Cloud Messaging Active: System state listeners fully engaged.",
  "✨ Dr. Carter is available for early virtual consultation check-ins.",
  "🚀 Payment gateway route signature successfully synchronized.",
  "⚡ Reminder: Ensure high-speed internet connection for upcoming Jitsi streams."
];

const FirebaseAlertsBanner = () => {
  const [alertIndex, setAlertIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setAlertIndex((prev) => (prev + 1) % mockAlerts.length);
        setIsUpdating(false);
      }, 300);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-amber-500/5 dark:via-orange-500/5 dark:to-transparent border border-amber-500/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>
          <Flame size={14} />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded flex-shrink-0">
            Realtime Push
          </span>
          <p className={`text-xs font-medium text-slate-800 dark:text-slate-200 truncate transition-opacity duration-300 ${isUpdating ? 'opacity-0' : 'opacity-100'}`}>
            {mockAlerts[alertIndex]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => {
            setIsUpdating(true);
            setTimeout(() => {
              setAlertIndex((prev) => (prev + 1) % mockAlerts.length);
              setIsUpdating(false);
            }, 200);
          }}
          className="p-1 rounded hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-colors"
          title="Force poll Firebase listener"
        >
          <RefreshCw size={12} className={isUpdating ? 'animate-spin' : ''} />
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded hover:bg-amber-500/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default FirebaseAlertsBanner;
