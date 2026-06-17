import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, User, Mail, Phone, Camera, Shield, 
  MapPin, Stethoscope, Star, CheckCircle2, 
  Activity, Zap, Search, Bell, Sun, Moon, RefreshCw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { updateDoctorProfile } from '../../services/api';
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

const ProfileSetup = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { doctor, invalidate } = useData();
  const dark = theme === 'dark';
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    hospital: '',
    documentUrl: '',
    about: 'Dedicated medical professional focused on optimal patient outcomes.'
  });

  // Populate form from DataContext doctor data
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor?.user?.name || user?.name || '',
        email: doctor?.user?.email || user?.email || '',
        specialization: doctor?.specialization?.name || 'General Practitioner',
        experience: doctor?.experienceYears || '0',
        hospital: doctor?.hospital?.name || 'City Medical Nexus',
        documentUrl: doctor?.documentUrl || '',
        about: doctor?.biography || doctor?.about || 'Dedicated medical professional focused on optimal patient outcomes.'
      });
    }
  }, [doctor, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorId = doctor?.doctorId || doctor?.id;
    if (!doctorId) {
      setMessage('Doctor profile not loaded yet.');
      setTimeout(() => setMessage(''), 4000);
      return;
    }
    setSaving(true);
    try {
      await updateDoctorProfile(doctorId, {
        name: formData.name,
        specializationName: formData.specialization,
        hospitalName: formData.hospital,
        experienceYears: parseInt(formData.experience) || 0,
        documentUrl: formData.documentUrl || null,
        biography: formData.about
      });
      await invalidate(); // Refresh all data globally
      setMessage("Profile credentials successfully updated!");
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      console.error("Error updating credentials:", error);
      setMessage("Failed to update credentials.");
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const muted = dark ? "#64748b" : "#6b7280";
  const bg = dark ? "#060b18" : "#f0fdf4";
  const textCol = dark ? "#f1f5f9" : "#064e3b";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(16,185,129,0.1)";
  const accent = "#10b981";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Top Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: "rgba(6,11,24,0.05)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 40 }}>
          <div className="flex-1 relative max-w-md">
            <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 13 }}>Professional Credentials</p>
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Profile Section */}
          <FadeUp delay={0}>
            <div style={{ marginBottom: 400, background: `linear-gradient(135deg, #064e3b 0%, ${accent} 50%, #059669 100%)`, borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              
              <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 30px' }}>
                <div style={{ width: 140, height: 140, borderRadius: 48, background: "rgba(255,255,255,0.1)", backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 900, border: '2px solid rgba(255,255,255,0.2)' }}>
                  {(formData.name || 'DR').substring(0, 2).toUpperCase()}
                </div>
                <button style={{ position: 'absolute', bottom: -10, right: -10, width: 44, height: 44, borderRadius: 14, background: '#fff', color: accent, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                  <Camera size={20} />
                </button>
              </div>

              <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>Identity Portal</p>
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                Dr. Profile <br/> <span style={{ color: "#a7f3d0" }}>Console.</span>
              </h1>
              <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                Manage your professional image and clinical details. Accurate information builds trust within our healthcare community.
              </p>
            </div>
          </FadeUp>

          {/* 2. Form Section */}
          <FadeUp delay={0.2}>
            <div style={{ marginBottom: 400 }}>
              <SectionTitle text="Clinical Credentials" muted={muted} />
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 48, padding: "60px", boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
                {/* Verification Status Banner */}
                <div style={{
                  padding: '24px 32px', borderRadius: 24, marginBottom: 40,
                  display: 'flex', alignItems: 'center', gap: 20,
                  background: doctor?.status === 'APPROVED' ? 'rgba(16,185,129,0.07)' : (doctor?.status === 'REJECTED' ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)'),
                  color: doctor?.status === 'APPROVED' ? '#10b981' : (doctor?.status === 'REJECTED' ? '#ef4444' : '#f59e0b'),
                  border: `1px solid ${doctor?.status === 'APPROVED' ? 'rgba(16,185,129,0.15)' : (doctor?.status === 'REJECTED' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)')}`
                }}>
                  <Shield size={24} />
                  <div>
                    <p style={{ fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Status: {doctor?.status || 'PENDING'}
                    </p>
                    <p style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
                      {doctor?.status === 'APPROVED' 
                        ? 'Your credentials are verified. Clinical scheduling and consultation features are unlocked.' 
                        : (doctor?.status === 'REJECTED'
                          ? 'Verification failed. Please review your uploaded license document and re-upload.'
                          : 'Verification pending review. Please verify your medical license document below.')
                      }
                    </p>
                  </div>
                </div>

                {message && (
                  <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(16,185,129,0.1)', color: accent, fontWeight: 800, marginBottom: '30px', textAlign: 'center' }}>
                    {message}
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}>
                  
                  <div style={{ spaceY: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Full Professional Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div style={{ spaceY: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Specialization Field</label>
                    <input 
                      type="text" 
                      name="specialization" 
                      value={formData.specialization} 
                      onChange={handleChange}
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div style={{ spaceY: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Experience (Years)</label>
                    <input 
                      type="number" 
                      name="experience" 
                      value={formData.experience} 
                      onChange={handleChange}
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div style={{ spaceY: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Affiliated Hospital</label>
                    <input 
                      type="text" 
                      name="hospital" 
                      value={formData.hospital} 
                      onChange={handleChange}
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2', spaceY: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Clinical Biography</label>
                    <textarea 
                      name="about" 
                      value={formData.about} 
                      onChange={handleChange}
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none', minHeight: 120 }}
                    />
                  </div>

                  {/* Document Upload Simulation */}
                  <div style={{ gridColumn: 'span 2', borderTop: `1px solid ${border}`, paddingTop: 40, marginTop: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Medical Credentials & License Document</label>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <input 
                        type="text" 
                        name="documentUrl" 
                        placeholder="e.g. https://res.cloudinary.com/demo/image/upload/sample_medical_license.pdf"
                        value={formData.documentUrl} 
                        onChange={handleChange}
                        style={{ flex: 1, padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 15, fontWeight: 600, outline: 'none' }}
                      />
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, documentUrl: 'https://res.cloudinary.com/demo/image/upload/sample_medical_license.pdf' })}
                        style={{ padding: '20px 24px', background: `${accent}15`, color: accent, border: `1px solid ${accent}30`, borderRadius: 16, fontWeight: 900, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        Insert Demo License
                      </button>
                    </div>
                    {formData.documentUrl && (
                      <p style={{ fontSize: 13, color: '#10b981', fontWeight: 700, marginTop: 10 }}>
                        ✓ Document attached. Click "Update Credentials" to save.
                      </p>
                    )}
                  </div>

                  <div style={{ gridColumn: 'span 2', marginTop: 20 }}>
                    <button type="submit" disabled={saving} style={{ width: "100%", padding: "24px", background: accent, color: "#fff", borderRadius: 20, fontWeight: 900, border: "none", cursor: saving ? 'not-allowed' : 'pointer', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, opacity: saving ? 0.7 : 1 }}>
                      {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                      {saving ? 'Saving...' : 'Update Credentials'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </FadeUp>

          <footer style={{ textAlign: "center", opacity: 0.4 }}>
            <p className="text-[13px] font-black tracking-[0.6em] uppercase">HealthCare+ v2.0 · Professional Clinical Environment</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;
