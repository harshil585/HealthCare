import { Activity, HeartPulse, ShieldPlus, Dna, Syringe, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

const DynamicBackground = () => {
  // Generate random shapes with glowing neon colors
  const shapes = [
    { Icon: Activity, color: 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]' },
    { Icon: HeartPulse, color: 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]' },
    { Icon: ShieldPlus, color: 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]' },
    { Icon: Dna, color: 'text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]' },
    { Icon: Syringe, color: 'text-fuchsia-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.8)]' },
    { Icon: Stethoscope, color: 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]' },
  ];

  // Create floating elements
  const items = Array.from({ length: 36 }).map((_, i) => {
    const shape = shapes[i % shapes.length];
    const size = Math.random() * 50 + 30; // 30 to 80px
    const initialX = Math.random() * 100; // 0 to 100vw
    const initialY = Math.random() * 100; // 0 to 100vh
    const duration = Math.random() * 25 + 25; // 25s to 50s duration
    
    return {
      id: i,
      Icon: shape.Icon,
      color: shape.color,
      size,
      initialX,
      initialY,
      duration,
      delay: Math.random() * -30 // random start time in the animation
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep, glowing background blobs for organic feel */}
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[120px]"
        animate={{ 
          x: [0, 100, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-900/10 blur-[150px]"
        animate={{ 
          x: [0, -100, 0], 
          y: [0, -80, 0],
          scale: [1, 1.3, 1] 
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-[30%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-cyan-900/10 blur-[100px]"
        animate={{ 
          x: [0, -50, 0], 
          y: [0, 60, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating neon healthcare icons */}
      {items.map((item) => (
        <motion.div
          key={item.id}
          className={`absolute opacity-15 ${item.color}`}
          initial={{
            x: `${item.initialX}vw`,
            y: `${item.initialY}vh`,
            rotate: 0,
          }}
          animate={{
            y: [`${item.initialY}vh`, `${item.initialY - 30}vh`, `${item.initialY}vh`],
            x: [`${item.initialX}vw`, `${item.initialX + 15}vw`, `${item.initialX}vw`],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay
          }}
        >
          <item.Icon size={item.size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};

export default DynamicBackground;
