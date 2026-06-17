import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Stethoscope, ArrowLeft, 
  CheckCircle, ChevronRight, User, ShieldCheck, 
  Search as SearchIcon, Star, Filter, HeartPulse,
  Activity, Shield, Zap, RefreshCw, AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getDoctorById, getAvailableSlots, bookAppointment, reserveSlot, releaseSlot } from '../../services/api';
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
    <div className="w-12 h-1 bg-[#2563eb] mx-auto rounded-full" />
  </div>
);

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { doctors, patient, invalidate } = useData();
  const dark = theme === 'dark';

  const [selectedSlot, setSelectedSlot] = useState(null);
  const selectedSlotRef = useRef(null);

  useEffect(() => {
    selectedSlotRef.current = selectedSlot;
  }, [selectedSlot]);

  useEffect(() => {
    return () => {
      if (selectedSlotRef.current) {
        releaseSlot(selectedSlotRef.current).catch(err => console.error("Error releasing slot on unmount:", err));
      }
    };
  }, []);

  const [isBooked, setIsBooked] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  // New features states matching base model
  const [filterDate, setFilterDate] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistoryPdf, setMedicalHistoryPdf] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || location.state?.specialization || '');

  // Effect to manage 3-minute reservation lock
  useEffect(() => {
    if (!selectedSlot) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(180); // 3 minutes

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          releaseSlot(selectedSlot).catch(err => console.error("Error releasing slot:", err));
          setSelectedSlot(null);
          alert("Your 3-minute slot reservation has expired. Please select a slot again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [selectedSlot]);

  const handleSelectSlot = async (slotId) => {
    if (slotId === selectedSlot) return;
    try {
      setError('');
      if (selectedSlot) {
        await releaseSlot(selectedSlot);
      }
      await reserveSlot(slotId);
      setSelectedSlot(slotId);
    } catch (err) {
      console.error('Failed to reserve slot:', err);
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Slot is already reserved or booked.';
      setError(typeof msg === 'string' ? msg : 'Slot is already reserved or booked by another patient.');
    }
  };

  // Fetch specific doctor and their available slots when ID is present
  useEffect(() => {
    if (id) {
      const fetchDoctorData = async () => {
        setLoadingSlots(true);
        setError('');
        try {
          const docData = await getDoctorById(id);
          setDoctor(docData);
          const doctorId = docData?.doctorId || docData?.id;
          if (doctorId) {
            const slots = await getAvailableSlots(doctorId);
            setAvailableSlots(slots || []);
          }
        } catch (err) {
          console.error('Error fetching doctor data:', err);
          setError('Failed to load doctor information.');
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchDoctorData();
    }
  }, [id]);

  const todayStr = new Date().toISOString().split('T')[0];
  const nowTime = new Date();

  // Filter slots: remove past dates AND past time slots for today
  const filteredSlots = (availableSlots || [])
    .filter(s => {
      if (!s.slotDate) return false;
      // Remove dates before today
      if (s.slotDate < todayStr) return false;
      // For today's date, remove slots whose start time has already passed
      if (s.slotDate === todayStr && s.startTime) {
        const [h, m] = s.startTime.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(h, m, 0, 0);
        if (slotTime <= nowTime) return false;
      }
      return true;
    })
    .filter(s => !filterDate || s.slotDate === filterDate);

  // Map the doctors list for the discovery view
  const allDoctors = (doctors || [])
    .map(d => ({
      id: d.id || d.doctorId,
      name: d.user?.name || 'Dr. Practitioner',
      specialization: d.specialization?.name || 'General',
      hospital: d.hospital?.name || 'HealthCare+ Center',
      experience: d.experienceYears || 0,
      rating: d.averageRating || 4.8,
      reviews: d.reviewCount || 0,
      availability: 'Check Slots',
      avatar: d.profilePicture || '',
      initials: d.user?.name ? d.user.name.replace('Dr. ', '').substring(0, 2).toUpperCase() : 'DR',
    }))
    .filter(doc => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.hospital.toLowerCase().includes(q)
      );
    });

  const handleBook = async () => {
    if (!selectedSlot || !patient?.id || !id) return;
    setBooking(true);
    setError('');
    try {
      const doctorId = doctor?.doctorId || doctor?.id;
      await bookAppointment(patient.id, doctorId, selectedSlot, symptoms, medicalHistoryPdf);
      // Invalidate all data so dashboards, appointments, stats refresh everywhere
      await invalidate();
      selectedSlotRef.current = null;
      setIsBooked(true);
    } catch (err) {
      console.error('Booking failed:', err);
      if (patient.id === 999) {
        // Demo Mode Fallback
        setIsBooked(true);
      } else {
        const msg = err.response?.data?.message || err.response?.data || err.message || 'Booking failed. The slot may already be taken.';
        setError(typeof msg === 'string' ? msg : 'Booking failed. Please try another slot.');
      }
    } finally {
      setBooking(false);
    }
  };

  const muted = dark ? "#64748b" : "#94a3b8";
  const bg = dark ? "#060b18" : "#f0f5ff";
  const textCol = dark ? "#f1f5f9" : "#0f172a";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.1)";

  const doctorDisplayName = doctor?.user?.name || 'Doctor';

  if (isBooked) {
    return (
      <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FloatingMedicalBg />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: 600, width: "90%", background: surface, borderRadius: 48, padding: "80px 60px", textAlign: "center", border: `1px solid ${border}`, position: 'relative', zIndex: 10 }}
        >
          <div style={{ width: 100, height: 100, background: "rgba(34,197,94,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 40px", color: "#22c55e" }}>
            <CheckCircle size={60} strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 20, letterSpacing: "-0.04em" }}>VISIT SCHEDULED!</h1>
          <p style={{ fontSize: 18, color: muted, marginBottom: 40, lineHeight: 1.6 }}>
            Your appointment with <span style={{ color: textCol, fontWeight: 900 }}>{doctorDisplayName}</span> has been confirmed. A confirmation alert has been sent to your registered device.
          </p>
          <button onClick={() => navigate('/patient/appointments')} style={{ width: "100%", padding: "20px", background: "#2563eb", color: "#fff", borderRadius: 16, fontWeight: 800, border: "none", cursor: 'pointer', marginBottom: 20 }}>Manage Appointments</button>
          <Link to="/patient/dashboard" style={{ fontSize: 13, fontWeight: 800, color: muted, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Return to Dashboard</Link>
        </motion.div>
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
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              placeholder="Search specialists or clinics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", height: 52, paddingLeft: 56, background: surface, border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: '15px', outline: 'none' }} 
            />
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* Step Logic: Discovery or Scheduling */}
          {!id ? (
            <>
              {/* 1. Hero Discovery Section */}
              <FadeUp delay={0}>
                <div style={{ marginBottom: 400, background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)", borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                  <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>Step 01: Expert Discovery</p>
                  <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                    Meet Our <br/> <span style={{ color: "#7dd3fc" }}>Experts.</span>
                  </h1>
                  <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                    Find the right medical partner for your health journey. Search through our network of top-rated verified specialists.
                  </p>
                </div>
              </FadeUp>

              {/* 2. Doctor List Section — Real data */}
              <FadeUp delay={0.2}>
                <div style={{ marginBottom: 400 }}>
                  <SectionTitle text="Available Specialists" muted={muted} />
                  <div style={{ display: "grid", gap: 30 }}>
                    {allDoctors.length > 0 ? allDoctors.map((doc) => (
                      <div key={doc.id} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 40, padding: "40px", display: "flex", alignItems: "center", gap: 30 }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, overflow: 'hidden', display: "flex", alignItems: "center", justifyContent: "center", background: "#2563eb", color: "#fff", fontSize: 28, fontWeight: 900, flexShrink: 0 }}>
                          {doc.avatar ? (
                            <img src={doc.avatar} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            doc.initials
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            {doc.name}
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: "4px 8px", background: "rgba(16,185,129,0.1)", color: "#10b981", borderRadius: 8, fontSize: 11, fontWeight: 900 }}>
                              <ShieldCheck size={12} /> VERIFIED
                            </span>
                            {doc.rating >= 4.7 && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: "4px 8px", background: "rgba(245,158,11,0.1)", color: "#f59e0b", borderRadius: 8, fontSize: 11, fontWeight: 900 }}>
                                <Star size={12} fill="#f59e0b" /> TOP RATED
                              </span>
                            )}
                            {doc.experience >= 15 && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: "4px 8px", background: "rgba(124,58,237,0.1)", color: "#7c3aed", borderRadius: 8, fontSize: 11, fontWeight: 900 }}>
                                <Zap size={12} /> EXPERT
                              </span>
                            )}
                          </h3>
                          <p style={{ color: muted, fontSize: 17, marginBottom: 20 }}>{doc.specialization} · {doc.hospital}</p>
                          <div style={{ display: "flex", gap: 20, alignItems: 'center' }}>
                            <span style={{ padding: "10px 20px", background: "rgba(37,99,235,0.1)", color: "#2563eb", borderRadius: 12, fontSize: 14, fontWeight: 700 }}>{doc.experience} yrs exp</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#f59e0b" }}>
                              <Star size={18} fill="#f59e0b" /> <span style={{ fontWeight: 800 }}>{typeof doc.rating === 'number' ? doc.rating.toFixed(1) : doc.rating}</span>
                            </div>
                            <span style={{ color: muted, fontSize: 14 }}>({doc.reviews} patient reviews)</span>
                          </div>
                        </div>
                        <button onClick={() => navigate(`/patient/book/${doc.id}`)} style={{ padding: "20px 40px", background: "#2563eb", color: "#fff", borderRadius: 20, border: "none", fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>Book Visit</button>
                      </div>
                    )) : (
                      <div style={{ textAlign: 'center', padding: '80px', background: surface, borderRadius: 40, border: `1px dashed ${border}` }}>
                        <Stethoscope size={64} color={muted} style={{ margin: '0 auto 24px', opacity: 0.3 }} />
                        <p style={{ color: muted, fontWeight: 600, fontSize: '18px' }}>No doctors available at this time.</p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeUp>
            </>
          ) : (
            <>
              {/* 1. Expert Selection Summary Section */}
              <FadeUp delay={0}>
                <div style={{ marginBottom: 400, background: surface, border: `1px solid ${border}`, borderRadius: 48, padding: "80px 60px", position: "relative", overflow: "hidden" }}>
                  <button onClick={() => navigate('/patient/book')} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", color: muted, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 12, cursor: 'pointer', marginBottom: 40 }}>
                    <ArrowLeft size={16} /> Back to Experts
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
                    <div style={{ width: 120, height: 120, background: "linear-gradient(135deg, #2563eb, #0891b2)", borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 40, fontWeight: 900 }}>
                      {doctorDisplayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, color: "#2563eb", marginBottom: 10 }}>Step 02: Scheduling</p>
                      <h1 style={{ fontSize: 60, fontWeight: 900, lineHeight: 1, marginBottom: 20, letterSpacing: "-0.04em" }}>{doctorDisplayName}</h1>
                      <p style={{ fontSize: 18, color: muted, lineHeight: 1.6 }}>
                        {doctor?.specialization?.name || 'Specialist'} · {doctor?.hospital?.name || 'Healthcare Center'} · {doctor?.experienceYears || 0} years experience
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Split Booking Interface (Slots Selection & Sticky Confirmation) */}
              <FadeUp delay={0.2}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 80 }}>
                  
                  {/* Left Column: Choose Your Slot (Scrollable List) */}
                  <div style={{ flex: '1 1 600px', minWidth: 320, background: surface, border: `1px solid ${border}`, borderRadius: 40, padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.01)' }}>
                    <div style={{ marginBottom: 30 }}>
                      <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Choose Your Slot</h3>
                      <p style={{ color: muted, fontSize: 14 }}>Select a date and time slot for your appointment consultation</p>
                    </div>

                    {error && (
                      <div style={{ padding: '16px 24px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 16, fontWeight: 700, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <AlertCircle size={20} /> {error}
                      </div>
                    )}

                    {/* Calendar / Date Filter Picker */}
                    {availableSlots.length > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 30 }}>
                        <div style={{ background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 20, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Calendar size={18} color="#2563eb" />
                          <span style={{ fontWeight: 800, fontSize: 13 }}>Date Filter:</span>
                          <input 
                            type="date" 
                            value={filterDate} 
                            min={todayStr}
                            onChange={(e) => {
                              setFilterDate(e.target.value);
                              setSelectedSlot(null); // Clear selected slot when date changes
                            }}
                            style={{ background: 'transparent', border: 'none', color: textCol, fontWeight: 700, fontSize: 13, outline: 'none', cursor: 'pointer' }} 
                          />
                          {filterDate && (
                            <button 
                              onClick={() => { setFilterDate(''); setSelectedSlot(null); }} 
                              style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 800, cursor: 'pointer', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                              Show All
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Scrollable grid container */}
                    <div style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '8px' }}>
                      {loadingSlots ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                          <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 16px', color: '#2563eb' }} />
                          <p style={{ color: muted, fontSize: 14 }}>Loading available slots...</p>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        filteredSlots.length > 0 ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                            {filteredSlots.map((slot) => {
                              const slotId = slot.slotId || slot.id;
                              return (
                                <div 
                                  key={slotId}
                                  onClick={() => handleSelectSlot(slotId)}
                                  style={{ 
                                    background: selectedSlot === slotId ? "rgba(37,99,235,0.05)" : (dark ? "rgba(255,255,255,0.01)" : "#ffffff"), 
                                    border: `2px solid ${selectedSlot === slotId ? "#2563eb" : border}`, 
                                    borderRadius: 24, 
                                    padding: "24px", 
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: selectedSlot === slotId ? '0 8px 24px rgba(37,99,235,0.08)' : 'none'
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <div style={{ padding: "4px 10px", background: "rgba(37,99,235,0.1)", color: "#2563eb", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>
                                      {slot.startTime && slot.startTime < '12:00' ? 'Morning' : slot.startTime && slot.startTime < '17:00' ? 'Afternoon' : 'Evening'}
                                    </div>
                                    {selectedSlot === slotId && <CheckCircle size={18} color="#2563eb" />}
                                  </div>
                                  <p style={{ color: muted, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{slot.slotDate}</p>
                                  <p style={{ fontSize: 18, fontWeight: 900 }}>{slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}</p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '60px 20px', background: dark ? 'rgba(0,0,0,0.1)' : '#fcfcfd', borderRadius: 24, border: `1px dashed ${border}` }}>
                            <Calendar size={48} color={muted} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                            <p style={{ color: muted, fontWeight: 600, fontSize: '15px' }}>No available slots on this specific date.</p>
                            <p style={{ color: muted, fontSize: 13, marginTop: 6 }}>Please select another date from the filter.</p>
                          </div>
                        )
                      ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: dark ? 'rgba(0,0,0,0.1)' : '#fcfcfd', borderRadius: 24, border: `1px dashed ${border}` }}>
                          <Calendar size={48} color={muted} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                          <p style={{ color: muted, fontWeight: 600, fontSize: '15px' }}>No slots available for this doctor right now.</p>
                          <p style={{ color: muted, fontSize: 13, marginTop: 6 }}>The doctor may need to configure availability first.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Finalize Booking (Sticky Card) */}
                  <div style={{ flex: '1 1 380px', minWidth: 300, background: surface, border: `1px solid ${border}`, borderRadius: 40, padding: '40px', position: 'sticky', top: 120, boxShadow: '0 20px 40px rgba(0,0,0,0.01)' }}>
                    <div style={{ marginBottom: 30 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <ShieldCheck size={22} color="#22c55e" />
                        <h3 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Finalize Booking</h3>
                      </div>
                      <p style={{ color: muted, fontSize: 14 }}>Complete details to schedule your appointment</p>
                    </div>

                    {/* Symptoms Input */}
                    <div style={{ textAlign: 'left', marginBottom: 20 }}>
                      <label style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8, color: muted }}>
                        Describe Symptoms (Optional)
                      </label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="e.g. Chronic fever since last 3 days, headaches..."
                        style={{ 
                          width: '100%', 
                          height: 80, 
                          padding: '12px 16px', 
                          background: dark ? '#0d1526' : '#f8fafc', 
                          border: `1px solid ${border}`, 
                          borderRadius: 14, 
                          color: textCol, 
                          fontSize: 14, 
                          resize: 'none', 
                          outline: 'none' 
                        }}
                      />
                    </div>

                    {/* Medical History PDF File Attachment */}
                    <div style={{ textAlign: 'left', marginBottom: 30 }}>
                      <label style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8, color: muted }}>
                        Attach Medical History PDF (Optional)
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: dark ? '#0a0f1d' : '#f8fafc', border: `2px dashed ${border}`, borderRadius: 14 }}>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setPdfFileName(file.name);
                              setMedicalHistoryPdf("C:\\Users\\Harshil\\Documents\\" + file.name);
                            } else {
                              setPdfFileName('');
                              setMedicalHistoryPdf('');
                            }
                          }}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: pdfFileName ? '#2563eb' : textCol, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {pdfFileName || 'Choose PDF file...'}
                          </span>
                          <span style={{ fontSize: 10, color: muted, marginTop: 2 }}>
                            {pdfFileName ? 'File attached successfully' : 'Drag & drop file here'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedSlot && (
                      <div style={{ padding: '10px 14px', background: dark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.04)', border: `1px solid ${border}`, borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#f59e0b', fontSize: 12, fontWeight: 800 }}>
                        <Clock size={14} />
                        <span>Slot Reserved! {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                      </div>
                    )}

                    <button 
                      onClick={handleBook}
                      disabled={!selectedSlot || booking}
                      style={{ 
                        width: "100%", 
                        padding: "16px", 
                        background: selectedSlot ? "#2563eb" : muted, 
                        color: "#fff", 
                        borderRadius: 14, 
                        fontWeight: 900, 
                        border: "none", 
                        cursor: selectedSlot && !booking ? 'pointer' : 'not-allowed',
                        fontSize: 14,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      {booking && <RefreshCw size={16} className="animate-spin" />}
                      {booking ? 'Processing...' : 'Confirm Visit'}
                    </button>
                    <p style={{ marginTop: 16, fontSize: 11, color: muted, textAlign: 'center' }}>By scheduling, you agree to our terms of clinical care.</p>
                  </div>
                </div>
              </FadeUp>
            </>
          )}

          <footer style={{ textAlign: "center", opacity: 0.4 }}>
            <p className="text-[13px] font-black tracking-[0.6em] uppercase">HealthCare+ v2.0 · Refined care for everyone</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
