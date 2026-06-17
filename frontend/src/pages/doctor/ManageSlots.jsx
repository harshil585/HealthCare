import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Plus, Calendar, Trash2, CheckCircle2, 
  Activity, Zap, ArrowLeft, RefreshCw, Save, Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  getDoctorSlots, 
  deleteSlot, 
  getDoctorAvailabilities, 
  saveDoctorAvailability, 
  generateDoctorSlots 
} from '../../services/api';
import FloatingMedicalBg from '../../components/patient/dashboard/FloatingMedicalBg';

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ text, muted }) => (
  <div className="mb-12 text-center">
    <p className="text-[13px] font-black uppercase tracking-[0.6em] mb-4" style={{ color: muted }}>
      {text}
    </p>
    <div className="w-12 h-1 bg-[#10b981] mx-auto rounded-full" />
  </div>
);

const ManageSlots = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { doctor, invalidate } = useData();
  const dark = theme === 'dark';

  const [slots, setSlots] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Form State for adding recurring availability
  const [newDay, setNewDay] = useState('MONDAY');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('17:00');
  const [newDuration, setNewDuration] = useState(30);

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  const fetchData = async () => {
    const doctorId = doctor?.doctorId || doctor?.id;
    if (!doctorId) return;
    try {
      setLoading(true);
      const slotsData = await getDoctorSlots(doctorId);
      const todayStr = new Date().toISOString().split('T')[0];
      // Sort slots chronologically and filter out past dates
      const sortedSlots = (slotsData || [])
        .filter(s => s.slotDate >= todayStr)
        .sort((a, b) => {
          const dateA = new Date(`${a.slotDate}T${a.startTime}`);
          const dateB = new Date(`${b.slotDate}T${b.startTime}`);
          return dateA - dateB;
        });
      setSlots(sortedSlots);

      const availsData = await getDoctorAvailabilities(doctorId);
      setAvailabilities(availsData || []);
    } catch (error) {
      console.error("Error loading doctor slots & templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctor) {
      fetchData();
    }
  }, [doctor]);

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    const doctorId = doctor?.doctorId || doctor?.id;
    if (!doctorId) return;

    try {
      // Append seconds if not present
      const formattedStart = newStart.length === 5 ? `${newStart}:00` : newStart;
      const formattedEnd = newEnd.length === 5 ? `${newEnd}:00` : newEnd;

      const payload = {
        dayOfWeek: newDay,
        startTime: formattedStart,
        endTime: formattedEnd,
        slotDurationMinutes: parseInt(newDuration, 10),
        isActive: true
      };

      await saveDoctorAvailability(doctorId, payload);
      // Auto seed slots for next 14 days immediately to reflect updates
      await generateDoctorSlots(doctorId, 14);
      await invalidate(); // Sync globally
      fetchData();
    } catch (error) {
      console.error("Failed to save recurring shift:", error);
    }
  };

  const handleTriggerGeneration = async () => {
    const doctorId = doctor?.doctorId || doctor?.id;
    if (!doctorId) return;
    try {
      setGenerating(true);
      await generateDoctorSlots(doctorId, 14);
      await invalidate(); // Sync globally
      await fetchData();
    } catch (error) {
      console.error("Failed to generate slots:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await deleteSlot(slotId);
      setSlots(slots.filter(s => s.slotId !== slotId));
      await invalidate(); // Sync globally
    } catch (error) {
      console.error("Failed to delete slot:", error);
    }
  };

  const muted = dark ? "#64748b" : "#6b7280";
  const bg = dark ? "#060b18" : "#f0fdf4";
  const textCol = dark ? "#f1f5f9" : "#064e3b";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(16,185,129,0.1)";
  const accent = "#10b981";

  if (doctor?.status !== 'APPROVED') {
    return (
      <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
        <FloatingMedicalBg />
        <main style={{ flex: 1, padding: "100px 40px", position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 48, padding: "80px", textAlign: "center", maxWidth: 650, boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 100, height: 100, borderRadius: 32, background: "rgba(245,158,11,0.08)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 36px" }}>
              <Clock size={48} />
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em' }}>Access Restricted</h2>
            <p style={{ fontSize: 18, color: muted, lineHeight: 1.6 }}>
              Your account verification is currently pending admin approval. You will be able to configure scheduling and generate consultation slots once your credentials have been verified.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Top Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: "rgba(6,11,24,0.05)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 40 }}>
          <div className="flex-1 relative max-w-md">
            <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 13 }}>Availability Engine</p>
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Availability Section */}
          <FadeUp delay={0}>
            <div style={{ marginBottom: 400, background: `linear-gradient(135deg, #064e3b 0%, ${accent} 50%, #059669 100%)`, borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>Time Management</p>
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                Define Your <br/> <span style={{ color: "#a7f3d0" }}>Schedule.</span>
              </h1>
              <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                Set your recurring weekly hours. The scheduling engine automatically maintains a constant 14-day rolling window of open booking slots for your patients.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={handleTriggerGeneration} 
                  disabled={generating}
                  style={{ padding: "20px 40px", background: "#fff", color: accent, borderRadius: 20, border: "none", fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 15, margin: '0 auto', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                >
                  <RefreshCw size={20} className={generating ? "animate-spin" : ""} />
                  {generating ? "Seeding Slots..." : "Force Roll 14-Day Slots"}
                </button>
              </div>
            </div>
          </FadeUp>

          {/* 2. Setup Panel Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, marginBottom: 400 }}>
            
            {/* Left: Recurring Schedule Form & List */}
            <FadeUp delay={0.2}>
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 40, padding: "40px", height: 'fit-content' }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 30, letterSpacing: '-0.03em' }}>Weekly Shift Template</h2>
                
                <form onSubmit={handleSaveAvailability} style={{ display: 'grid', gap: 20, marginBottom: 40 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Day of the Week</label>
                    <select 
                      value={newDay} 
                      onChange={(e) => setNewDay(e.target.value)}
                      style={{ width: "100%", height: 50, padding: "0 15px", background: dark ? "#111827" : "#f3f4f6", border: `1px solid ${border}`, borderRadius: 12, color: textCol, fontSize: 15, fontWeight: 700 }}
                    >
                      {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Shift Start</label>
                      <input 
                        type="time" 
                        value={newStart} 
                        onChange={(e) => setNewStart(e.target.value)}
                        style={{ width: "100%", height: 50, padding: "0 15px", background: dark ? "#111827" : "#f3f4f6", border: `1px solid ${border}`, borderRadius: 12, color: textCol, fontSize: 15, fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Shift End</label>
                      <input 
                        type="time" 
                        value={newEnd} 
                        onChange={(e) => setNewEnd(e.target.value)}
                        style={{ width: "100%", height: 50, padding: "0 15px", background: dark ? "#111827" : "#f3f4f6", border: `1px solid ${border}`, borderRadius: 12, color: textCol, fontSize: 15, fontWeight: 700 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Slot Duration (Minutes)</label>
                    <select 
                      value={newDuration} 
                      onChange={(e) => setNewDuration(e.target.value)}
                      style={{ width: "100%", height: 50, padding: "0 15px", background: dark ? "#111827" : "#f3f4f6", border: `1px solid ${border}`, borderRadius: 12, color: textCol, fontSize: 15, fontWeight: 700 }}
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                    </select>
                  </div>

                  <button type="submit" style={{ width: "100%", height: 52, background: accent, color: '#fff', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <Save size={18} /> Update Shift Hours
                  </button>
                </form>

                <div style={{ borderTop: `1px solid ${border}`, paddingTop: 30 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Active Weekly Templates</h3>
                  {availabilities.length > 0 ? (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {availabilities.map(av => (
                        <div key={av.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderRadius: 12, border: `1px solid ${border}` }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 900 }}>{av.dayOfWeek}</p>
                            <p style={{ fontSize: 12, color: muted }}>{av.startTime.substring(0,5)} - {av.endTime.substring(0,5)} ({av.slotDurationMinutes} min slots)</p>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(16,185,129,0.1)", color: accent, padding: '4px 8px', borderRadius: 6 }}>ACTIVE</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 14, color: muted, textAlign: 'center', padding: '20px 0' }}>No recurring availability configured yet.</p>
                  )}
                </div>
              </div>
            </FadeUp>

            {/* Right: Actual Rolling Slots list */}
            <FadeUp delay={0.3}>
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 40, padding: "40px", maxHeight: '800px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                  <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>Rolling Live Slots</h2>
                  <span style={{ fontSize: 12, fontWeight: 800, background: "rgba(16,185,129,0.1)", color: accent, padding: '6px 12px', borderRadius: 20 }}>{slots.length} Total Slots</span>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <RefreshCw size={40} className="animate-spin" style={{ margin: '0 auto 20px', color: accent }} />
                    <p style={{ color: muted }}>Retrieving clinical schedules...</p>
                  </div>
                ) : slots.length > 0 ? (
                  <div style={{ display: "grid", gap: 15 }}>
                    {slots.map((slot) => (
                      <div key={slot.slotId} style={{ background: dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)", border: `1px solid ${border}`, borderRadius: 20, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ width: 44, height: 44, background: slot.isBooked ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.05)", borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: slot.isBooked ? "#ef4444" : accent }}>
                          <Clock size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 900 }}>{slot.slotDate}</p>
                          <p style={{ fontSize: 12, color: muted }}>{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: slot.isBooked ? '#ef4444' : accent, background: slot.isBooked ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', padding: '5px 10px', borderRadius: 8 }}>
                            {slot.isBooked ? 'BOOKED' : 'OPEN'}
                          </span>
                          {!slot.isBooked && (
                            <button 
                              onClick={() => handleDeleteSlot(slot.slotId)} 
                              style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(239,68,68,0.05)", color: "#ef4444", border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: "100px 0" }}>
                    <Calendar size={60} color={muted} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                    <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>No Rolling Slots Seeded</h3>
                    <p style={{ color: muted, fontSize: 14, maxWidth: 300, margin: '0 auto' }}>Configure your weekly template on the left and click "Force Roll 14-Day Slots" to populate.</p>
                  </div>
                )}
              </div>
            </FadeUp>

          </div>

          <footer style={{ textAlign: "center", opacity: 0.4 }}>
            <p className="text-[13px] font-black tracking-[0.6em] uppercase">HealthCare+ v2.0 · Professional Clinical Environment</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ManageSlots;
