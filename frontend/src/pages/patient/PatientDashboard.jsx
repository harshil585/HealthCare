import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, Calendar, Clock, CheckCircle2, XCircle, 
  Activity, Search, Bell, Moon, Sun, Video, MapPin, 
  Star, Stethoscope, User, Settings, LayoutDashboard, 
  History, BarChart3, LogOut, Zap, ArrowUpRight, Plus, 
  Pill, FileText, Thermometer, Bot, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import FloatingMedicalBg from '../../components/patient/dashboard/FloatingMedicalBg';
import AIChatbotWidget from '../../components/patient/dashboard/AIChatbotWidget';

import { useNavigate } from 'react-router-dom';
import FullCalendarWidget from '../../components/patient/dashboard/FullCalendarWidget';

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
    <div className="w-12 h-1 bg-[#2563eb] mx-auto rounded-full" />
  </div>
);

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use centralized DataContext instead of local fetches
  const { patient, appointments, doctors, patientStats, loading } = useData();

  // Map appointments for display
  const mappedAppts = (appointments || []).map(a => ({
    id: a.appointmentId || a.id,
    doctorName: a.doctor?.user?.name || "Dr. Unassigned",
    specialization: a.doctor?.specialization?.name || "General",
    hospital: a.doctor?.hospital?.name || "Main Clinic",
    date: a.slot?.slotDate || "TBD",
    startTime: a.slot?.startTime || "TBD",
    status: a.status,
    avatar: a.doctor?.user?.name ? a.doctor.user.name.substring(0, 2).toUpperCase() : "DR",
    doctorId: a.doctor?.id
  }));

  // Map doctors for display
  const mappedDoctors = (doctors || []).map(d => ({
    id: d.id || d.doctorId, 
    name: d.user?.name, 
    spec: d.specialization?.name, 
    hospital: d.hospital?.name, 
    rating: d.averageRating ? d.averageRating.toFixed(1) : "4.8", 
    avatar: d.profilePicture || '',
    initials: d.user?.name?.substring(0, 2).toUpperCase() || "DR"
  })).filter(d => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (d.name || '').toLowerCase().includes(q) || (d.spec || '').toLowerCase().includes(q) || (d.hospital || '').toLowerCase().includes(q);
  });

  const upcomingAppointment = mappedAppts.find(a => a.status === 'BOOKED');

  // Build real timeline from actual appointments
  const realTimeline = mappedAppts.slice(0, 5).map(a => ({
    label: a.status === 'BOOKED' ? `Upcoming: ${a.doctorName}` :
           a.status === 'COMPLETED' ? `Visit with ${a.doctorName}` :
           a.status === 'NO_SHOW' ? `Missed: ${a.doctorName}` :
           `Cancelled: ${a.doctorName}`,
    sub: `${a.specialization} · ${a.hospital}`,
    time: a.date,
  }));

  const d = dark;
  const bg = d ? "#060b18" : "#f0f5ff";
  const surface = d ? "#0d1526" : "#ffffff";
  const border = d ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.1)";
  const text = d ? "#f1f5f9" : "#0f172a";
  const muted = d ? "#64748b" : "#94a3b8";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text, position: 'relative' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .section-gap { margin-bottom: 400px; }
      `}</style>

      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Top Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: d ? "rgba(6,11,24,0.05)" : "rgba(240,245,255,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 40 }}>
          <div className="flex-1 relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search doctors, appointments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", height: 52, paddingLeft: 56, background: surface, border: `1px solid ${border}`, borderRadius: 16, color: text, fontSize: '15px', outline: 'none' }} />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 24 }}>
             <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 16, fontWeight: 800 }}>{patient?.name || user?.name || "Patient"}</p>
                  <p style={{ fontSize: 11, color: "#22c55e", fontWeight: 900, letterSpacing: "0.12em" }}>ACTIVE PROFILE</p>
                </div>
                <div style={{ width: 50, height: 50, borderRadius: 16, overflow: 'hidden', background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: '16px' }}>
                  {patient?.profilePicture ? (
                    <img src={patient.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (patient?.name || user?.name || "PA").substring(0, 2).toUpperCase()
                  )}
                </div>
             </div>
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Branding Section */}
          <FadeUp delay={0}>
            <div className="section-gap" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)", borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                Your Health, <br/> <span style={{ color: "#7dd3fc" }}>Our Priority.</span>
              </h1>
              <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                Managing your health journey with precision and compassion. Everything you need, all in one place.
              </p>
              <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                <button 
                  onClick={() => navigate('/patient/book')}
                  style={{ padding: "18px 36px", background: "#fff", color: "#2563eb", borderRadius: 18, fontWeight: 800, fontSize: 15, border: "none", cursor: 'pointer' }}
                >
                  Book Appointment
                </button>
                <button 
                  onClick={() => navigate('/patient/appointments')}
                  style={{ padding: "18px 36px", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 18, fontWeight: 800, fontSize: 15, border: "1px solid rgba(255,255,255,0.2)", cursor: 'pointer' }}
                >
                  View History
                </button>
              </div>
            </div>
          </FadeUp>

          {/* 2. Next Action Section */}
          <FadeUp delay={0.2}>
            <div className="section-gap">
              <SectionTitle text="Current Focus" muted={muted} />
              {upcomingAppointment ? (
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 36, padding: "48px", display: "flex", alignItems: "center", gap: 40 }}>
                  <div style={{ width: 90, height: 90, background: "#2563eb", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 900 }}>{upcomingAppointment.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{upcomingAppointment.doctorName}</h3>
                    <p style={{ color: muted, fontSize: 17, marginBottom: 20 }}>{upcomingAppointment.specialization} · {upcomingAppointment.hospital}</p>
                    <div style={{ display: "flex", gap: 20 }}>
                      <span style={{ padding: "10px 20px", background: "rgba(37,99,235,0.1)", color: "#2563eb", borderRadius: 12, fontSize: 14, fontWeight: 700 }}>{upcomingAppointment.date}</span>
                      <span style={{ padding: "10px 20px", background: "rgba(37,99,235,0.1)", color: "#2563eb", borderRadius: 12, fontSize: 14, fontWeight: 700 }}>{upcomingAppointment.startTime}</span>
                    </div>
                  </div>
                  <button style={{ padding: "20px 40px", background: "#2563eb", color: "#fff", borderRadius: 20, border: "none", fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>Join Video</button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "80px", background: surface, border: `1px dashed ${border}`, borderRadius: 40 }}>
                  <Calendar size={64} color={muted} style={{ margin: "0 auto 24px" }} />
                  <p style={{ color: muted, fontWeight: 600, fontSize: '18px' }}>No upcoming appointments scheduled.</p>
                  <button 
                    onClick={() => navigate('/patient/book')}
                    style={{ marginTop: 24, padding: "12px 24px", background: "#2563eb", color: "#fff", borderRadius: 12, border: "none", fontWeight: 700, cursor: 'pointer' }}
                  >
                    Schedule One Now
                  </button>
                </div>
              )}
            </div>
          </FadeUp>

          {/* 3. Vital Statistics Section */}
          <FadeUp delay={0.4}>
            <div className="section-gap">
              <SectionTitle text="Vital Statistics" muted={muted} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                {[
                  { label: "Total Visits", val: patientStats.total, icon: Activity, color: "#2563eb" },
                  { label: "Upcoming", val: patientStats.upcoming, icon: Calendar, color: "#0891b2" },
                  { label: "Completed", val: patientStats.completed, icon: CheckCircle2, color: "#22c55e" },
                  { label: "Cancelled", val: patientStats.cancelled, icon: XCircle, color: "#ef4444" }
                ].map((s, i) => (
                  <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "40px 30px", textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}10`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <s.icon size={24} />
                    </div>
                    <p style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.05em", marginBottom: 8 }}>{s.val}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: muted, uppercase: true }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Calendar Timetable Section */}
          <FadeUp delay={0.5}>
            <div className="section-gap">
              <SectionTitle text="My Health Calendar" muted={muted} />
              <FullCalendarWidget appointments={appointments} />
            </div>
          </FadeUp>

          {/* 4. Recent Activity Section — Real data */}
          <FadeUp delay={0.6}>
            <div className="section-gap">
              <SectionTitle text="Health Timeline" muted={muted} />
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 36, overflow: "hidden" }}>
                {realTimeline.length > 0 ? realTimeline.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "30px 40px", borderBottom: i < realTimeline.length - 1 ? `1px solid ${border}` : "none" }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(37,99,235,0.05)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 24 }}>
                      <Activity size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '18px' }}>{item.label}</p>
                      <p style={{ fontSize: 14, color: muted }}>{item.sub}</p>
                    </div>
                    <span style={{ fontSize: 14, color: muted }}>{item.time}</span>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '60px', color: muted }}>
                    <Activity size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>No activity yet. Book your first appointment!</p>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>

          {/* 5. Recommended Doctors Section — Real data */}
          <FadeUp delay={0.8}>
            <div className="section-gap">
              <SectionTitle text="Top Specialists" muted={muted} />
              <div style={{ display: "grid", gap: 20 }}>
                {mappedDoctors.length > 0 ? mappedDoctors.slice(0, 3).map((doc, i) => (
                  <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "30px 40px", display: "flex", alignItems: "center", gap: 24 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, overflow: 'hidden', display: "flex", alignItems: "center", justifyContent: "center", background: "#2563eb", color: "#fff", fontWeight: 800, fontSize: '20px', flexShrink: 0 }}>
                      {doc.avatar ? (
                        <img src={doc.avatar} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        doc.initials
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 800, fontSize: 20 }}>{doc.name}</h4>
                      <p style={{ fontSize: 15, color: muted }}>{doc.spec} · {doc.hospital}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                       <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <Star size={16} color="#f59e0b" fill="#f59e0b" />
                          <span style={{ fontWeight: 800, fontSize: 16 }}>{doc.rating}</span>
                       </div>
                       <button 
                        onClick={() => navigate(`/patient/book/${doc.id}`)}
                        style={{ padding: "10px 24px", background: "rgba(37,99,235,0.1)", color: "#2563eb", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                       >
                         Book Slot
                       </button>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '60px', background: surface, borderRadius: 32, border: `1px dashed ${border}`, color: muted }}>
                    <Stethoscope size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>No doctors registered yet.</p>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>

          <footer style={{ textAlign: "center", opacity: 0.4 }}>
            <p className="text-[13px] font-black tracking-[0.6em] uppercase">HealthCare+ v2.0 · Refined care for everyone</p>
          </footer>
        </div>
      </main>

      {/* Floating AI Widget */}
      <AIChatbotWidget />
    </div>
  );
};

export default PatientDashboard;
