import { 
  Heart, Pill, Activity, Stethoscope, Plus, 
  Thermometer, Brain, HeartPulse, Dna, Bone 
} from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingMedicalBg = () => {
  // A large collection of floating medical icons scattered beautifully across the screen
  const icons = [
    // Left-aligned items
    { Icon: Heart, size: 32, color: 'text-rose-500/10', top: '8%', left: '4%', delay: 0, duration: 6 },
    { Icon: Stethoscope, size: 36, color: 'text-indigo-500/10', top: '18%', left: '12%', delay: 1.5, duration: 7 },
    { Icon: Pill, size: 28, color: 'text-blue-500/10', top: '30%', left: '6%', delay: 3, duration: 5.5 },
    { Icon: Dna, size: 38, color: 'text-cyan-500/10', top: '42%', left: '15%', delay: 0.8, duration: 8 },
    { Icon: Activity, size: 36, color: 'text-emerald-500/10', top: '55%', left: '8%', delay: 2, duration: 6.5 },
    { Icon: Brain, size: 34, color: 'text-purple-500/10', top: '68%', left: '14%', delay: 4, duration: 7.5 },
    { Icon: HeartPulse, size: 32, color: 'text-rose-400/10', top: '78%', left: '5%', delay: 1.2, duration: 6.8 },
    { Icon: Bone, size: 30, color: 'text-slate-400/10', top: '88%', left: '11%', delay: 3.5, duration: 7.2 },

    // Middle-left items
    { Icon: Plus, size: 24, color: 'text-cyan-500/10', top: '12%', left: '25%', delay: 2.2, duration: 5.8 },
    { Icon: Thermometer, size: 26, color: 'text-amber-500/10', top: '28%', left: '22%', delay: 0.5, duration: 6.2 },
    { Icon: Pill, size: 32, color: 'text-blue-400/10', top: '48%', left: '28%', delay: 4.5, duration: 7 },
    { Icon: Heart, size: 24, color: 'text-rose-400/10', top: '65%', left: '20%', delay: 1, duration: 5.2 },
    { Icon: Stethoscope, size: 28, color: 'text-indigo-400/10', top: '82%', left: '24%', delay: 2.8, duration: 6.6 },

    // Middle-right items
    { Icon: Brain, size: 32, color: 'text-purple-400/10', top: '15%', right: '28%', delay: 1.8, duration: 7.4 },
    { Icon: Dna, size: 30, color: 'text-cyan-400/10', top: '32%', right: '22%', delay: 3.2, duration: 8.2 },
    { Icon: Plus, size: 30, color: 'text-cyan-400/10', top: '50%', right: '26%', delay: 0.2, duration: 5.4 },
    { Icon: HeartPulse, size: 34, color: 'text-rose-500/10', top: '72%', right: '20%', delay: 2.5, duration: 6.9 },
    { Icon: Thermometer, size: 28, color: 'text-amber-400/10', top: '85%', right: '27%', delay: 4.2, duration: 6.3 },

    // Right-aligned items
    { Icon: Plus, size: 36, color: 'text-cyan-400/10', top: '5%', right: '12%', delay: 0.7, duration: 6.1 },
    { Icon: Pill, size: 28, color: 'text-blue-500/10', top: '22%', right: '4%', delay: 3.8, duration: 5.7 },
    { Icon: Heart, size: 30, color: 'text-rose-500/10', top: '35%', right: '14%', delay: 1.1, duration: 6.4 },
    { Icon: Bone, size: 32, color: 'text-slate-400/10', top: '45%', right: '6%', delay: 2.3, duration: 7.8 },
    { Icon: Activity, size: 38, color: 'text-emerald-500/10', top: '58%', right: '15%', delay: 4.8, duration: 6.7 },
    { Icon: Stethoscope, size: 40, color: 'text-indigo-500/10', top: '70%', right: '8%', delay: 1.6, duration: 7.3 },
    { Icon: Brain, size: 30, color: 'text-purple-500/10', top: '82%', right: '13%', delay: 3.1, duration: 8.1 },
    { Icon: HeartPulse, size: 28, color: 'text-rose-400/10', top: '92%', right: '5%', delay: 0.4, duration: 5.9 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Soft Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/5 blur-[120px] rounded-full" />

      {/* Floating Medical Icons */}
      {icons.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: [0, -50, -100, -150],
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            right: item.right,
          }}
          className={item.color}
        >
          <item.Icon size={item.size} strokeWidth={1.2} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingMedicalBg;
