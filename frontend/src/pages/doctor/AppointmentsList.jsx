import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarCheck, Clock, MapPin, XCircle, ChevronRight, 
  Filter, Search, Calendar, Video, Activity,
  CheckCircle2, AlertCircle, RefreshCw, Star, User
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { cancelAppointment, completeAppointment, updateAppointmentSummary } from '../../services/api';
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

const AppointmentsList = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const { theme } = useTheme();
  const { user } = useAuth();
  const { appointments, loading, invalidate, doctor } = useData();
  const dark = theme === 'dark';

  const [summaryApptId, setSummaryApptId] = useState(null);
  const [summaryPatientName, setSummaryPatientName] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [submittingSummary, setSubmittingSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mappedAppts = (appointments || []).map(a => ({
    id: a.appointmentId || a.id,
    patientName: a.patient?.user?.name || "Patient Unassigned",
    date: a.slot?.slotDate || "TBD",
    time: a.slot?.startTime || "TBD",
    status: a.status,
    type: a.slot?.startTime ? 'Video Session' : 'In-Clinic Checkup',
    avatar: a.patient?.user?.name ? a.patient.user.name.substring(0, 2).toUpperCase() : "PT",
    meetingUrl: a.meetingUrl,
    symptoms: a.symptoms,
    medicalHistoryPdf: a.medicalHistoryPdf,
    summary: a.summary
  })).filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return a.patientName.toLowerCase().includes(q) || 
           a.date.includes(q) || 
           (a.symptoms || '').toLowerCase().includes(q);
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'CANCELLED') {
        await cancelAppointment(id);
      } else if (newStatus === 'COMPLETED') {
        await completeAppointment(id);
      }
      await invalidate(); // Global refresh
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  };

  const tabs = ['Active', 'History', 'Cancelled'];
  const filteredAppointments = mappedAppts.filter(app => {
    if (activeTab === 'Active') return app.status === 'BOOKED';
    if (activeTab === 'History') return app.status === 'COMPLETED' || app.status === 'NO_SHOW';
    return app.status === 'CANCELLED';
  });

  const muted = dark ? "#64748b" : "#6b7280";
  const bg = dark ? "#060b18" : "#f0fdf4";
  const textCol = dark ? "#f1f5f9" : "#064e3b";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(16,185,129,0.1)";
  const accent = "#10b981";

  // 1. Adaptive Call Window Helper
  const getMeetingStatus = (dateStr, startTimeStr) => {
    if (!dateStr || !startTimeStr) return { active: false, label: 'TBD' };

    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = startTimeStr.split(':').map(Number);

    const meetingStartTime = new Date(year, month - 1, day, hours, minutes, 0);
    const now = new Date();

    const startThreshold = new Date(meetingStartTime.getTime() - 10 * 60 * 1000); // 10m before
    const endThreshold = new Date(meetingStartTime.getTime() + 45 * 60 * 1000); // slot length 30m + 15m buffer

    if (now < startThreshold) {
      const diffMs = startThreshold.getTime() - now.getTime();
      const diffMins = Math.ceil(diffMs / (60 * 1000));
      return { active: false, label: `Opens in ${diffMins}m` };
    } else if (now > endThreshold) {
      return { active: false, label: 'Room Closed' };
    } else {
      return { active: true, label: 'Join Room' };
    }
  };

  // 2. Patient Waiting Alert Helper
  const isPatientWaiting = (dateStr, startTimeStr) => {
    if (!dateStr || !startTimeStr) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = startTimeStr.split(':').map(Number);

    const meetingStartTime = new Date(year, month - 1, day, hours, minutes, 0);
    const now = new Date();

    const endThreshold = new Date(meetingStartTime.getTime() + 45 * 60 * 1000); // slot length 30m + 15m buffer

    return now > meetingStartTime && now < endThreshold;
  };

  if (doctor?.status !== 'APPROVED') {
    return (
      <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
        <FloatingMedicalBg />
        <main style={{ flex: 1, padding: "100px 40px", position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 48, padding: "80px", textAlign: "center", maxWidth: 650, boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 100, height: 100, borderRadius: 32, background: "rgba(245,158,11,0.08)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 36px" }}>
              <CalendarCheck size={48} />
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em' }}>Access Restricted</h2>
            <p style={{ fontSize: 18, color: muted, lineHeight: 1.6 }}>
              Your account verification is currently pending admin approval. You will be able to review patient appointments and medical sessions once your credentials have been verified.
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
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Filter patient records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", height: 52, paddingLeft: 56, background: surface, border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: '15px', outline: 'none' }} />
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Section */}
          <FadeUp delay={0}>
            <div style={{ marginBottom: 400, background: `linear-gradient(135deg, #064e3b 0%, ${accent} 50%, #059669 100%)`, borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>Practice Management</p>
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 48, letterSpacing: "-0.04em" }}>
                Patient <br/> <span style={{ color: "#a7f3d0" }}>Queue.</span>
              </h1>
              
              <div style={{ display: "flex", gap: 15, justifyContent: "center" }}>
                {tabs.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ 
                      padding: "16px 36px", 
                      background: activeTab === tab ? "#fff" : "rgba(255,255,255,0.1)", 
                      color: activeTab === tab ? accent : "#fff", 
                      borderRadius: 18, 
                      fontWeight: 800, 
                      fontSize: 14, 
                      border: "none",
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* 2. Queue Section */}
          <FadeUp delay={0.2}>
            <div style={{ marginBottom: 400 }}>
              <SectionTitle text={`${activeTab} Sessions`} muted={muted} />
              <div style={{ display: "grid", gap: 30 }}>
                {filteredAppointments.length > 0 ? filteredAppointments.map((app) => (
                  <div key={app.id} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 40, padding: "40px", display: "flex", alignItems: "center", gap: 30 }}>
                    <div style={{ width: 80, height: 80, background: accent, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 900 }}>{app.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <h3 style={{ fontSize: 28, fontWeight: 900 }}>{app.patientName}</h3>
                        <div style={{ padding: "8px 16px", background: "rgba(16,185,129,0.1)", color: accent, borderRadius: 10, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{app.type}</div>
                      </div>
                      <p style={{ color: muted, fontSize: 17, marginBottom: 12 }}>Scheduled for <span style={{ color: textCol, fontWeight: 700 }}>{app.date}</span> at <span style={{ color: textCol, fontWeight: 700 }}>{app.time}</span></p>
                      
                      {app.symptoms && (
                        <div style={{ padding: '16px', background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: 16, border: `1px solid ${border}`, marginTop: 16 }}>
                          <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: accent, marginBottom: 6 }}>Clinical Symptoms</p>
                          <p style={{ fontSize: 14, lineHeight: 1.5, color: textCol, margin: 0 }}>{app.symptoms}</p>
                          
                          {app.medicalHistoryPdf && (
                            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, borderTop: `1px solid ${border}`, paddingTop: 10 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: muted }}>Medical File:</span>
                              <a 
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`Opening patient medical record: ${app.medicalHistoryPdf}`);
                                }}
                                style={{ fontSize: 12, color: '#3b82f6', fontWeight: 800, textDecoration: 'underline' }}
                              >
                                {app.medicalHistoryPdf.substring(app.medicalHistoryPdf.lastIndexOf('\\') + 1)}
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {app.status === 'BOOKED' && isPatientWaiting(app.date, app.time) && (
                        <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.08)', borderRadius: 12, border: `1px solid ${border}`, marginTop: 15, display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>
                          <AlertCircle size={16} />
                          <span>ALERT: Patient is waiting in Jitsi room. Please join call below.</span>
                        </div>
                      )}

                      {app.status === 'COMPLETED' && (
                        <div style={{ padding: '16px', background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: 16, border: `1px solid ${border}`, marginTop: 20 }}>
                          <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: accent, marginBottom: 6 }}>Logged Consultation Summary & Prescription</p>
                          {app.summary ? (
                            <p style={{ fontSize: 14, lineHeight: 1.5, color: textCol, margin: 0 }}>{app.summary}</p>
                          ) : (
                            <p style={{ fontSize: 14, lineHeight: 1.5, color: '#f59e0b', margin: 0, fontWeight: 700 }}>⏳ Awaiting clinical summary & prescription log</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 15 }}>
                      {app.status === 'BOOKED' && (
                        <>
                          <button onClick={() => handleStatusChange(app.id, 'CANCELLED')} style={{ padding: "18px 24px", background: "rgba(239,68,68,0.1)", color: "#ef4444", borderRadius: 16, border: "none", fontWeight: 800, cursor: 'pointer' }}>Void</button>
                          {app.meetingUrl ? (() => {
                            const meetingStatus = getMeetingStatus(app.date, app.time);
                            return meetingStatus.active ? (
                              <a 
                                href={app.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ 
                                  padding: "18px 30px", 
                                  background: "rgba(59, 130, 246, 0.1)", 
                                  color: "#3b82f6", 
                                  borderRadius: 16, 
                                  fontWeight: 800, 
                                  display: "flex", 
                                  alignItems: "center", 
                                  gap: 10,
                                  textDecoration: "none"
                                }}
                              >
                                <Video size={18} /> Join Call
                              </a>
                            ) : (
                              <button 
                                disabled 
                                style={{ 
                                  padding: "18px 30px", 
                                  background: "rgba(148, 163, 184, 0.1)", 
                                  color: muted, 
                                  borderRadius: 16, 
                                  fontWeight: 800, 
                                  border: "none",
                                  cursor: "not-allowed",
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10
                                }}
                              >
                                <Clock size={16} /> {meetingStatus.label}
                              </button>
                            );
                          })() : (
                            <span style={{ fontSize: 13, fontWeight: 700, color: muted, display: 'flex', alignItems: 'center' }}>In-Clinic Visit</span>
                          )}
                          <button onClick={() => handleStatusChange(app.id, 'COMPLETED')} style={{ padding: "18px 36px", background: accent, color: "#fff", borderRadius: 16, border: "none", fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                            Complete <CheckCircle2 size={18} />
                          </button>
                        </>
                      )}
                      {app.status === 'COMPLETED' && (
                        <div style={{ display: 'flex', gap: 12 }}>
                          {!app.summary && (
                            <button 
                              onClick={() => {
                                setSummaryApptId(app.id);
                                setSummaryPatientName(app.patientName);
                                setSummaryText('');
                              }}
                              style={{ padding: "18px 24px", background: "rgba(245,158,11,0.1)", color: "#f59e0b", borderRadius: 16, border: "none", fontWeight: 800, cursor: 'pointer' }}
                            >
                              Write Summary
                            </button>
                          )}
                          <button style={{ padding: "18px 36px", background: "rgba(16,185,129,0.1)", color: accent, borderRadius: 16, border: "none", fontWeight: 800, cursor: 'pointer' }}>View Record</button>
                        </div>
                      )}
                      {app.status === 'CANCELLED' && (
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#ef4444", textTransform: 'uppercase', letterSpacing: '0.1em' }}>CANCELLED</span>
                      )}
                      {app.status === 'NO_SHOW' && (
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#f59e0b", textTransform: 'uppercase', letterSpacing: '0.1em' }}>NO SHOW (MISSED)</span>
                      )}
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: "100px", background: surface, borderRadius: 48, border: `1px dashed ${border}` }}>
                    <Activity size={80} color={muted} style={{ margin: '0 auto 30px', opacity: 0.3 }} />
                    <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>Queue Empty</h3>
                    <p style={{ color: muted, fontSize: 16 }}>No {activeTab.toLowerCase()} clinical sessions found in system.</p>
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
      {/* Summary Dialog Overlay */}
      {summaryApptId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 40, padding: '40px', maxWidth: 480, width: '90%', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.02em' }}>Log Consultation Summary</h2>
            <p style={{ color: muted, fontSize: 14, marginBottom: 30 }}>Log treatment details, guidelines, or prescription text for <span style={{ color: textCol, fontWeight: 800 }}>{summaryPatientName}</span>.</p>
            
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder="e.g. Advised rest for 2 days. Prescribed Paracetamol 500mg twice a day post meals..."
              style={{ width: '100%', height: 150, padding: '16px', background: dark ? '#0a0f1d' : '#f8fafc', border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 14, resize: 'none', outline: 'none', marginBottom: 30 }}
            />

            <div style={{ display: 'flex', gap: 15 }}>
              <button 
                onClick={() => {
                  setSummaryApptId(null);
                  setSummaryText('');
                }}
                style={{ flex: 1, padding: '16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 12, border: 'none', fontWeight: 800, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!summaryText.trim()) return;
                  setSubmittingSummary(true);
                  try {
                    await updateAppointmentSummary(summaryApptId, summaryText);
                    await invalidate(); // global data refresh
                    setSummaryApptId(null);
                    setSummaryText('');
                  } catch (err) {
                    console.error("Failed to submit summary:", err);
                  } finally {
                    setSubmittingSummary(false);
                  }
                }}
                disabled={submittingSummary}
                style={{ flex: 1, padding: '16px', background: accent, color: '#fff', borderRadius: 12, border: 'none', fontWeight: 800, cursor: 'pointer' }}
              >
                {submittingSummary ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
