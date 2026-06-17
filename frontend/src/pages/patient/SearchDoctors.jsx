import { useState } from 'react';
import { ChevronRight, Filter, Search, Star, MapPin, Activity, Stethoscope } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const SearchDoctors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { specializations, doctors, hospitals } = useData();
  const dark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');

  // Build specialization cards from real data
  const specIcons = { 'Cardiology': '❤️', 'Cardiologist': '❤️', 'Pediatrics': '👶', 'Pediatrician': '👶', 'Neurology': '🧠', 'Neurologist': '🧠', 'Dermatology': '✨', 'Dermatologist': '✨', 'Orthopedics': '🦴', 'Orthopedic': '🦴', 'General': '🏥', 'General Physician': '🏥', 'Gynecologist': '👩‍⚕️', 'Gynecology': '👩‍⚕️' };
  
  const specCards = (specializations || []).map(s => {
    const name = s.name || '';
    const doctorCount = (doctors || []).filter(d => d.specialization?.name === name || d.specialization?.specializationId === s.specializationId).length;
    return {
      id: s.specializationId || s.id,
      name,
      icon: specIcons[name] || '🩺',
      doctors: doctorCount,
    };
  }).filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q);
  });

  const muted = dark ? "#64748b" : "#94a3b8";

  return (
    <div style={{ background: dark ? "#060b18" : "#f0f5ff", minHeight: "100vh", color: dark ? "#f1f5f9" : "#0f172a", position: 'relative' }}>
      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Top Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: "rgba(6,11,24,0.05)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(37,99,235,0.1)'}`, position: "sticky", top: 0, zIndex: 40 }}>
          <div className="flex-1 relative max-w-md">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search specialists..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", height: 52, paddingLeft: 56, background: dark ? "#0d1526" : "#ffffff", border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(37,99,235,0.1)'}`, borderRadius: 16, color: dark ? "#f1f5f9" : "#0f172a", fontSize: '15px', outline: 'none' }} />
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Branding Section */}
          <FadeUp delay={0}>
            <div style={{ marginBottom: 400, background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)", borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>Step 01: Specialized Care</p>
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                Select Your <br/> <span style={{ color: "#7dd3fc" }}>Specialist.</span>
              </h1>
              <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                Choose the medical department you need. We'll connect you with the most qualified experts in that field instantly.
              </p>
            </div>
          </FadeUp>

          {/* 2. Specializations Grid Section — Real data */}
          <FadeUp delay={0.2}>
            <div style={{ marginBottom: 400 }}>
              <SectionTitle text="Medical Departments" muted={muted} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 30 }}>
                {specCards.length > 0 ? specCards.map((spec) => (
                  <motion.div 
                    key={spec.id || spec.name}
                    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(37,99,235,0.1)' }}
                    onClick={() => navigate('/patient/book', { state: { specialization: spec.name } })}
                    style={{ 
                      background: dark ? "#0d1526" : "#ffffff", 
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(37,99,235,0.1)'}`, 
                      borderRadius: 40, 
                      padding: "50px 40px", 
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: 90, 
                      height: 90, 
                      borderRadius: '28px', 
                      background: dark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.05)', 
                      color: '#2563eb', 
                      margin: '0 auto 30px',
                      boxShadow: '0 10px 30px rgba(37,99,235,0.06)'
                    }}>
                      <Stethoscope size={44} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{spec.name}</h3>
                    <p style={{ fontSize: 12, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{spec.doctors} Available Expert{spec.doctors !== 1 ? 's' : ''}</p>
                    <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#2563eb', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Select Department <ChevronRight size={16} />
                    </div>
                  </motion.div>
                )) : (
                  <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '60px', color: muted }}>
                    <Stethoscope size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>No specializations configured yet.</p>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>

          {/* 3. Real Stats Section */}
          <FadeUp delay={0.4}>
            <div style={{ marginBottom: 400 }}>
              <SectionTitle text="Our Network" muted={muted} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                {[
                  { label: "Verified Experts", val: doctors?.length || 0, icon: Star, color: "#f59e0b" },
                  { label: "Hospitals", val: hospitals?.length || 0, icon: MapPin, color: "#ef4444" },
                  { label: "Specialties", val: specializations?.length || 0, icon: Stethoscope, color: "#7c3aed" },
                  { label: "Active Listings", val: (doctors?.length || 0) + (hospitals?.length || 0), icon: Activity, color: "#22c55e" }
                ].map((s, i) => (
                  <div key={i} style={{ background: dark ? "#0d1526" : "#ffffff", border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(37,99,235,0.1)'}`, borderRadius: 32, padding: "40px 30px", textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}10`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <s.icon size={24} />
                    </div>
                    <p style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.05em", marginBottom: 8 }}>{s.val}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: muted, uppercase: true }}>{s.label}</p>
                  </div>
                ))}
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

export default SearchDoctors;
