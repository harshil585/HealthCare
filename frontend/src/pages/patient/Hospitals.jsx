import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Phone, Star, ArrowRight, 
  Search, Filter, Activity, HeartPulse, Hospital as HospitalIcon,
  ChevronDown, ChevronUp
} from 'lucide-react';
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
    <div className="w-12 h-1 bg-[#2563eb] mx-auto rounded-full" />
  </div>
);

const Hospitals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { hospitals, doctors } = useData();
  const dark = theme === 'dark';

  const filteredHospitals = (hospitals || []).filter(h => {
    const name = h.name || '';
    const city = h.city || '';
    const q = searchTerm.toLowerCase();
    return name.toLowerCase().includes(q) || city.toLowerCase().includes(q);
  });

  const getDoctorsForHospital = (hospitalId, hospitalName) => {
    return (doctors || []).filter(d => {
      const docHospId = d.hospital?.hospitalId || d.hospital?.id;
      const currentHospId = hospitalId;
      if (docHospId && currentHospId && docHospId === currentHospId) return true;
      
      // Fallback: match by name
      const docHospName = d.hospital?.name || '';
      const currentHospName = hospitalName || '';
      return docHospName.toLowerCase().trim() === currentHospName.toLowerCase().trim();
    });
  };

  const handleToggleHospital = (id) => {
    setSelectedHospitalId(prev => prev === id ? null : id);
  };

  const muted = dark ? "#64748b" : "#94a3b8";
  const bg = dark ? "#060b18" : "#f0f5ff";
  const textCol = dark ? "#f1f5f9" : "#0f172a";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.1)";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Top Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: "rgba(6,11,24,0.05)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 40 }}>
          <div className="flex-1 relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              placeholder="Search medical centers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", height: 52, paddingLeft: 56, background: surface, border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: '15px' }} 
            />
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Hospitals Section */}
          <FadeUp delay={0}>
            <div style={{ marginBottom: 400, background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)", borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>Network Directory</p>
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                Affiliated <br/> <span style={{ color: "#7dd3fc" }}>Centers.</span>
              </h1>
              <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                Access our network of state-of-the-art hospitals and clinics. Quality care is always within your reach.
              </p>
            </div>
          </FadeUp>

          {/* 2. List Section — Real data */}
          <FadeUp delay={0.2}>
            <div style={{ marginBottom: 400 }}>
              <SectionTitle text="Medical Facilities" muted={muted} />
              <div style={{ display: "grid", gap: 30 }}>
                {filteredHospitals.length > 0 ? filteredHospitals.map((hosp) => {
                  const hospId = hosp.hospitalId || hosp.id;
                  const isExpanded = selectedHospitalId === hospId;
                  const hospDoctors = getDoctorsForHospital(hospId, hosp.name);

                  return (
                    <motion.div 
                      key={hospId} 
                      layout="position"
                      style={{ 
                        background: surface, 
                        border: `1px solid ${border}`, 
                        borderRadius: 40, 
                        padding: "40px", 
                        display: "flex", 
                        flexDirection: "column",
                        alignItems: "stretch", 
                        gap: 0,
                        cursor: 'pointer',
                        boxShadow: isExpanded ? '0 20px 40px rgba(37,99,235,0.06)' : 'none',
                        transition: 'box-shadow 0.3s ease'
                      }}
                      onClick={() => handleToggleHospital(hospId)}
                    >
                      {/* Hospital Details Row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 30, width: "100%" }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, overflow: 'hidden', display: "flex", alignItems: "center", justifyContent: "center", background: "#2563eb", color: "#fff", fontSize: 40, flexShrink: 0 }}>
                          {hosp.imageUrl ? (
                            <img src={hosp.imageUrl} alt={hosp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            "🏥"
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 10 }}>{hosp.name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#2563eb', fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
                            <MapPin size={16} /> {hosp.city || hosp.address || 'Location not set'}
                          </div>
                          <div style={{ display: 'flex', gap: 15 }}>
                            {hosp.contactNumber && (
                              <span style={{ padding: "8px 16px", background: "rgba(37,99,235,0.05)", color: muted, borderRadius: 10, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{hosp.contactNumber}</span>
                            )}
                            <span style={{ padding: "8px 16px", background: "rgba(34,197,94,0.1)", color: "#22c55e", borderRadius: 10, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              {hospDoctors.length} Specialist{hospDoctors.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div style={{ color: muted, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 14, background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${border}` }}>
                          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </div>
                      </div>

                      {/* Expandable Doctors List */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden', width: '100%' }}
                            onClick={(e) => e.stopPropagation()} // Prevent card closing when clicking inside
                          >
                            <div style={{ marginTop: 30, paddingTop: 30, borderTop: `1px solid ${border}` }}>
                              <h4 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Activity size={20} color="#2563eb" />
                                Available Specialists
                              </h4>
                              
                              <div style={{ display: 'grid', gap: 16 }}>
                                {hospDoctors.length > 0 ? (
                                  hospDoctors.map((doc) => (
                                    <div 
                                      key={doc.id} 
                                      style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 20, 
                                        padding: '20px', 
                                        background: dark ? 'rgba(255,255,255,0.02)' : '#f8fafc', 
                                        borderRadius: 24, 
                                        border: `1px solid ${border}` 
                                      }}
                                    >
                                      <div style={{ width: 50, height: 50, borderRadius: 16, overflow: 'hidden', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                                        {doc.profilePicture ? (
                                          <img src={doc.profilePicture} alt={doc.user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                          (doc.user?.name || 'DR').substring(0, 2).toUpperCase()
                                        )}
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 800, fontSize: 18, color: textCol }}>{doc.user?.name || 'Dr. Practitioner'}</p>
                                        <p style={{ fontSize: 13, color: muted }}>{doc.specialization?.name || 'General'} · {doc.experienceYears || 0} yrs experience</p>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
                                          <Star size={14} fill="#f59e0b" />
                                          <span style={{ fontWeight: 800, fontSize: 14 }}>{doc.averageRating ? doc.averageRating.toFixed(1) : '4.8'}</span>
                                        </div>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/patient/book/${doc.id || doc.doctorId}`);
                                          }}
                                          style={{ 
                                            padding: '10px 20px', 
                                            background: '#2563eb', 
                                            color: '#fff', 
                                            border: 'none', 
                                            borderRadius: 12, 
                                            fontSize: 13, 
                                            fontWeight: 800, 
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                          }}
                                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                          Book Slot
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p style={{ color: muted, fontSize: 14, fontStyle: 'italic', padding: '10px 0' }}>No doctors currently listed at this facility.</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }) : (
                  <div style={{ textAlign: 'center', padding: '80px', background: surface, borderRadius: 40, border: `1px dashed ${border}` }}>
                    <Building2 size={64} color={muted} style={{ margin: '0 auto 24px', opacity: 0.3 }} />
                    <p style={{ color: muted, fontWeight: 600, fontSize: '18px' }}>
                      {searchTerm ? 'No hospitals match your search.' : 'No hospitals registered yet.'}
                    </p>
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
    </div>
  );
};

export default Hospitals;
