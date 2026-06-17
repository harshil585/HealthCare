import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse, Calendar, Clock, CheckCircle2, XCircle,
  Activity, Search, Bell, Moon, Sun, Video, MapPin,
  Star, Stethoscope, User, Settings, LayoutDashboard,
  History, BarChart3, LogOut, Zap, ArrowUpRight, Plus,
  Pill, FileText, Thermometer, Bot, ChevronRight, Users, TrendingUp,
  Shield, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { getDoctorReviews } from '../../services/api';
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

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { doctor, appointments, doctorStats } = useData();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      const docId = doctor?.doctorId || doctor?.id;
      if (docId) {
        setLoadingReviews(true);
        try {
          const revs = await getDoctorReviews(docId);
          setReviews(revs || []);
        } catch (err) {
          console.error("Failed to load reviews:", err);
          // Fallback reviews for demo
          setReviews([
            { id: 1, rating: 5, comments: "Excellent doctor, explained everything with patience.", patient: { user: { name: "Harshil Patel" } }, createdAt: new Date().toISOString() },
            { id: 2, rating: 4, comments: "Very professional and friendly atmosphere.", patient: { user: { name: "John Doe" } }, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() }
          ]);
        } finally {
          setLoadingReviews(false);
        }
      }
    };
    fetchReviews();
  }, [doctor]);

  const d = theme === 'dark';
  const bg = d ? "#060b18" : "#f0fdf4";
  const surface = d ? "#0d1526" : "#ffffff";
  const border = d ? "rgba(255,255,255,0.07)" : "rgba(16,185,129,0.1)";
  const text = d ? "#f1f5f9" : "#064e3b";
  const muted = d ? "#64748b" : "#6b7280";
  const accent = "#10b981";

  // Map appointments for display
  const mappedAppts = (appointments || []).map(a => ({
    id: a.appointmentId || a.id,
    patientName: a.patient?.user?.name || "Patient Unassigned",
    time: a.slot?.startTime || "TBD",
    date: a.slot?.slotDate || "TBD",
    type: a.slot?.startTime ? 'Regular Consultation' : 'General Checkup',
    status: a.status === 'BOOKED' ? 'Waiting' : (a.status === 'COMPLETED' ? 'Completed' : (a.status === 'NO_SHOW' ? 'No Show' : 'Cancelled')),
    avatar: a.patient?.user?.name ? a.patient.user.name.substring(0, 2).toUpperCase() : "PT"
  })).filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return a.patientName.toLowerCase().includes(q) || a.date.includes(q) || a.status.toLowerCase().includes(q);
  });

  const stats = [
    { label: "Active Queue", val: doctorStats.activeQueue, icon: Calendar, color: "#10b981" },
    { label: "Completed Visits", val: doctorStats.completed, icon: CheckCircle2, color: "#3b82f6" },
    { label: "Clinical Pulse", val: doctorStats.total > 0 ? Math.round((doctorStats.completed / doctorStats.total) * 100) + '%' : '—', icon: Activity, color: "#f59e0b" },
    { label: "Total Sessions", val: doctorStats.total, icon: TrendingUp, color: "#8b5cf6" }
  ];

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text, position: 'relative' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .section-gap { margin-bottom: 400px; }
      `}</style>

      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Top Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: d ? "rgba(6,11,24,0.05)" : "rgba(240,253,244,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 40 }}>
          <div className="flex-1 relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search patients, records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", height: 52, paddingLeft: 56, background: surface, border: `1px solid ${border}`, borderRadius: 16, color: text, fontSize: '15px', outline: 'none' }} />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 16, fontWeight: 800 }}>{doctor?.user?.name || user?.name || "Doctor"}</p>
                <p style={{ fontSize: 11, color: accent, fontWeight: 900, letterSpacing: "0.12em" }}>{doctor?.specialization?.name?.toUpperCase() || "MEDICAL SPECIALIST"}</p>
              </div>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: '16px' }}>
                {(doctor?.user?.name || user?.name || "DR").substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>

          {doctor?.status !== 'APPROVED' ? (
            /* Restricted Verification Roadmap View */
            <FadeUp delay={0}>
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 48, padding: "80px", textAlign: "center", boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 100, height: 100, borderRadius: 32, background: "rgba(245,158,11,0.08)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 36px" }}>
                  <Shield size={48} />
                </div>

                <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em' }}>
                  Verification Roadmap
                </h2>

                <p style={{ fontSize: 18, color: muted, maxWidth: 600, margin: "0 auto 60px", lineHeight: 1.6 }}>
                  To maintain the safety and integrity of the HealthCare+ network, all newly registered medical staff require document verification before unlocking clinical duties.
                </p>

                {/* Progress Steps */}
                <div style={{ maxWidth: 650, margin: "0 auto 60px", textAlign: "left", display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { title: "Account Registration", desc: "Your basic doctor profile account is set up.", status: "completed" },
                    {
                      title: "Medical Credentials Upload",
                      desc: doctor?.documentUrl
                        ? "License document uploaded successfully! (Awaiting admin approval)"
                        : "Upload your medical credentials & license to proceed.",
                      status: doctor?.documentUrl ? "completed" : "pending"
                    },
                    {
                      title: "Admin Review & Activation",
                      desc: doctor?.status === 'REJECTED'
                        ? "Verification failed. Please check your uploaded document and re-upload."
                        : "Verification agents typically approve files within 24 hours.",
                      status: doctor?.status === 'REJECTED' ? "error" : "pending"
                    }
                  ].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 20 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14,
                        background: step.status === 'completed' ? 'rgba(16,185,129,0.1)' : (step.status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'),
                        color: step.status === 'completed' ? accent : (step.status === 'error' ? '#ef4444' : '#f59e0b'),
                        flexShrink: 0
                      }}>
                        {step.status === 'completed' ? "✓" : (step.status === 'error' ? "✕" : idx + 1)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: 16 }}>{step.title}</p>
                        <p style={{ fontSize: 14, color: muted, marginTop: 4 }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                  <button
                    onClick={() => navigate('/doctor/profile')}
                    style={{ padding: "18px 36px", background: accent, color: "#fff", borderRadius: 18, fontWeight: 900, fontSize: 15, border: "none", cursor: 'pointer', boxShadow: `0 10px 25px ${accent}25` }}
                  >
                    Go to Profile Setup
                  </button>
                </div>
              </div>
            </FadeUp>
          ) : (
            /* Standard Dashboard Content */
            <>
              {/* 1. Hero Branding Section */}
              <FadeUp delay={0}>
                <div className="section-gap" style={{ background: `linear-gradient(135deg, #064e3b 0%, ${accent} 50%, #059669 100%)`, borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                  <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                    Practice <br /> <span style={{ color: "#a7f3d0" }}>Excellence.</span>
                  </h1>
                  <p style={{ fontSize: 20, opacity: 0.8, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                    Empowering your clinical journey with precision data and seamless patient management tools.
                  </p>
                  <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                    <button onClick={() => navigate('/doctor/slots')} style={{ padding: "18px 36px", background: "#fff", color: accent, borderRadius: 18, fontWeight: 800, fontSize: 15, border: "none", cursor: 'pointer' }}>Manage Schedule</button>
                    <button onClick={() => navigate('/doctor/appointments')} style={{ padding: "18px 36px", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 18, fontWeight: 800, fontSize: 15, border: "1px solid rgba(255,255,255,0.2)", cursor: 'pointer' }}>Recent Visits</button>
                  </div>
                </div>
              </FadeUp>

              {/* 2. Today's Schedule Section */}
              <FadeUp delay={0.2}>
                <div className="section-gap">
                  <SectionTitle text="Clinical Schedule" muted={muted} />
                  <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 40, overflow: "hidden" }}>
                    {mappedAppts.length > 0 ? mappedAppts.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", padding: "40px", borderBottom: i < mappedAppts.length - 1 ? `1px solid ${border}` : "none" }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(16,185,129,0.05)", color: accent, display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", marginRight: 30 }}>
                          <Clock size={24} />
                          <span style={{ fontSize: 12, fontWeight: 900, marginTop: 4 }}>{item.time?.split?.(' ')?.[0] || item.time}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>{item.patientName}</h3>
                          <p style={{ color: muted, fontSize: 16 }}>{item.type} · {item.date}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ padding: "10px 20px", background: item.status === 'Waiting' ? "rgba(245,158,11,0.1)" : item.status === 'Completed' ? "rgba(16,185,129,0.1)" : item.status === 'No Show' ? "rgba(244,63,94,0.1)" : "rgba(239,68,68,0.1)", color: item.status === 'Waiting' ? "#f59e0b" : item.status === 'Completed' ? accent : item.status === 'No Show' ? "#f43f5e" : "#ef4444", borderRadius: 12, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.status}</span>
                          <button onClick={() => navigate('/doctor/appointments')} style={{ marginLeft: 20, padding: "14px 28px", background: accent, color: "#fff", borderRadius: 14, border: "none", fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Manage Session</button>
                        </div>
                      </div>
                    )) : (
                      <div style={{ textAlign: 'center', padding: "80px", background: surface, borderRadius: 40 }}>
                        <Calendar size={64} color={muted} style={{ margin: "0 auto 24px" }} />
                        <p style={{ color: muted, fontWeight: 600, fontSize: '18px' }}>No patients currently in your queue.</p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>

              {/* 3. Performance Metrics Section */}
              <FadeUp delay={0.4}>
                <div className="section-gap">
                  <SectionTitle text="Clinical Overview" muted={muted} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                    {stats.map((s, i) => (
                      <div key={i} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "40px 30px", textAlign: "center" }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}10`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                          <s.icon size={24} />
                        </div>
                        <p style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.05em", marginBottom: 8 }}>{s.val}</p>
                        <p style={{ fontSize: 13, fontWeight: 800, color: muted, textTransform: 'uppercase' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* 4. Patient Reviews & Ratings Section */}
              <FadeUp delay={0.6}>
                <div className="section-gap">
                  <SectionTitle text="Patient Reviews" muted={muted} />
                  {loadingReviews ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <RefreshCw size={30} className="animate-spin" style={{ color: accent, margin: '0 auto 10px' }} />
                      <p style={{ color: muted }}>Synchronizing patient ratings...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
                      {reviews.map((rev) => (
                        <div key={rev.id} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "40px", position: "relative" }}>
                          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                fill={star <= rev.rating ? '#f59e0b' : 'none'}
                                color={star <= rev.rating ? '#f59e0b' : border}
                              />
                            ))}
                          </div>
                          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 20, fontStyle: (rev.reviewText || rev.comments) ? 'normal' : 'italic', color: (rev.reviewText || rev.comments) ? text : muted }}>
                            "{(rev.reviewText || rev.comments) || 'No written review comments left by patient.'}"
                          </p>
                          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 14, fontWeight: 800 }}>{rev.patient?.user?.name || "Verified Patient"}</span>
                            <span style={{ fontSize: 12, color: muted }}>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent Session'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: "80px", background: surface, borderRadius: 40, border: `1px dashed ${border}` }}>
                      <Star size={64} color={muted} style={{ margin: "0 auto 24px", opacity: 0.3 }} />
                      <p style={{ color: muted, fontWeight: 600, fontSize: '18px' }}>No patient reviews received yet.</p>
                      <p style={{ color: muted, fontSize: 14, marginTop: 8 }}>Completed appointments reviews will display here.</p>
                    </div>
                  )}
                </div>
              </FadeUp>
            </>
          )}

          <footer style={{ textAlign: "center", opacity: 0.4 }}>
            <p className="text-[13px] font-black tracking-[0.6em] uppercase">HealthCare+ v2.0 · Professional Clinical Environment</p>
          </footer>
        </div>
      </main>

      {/* Floating AI Health Scribe */}
      <button style={{ position: "fixed", bottom: 30, right: 30, width: 60, height: 60, background: accent, borderRadius: 20, border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 40px rgba(16,185,129,0.4)`, zIndex: 100, cursor: 'pointer' }}>
        <Bot size={28} />
      </button>
    </div>
  );
};

export default DoctorDashboard;
