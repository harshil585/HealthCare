import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Stethoscope, Building2, CalendarCheck, Activity,
  TrendingUp, Shield, BarChart3, AlertCircle, ArrowUpRight,
  Search, Bell, Settings, ChevronRight, CheckCircle2, XCircle,
  Clock, Bot, Plus, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
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
    <div className="w-12 h-1 bg-[#8b5cf6] mx-auto rounded-full" />
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { adminStats, doctors, specializations, allAppointments, invalidate } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const dark = theme === 'dark';

  const stats = [
    { label: "Total Patients", val: adminStats.totalPatients, icon: Users, color: "#3b82f6" },
    { label: "Registered Doctors", val: adminStats.totalDoctors, icon: Stethoscope, color: "#8b5cf6" },
    { label: "Medical Facilities", val: adminStats.hospitals, icon: Building2, color: "#ec4899" },
    { label: "Total Appointments", val: adminStats.appointments, icon: CalendarCheck, color: "#10b981" },
  ];

  const pendingDoctors = (doctors || []).filter(d => d.status === 'PENDING').filter(d => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (d.user?.name || '').toLowerCase().includes(q) || 
           (d.specialization?.name || '').toLowerCase().includes(q) || 
           (d.hospital?.name || '').toLowerCase().includes(q);
  });

  // Recent activity derived from real data
  const recentActivity = [
    ...(allAppointments || []).slice(0, 3).map(a => ({
      title: `Appointment ${a.status}`,
      description: `${a.patient?.user?.name || 'Patient'} with Dr. ${a.doctor?.user?.name || 'Doctor'}`,
      time: a.slot?.slotDate || 'Recent',
      type: 'appointment'
    })),
    ...(doctors || []).filter(d => d.status === 'PENDING').map(d => ({
      title: 'Doctor Verification Pending',
      description: `${d.user?.name || 'New Doctor'} — ${d.specialization?.name || 'Unspecified'}`,
      time: 'Awaiting Review',
      type: 'verification'
    }))
  ].filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
  });

  const muted = dark ? "#64748b" : "#7c3aed";
  const bg = dark ? "#060b18" : "#f9f8ff";
  const textCol = dark ? "#f1f5f9" : "#1e1b4b";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(139,92,246,0.1)";
  const accent = "#8b5cf6";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Top Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: "rgba(6,11,24,0.05)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 40 }}>
          <div className="flex-1 relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search platform directory..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", height: 52, paddingLeft: 56, background: surface, border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: '15px', outline: 'none' }} />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 24 }}>
             <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 16, fontWeight: 800 }}>{user?.name || "System Admin"}</p>
                  <p style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 900, letterSpacing: "0.12em" }}>SYSTEM CONTROL</p>
                </div>
                <div style={{ width: 50, height: 50, borderRadius: 16, background: "#8b5cf6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: '16px' }}>
                  {(user?.name || "AD").substring(0, 2).toUpperCase()}
                </div>
             </div>
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Branding Section */}
          <FadeUp delay={0}>
            <div style={{ marginBottom: 100, background: `linear-gradient(135deg, #1e1b4b 0%, ${accent} 50%, #4c1d95 100%)`, borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>Command Center</p>
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                System <br/> <span style={{ color: "#c084fc" }}>Overview.</span>
              </h1>
              <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                Real-time dashboard metrics tracking patients, doctors, schedules, and active consultation queues globally.
              </p>
              <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                <button 
                  onClick={() => navigate('/admin/verify-doctors')}
                  style={{ padding: "18px 36px", background: "#fff", color: accent, borderRadius: 18, fontWeight: 800, fontSize: 15, border: "none", cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                >
                  Pending Reviews ({pendingDoctors.length})
                </button>
                <button 
                  onClick={() => navigate('/admin/hospitals')}
                  style={{ padding: "18px 36px", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 18, fontWeight: 800, fontSize: 15, border: "1px solid rgba(255,255,255,0.2)", cursor: 'pointer' }}
                >
                  Manage Facilities
                </button>
              </div>
            </div>
          </FadeUp>

          {/* 2. Platform Metrics */}
          <FadeUp delay={0.2}>
            <div style={{ marginBottom: 100 }}>
              <SectionTitle text="Platform Metrics" muted={muted} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "40px 30px", textAlign: "center", boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}10`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <s.icon size={24} />
                    </div>
                    <p style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.05em", marginBottom: 8 }}>{s.val}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* 3. Appointment & Queue Stats */}
          <FadeUp delay={0.3}>
            <div style={{ marginBottom: 100 }}>
              <SectionTitle text="Operations Breakdown" muted={muted} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {[
                  { label: "Booked / Active", val: adminStats.bookedAppointments, icon: Clock, color: "#3b82f6" },
                  { label: "Successfully Completed", val: adminStats.completedAppointments, icon: CheckCircle2, color: "#10b981" },
                  { label: "Specializations Active", val: specializations?.length || 0, icon: Activity, color: "#8b5cf6" },
                ].map((s, i) => (
                  <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "40px 30px", textAlign: "center", boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}10`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <s.icon size={24} />
                    </div>
                    <p style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 8 }}>{s.val}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* 4. Pending Doctor Verifications */}
          <FadeUp delay={0.4}>
            <div style={{ marginBottom: 100 }}>
              <SectionTitle text="Pending Doctor Verifications" muted={muted} />
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 36, overflow: "hidden", boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                {pendingDoctors.length > 0 ? pendingDoctors.map((doc, i) => (
                  <div key={doc.doctorId || doc.id || i} style={{ display: "flex", alignItems: "center", padding: "30px 40px", borderBottom: i < pendingDoctors.length - 1 ? `1px solid ${border}` : "none" }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, background: "rgba(139,92,246,0.05)", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 24, fontSize: 18, fontWeight: 900 }}>
                      {(doc.user?.name || 'DR').substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '18px' }}>{doc.user?.name || 'New Doctor'}</p>
                      <p style={{ fontSize: 14, color: muted }}>{doc.specialization?.name || 'Unspecified'} · {doc.experienceYears || 0} Years Exp · {doc.hospital?.name || 'No Hospital'}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/admin/verify-doctors')}
                      style={{ padding: "10px 24px", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", borderRadius: 12, border: "none", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Review
                    </button>
                  </div>
                )) : (
                  <div style={{ textAlign: "center", padding: "60px", color: muted }}>
                    <Shield size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>No pending doctor verifications.</p>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>

          {/* 5. Recent System Activity */}
          <FadeUp delay={0.5}>
            <div style={{ marginBottom: 100 }}>
              <SectionTitle text="Recent Platform Activity" muted={muted} />
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 36, overflow: "hidden", boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                {recentActivity.length > 0 ? recentActivity.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "24px 40px", borderBottom: i < recentActivity.length - 1 ? `1px solid ${border}` : "none" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: item.type === 'appointment' ? "rgba(16,185,129,0.05)" : "rgba(139,92,246,0.05)", color: item.type === 'appointment' ? "#10b981" : "#8b5cf6", display: "flex", alignItems: "center", justify: "center", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 20 }}>
                      {item.type === 'appointment' ? <CalendarCheck size={18} /> : <Shield size={18} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '16px' }}>{item.title}</p>
                      <p style={{ fontSize: 13, color: muted }}>{item.description}</p>
                    </div>
                    <span style={{ fontSize: 13, color: muted }}>{item.time}</span>
                  </div>
                )) : (
                  <div style={{ textAlign: "center", padding: "60px", color: muted }}>
                    <Activity size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>No platform activities logged.</p>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>

          {/* 6. Quick Control Actions */}
          <FadeUp delay={0.6}>
            <div>
              <SectionTitle text="Quick Control Actions" muted={muted} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {[
                  { label: "Manage Facilities", icon: Building2, path: '/admin/hospitals', color: '#ec4899', desc: 'Add/Edit hospital branches' },
                  { label: "Manage Specializations", icon: Stethoscope, path: '/admin/specializations', color: '#8b5cf6', desc: 'Configure medical departments' },
                  { label: "Verify Doctors", icon: Shield, path: '/admin/verify-doctors', color: '#3b82f6', desc: 'Approve medical credentials' },
                ].map((action, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -6 }}
                    onClick={() => navigate(action.path)}
                    style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "40px", cursor: 'pointer', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}
                    className="group"
                  >
                    <div style={{ width: 64, height: 64, borderRadius: 20, background: `${action.color}10`, color: action.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <action.icon size={26} />
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{action.label}</h3>
                    <p style={{ fontSize: 13, color: muted }}>{action.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: accent, fontSize: 12, fontWeight: 800, marginTop: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Access Panel <ArrowUpRight size={14} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeUp>

          <footer style={{ textAlign: "center", opacity: 0.4, marginTop: 100 }}>
            <p className="text-[13px] font-black tracking-[0.6em] uppercase">HealthCare+ v2.0 · Administrative Control Panel</p>
          </footer>
        </div>
      </main>

      {/* Floating AI Agent Widget */}
      <button style={{ position: "fixed", bottom: 30, right: 30, width: 60, height: 60, background: "#8b5cf6", borderRadius: 20, border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 40px rgba(139,92,246,0.4)", zIndex: 100, cursor: 'pointer' }}>
        <Bot size={28} />
      </button>
    </div>
  );
};

export default AdminDashboard;
