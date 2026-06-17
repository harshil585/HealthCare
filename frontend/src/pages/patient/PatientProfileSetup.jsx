import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, UserCircle, Mail, Phone, Calendar, 
  MapPin, Activity, HeartPulse, User, Camera, 
  ChevronRight, Shield, Zap, CheckCircle, AlertCircle, RefreshCw, X, Laptop, Smartphone
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { updatePatientProfile } from '../../services/api';
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

const PatientProfileSetup = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { patient, invalidate, userPreferences, updateUserPreferences } = useData();
  const dark = theme === 'dark';

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  useEffect(() => {
    if (userPreferences) {
      setIs2FAEnabled(userPreferences.twoFactorEnabled || false);
    }
  }, [userPreferences]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'MALE',
    profilePicture: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Populate form from real patient data
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || user?.name || '',
        phone: patient.phone || '',
        age: patient.age?.toString() || '',
        gender: patient.gender || 'MALE',
        profilePicture: patient.profilePicture || '',
      });
    }
  }, [patient, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient?.id) {
      setMessage({ text: 'Patient profile not loaded yet.', type: 'error' });
      return;
    }
    
    // Validation
    if (!formData.name.trim()) {
      setMessage({ text: 'Name is required.', type: 'error' });
      return;
    }
    if (formData.age && (isNaN(formData.age) || parseInt(formData.age) < 0 || parseInt(formData.age) > 150)) {
      setMessage({ text: 'Please enter a valid age.', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      await updatePatientProfile(patient.id, {
        name: formData.name,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        profilePicture: formData.profilePicture,
      });
      await invalidate(); // Refresh all data globally
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Profile update failed:', error);
      setMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const muted = dark ? "#64748b" : "#94a3b8";
  const bg = dark ? "#060b18" : "#f0f5ff";
  const textCol = dark ? "#f1f5f9" : "#0f172a";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.1)";

  const initials = (formData.name || 'PA').substring(0, 2).toUpperCase();

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Top Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: "rgba(6,11,24,0.05)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 40 }}>
          <div className="flex-1 relative max-w-md">
            <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 13 }}>Personal Health Record</p>
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Profile Section */}
          <FadeUp delay={0}>
            <div style={{ marginBottom: 400, background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)", borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              
              <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 30px' }}>
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    style={{ width: 140, height: 140, borderRadius: 48, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} 
                  />
                ) : (
                  <div style={{ width: 140, height: 140, borderRadius: 48, background: "rgba(255,255,255,0.1)", backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 900, border: '2px solid rgba(255,255,255,0.2)' }}>
                    {initials}
                  </div>
                )}
                
                {/* Camera upload overlay */}
                <div style={{ position: 'absolute', bottom: -5, right: -5, width: 44, height: 44, background: '#2563eb', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', cursor: 'pointer', overflow: 'hidden' }}>
                  <Camera size={18} color="#fff" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, profilePicture: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                </div>
              </div>

              <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>Identity Portal</p>
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                My <br/> <span style={{ color: "#7dd3fc" }}>Profile.</span>
              </h1>
              <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                Maintain your medical identity. Your profile information ensures you get the most accurate and personalized care possible.
              </p>
            </div>
          </FadeUp>

          {/* 2. Form Section */}
          <FadeUp delay={0.2}>
            <div style={{ marginBottom: 400 }}>
              <SectionTitle text="Profile Information" muted={muted} />
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 48, padding: "60px", boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}>
                
                {message.text && (
                  <div style={{ 
                    padding: '20px 24px', borderRadius: 16, marginBottom: 30, fontWeight: 700, textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: message.type === 'success' ? '#22c55e' : '#ef4444',
                  }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}>
                  
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Full Legal Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      required
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="+1 234 567 890"
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Age (Years)</label>
                    <input 
                      type="number" 
                      name="age" 
                      value={formData.age} 
                      onChange={handleChange}
                      min="0"
                      max="150"
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: 15 }}>Biological Gender</label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      style={{ width: "100%", padding: "20px 24px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 16, color: textCol, fontSize: 16, fontWeight: 600, outline: 'none', appearance: 'none' }}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: 'span 2', marginTop: 20 }}>
                    <button 
                      type="submit" 
                      disabled={saving}
                      style={{ 
                        width: "100%", padding: "24px", background: "#2563eb", color: "#fff", 
                        borderRadius: 20, fontWeight: 900, border: "none", cursor: saving ? 'not-allowed' : 'pointer', 
                        fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.2em', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15,
                        opacity: saving ? 0.7 : 1,
                      }}
                    >
                      {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </FadeUp>

          {/* 3. Security Section */}
          <FadeUp delay={0.4}>
            <div style={{ marginBottom: 400 }}>
              <SectionTitle text="Access & Security" muted={muted} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 30 }}>
                <div 
                  onClick={() => setShow2FAModal(true)}
                  style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "40px", display: "flex", alignItems: "center", gap: 24, cursor: 'pointer', transition: 'all 0.3s' }}
                  className="hover-card"
                >
                  <div style={{ width: 60, height: 60, background: "rgba(34,197,94,0.1)", borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#22c55e" }}>
                    <Shield size={26} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 900 }}>Two-Factor Auth</h4>
                    <p style={{ fontSize: 14, color: muted }}>{is2FAEnabled ? "Status: Active" : "Extra layer of security"}</p>
                  </div>
                  <ChevronRight size={20} color={muted} style={{ marginLeft: 'auto' }} />
                </div>

                <div 
                  onClick={() => setShowHistoryModal(true)}
                  style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: "40px", display: "flex", alignItems: "center", gap: 24, cursor: 'pointer', transition: 'all 0.3s' }}
                  className="hover-card"
                >
                  <div style={{ width: 60, height: 60, background: "rgba(37,99,235,0.1)", borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#2563eb" }}>
                    <Activity size={26} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 900 }}>Login History</h4>
                    <p style={{ fontSize: 14, color: muted }}>Monitor recent activity</p>
                  </div>
                  <ChevronRight size={20} color={muted} style={{ marginLeft: 'auto' }} />
                </div>
              </div>
            </div>
          </FadeUp>

          <footer style={{ textAlign: "center", opacity: 0.4 }}>
            <p className="text-[13px] font-black tracking-[0.6em] uppercase">HealthCare+ v2.0 · Refined care for everyone</p>
          </footer>
        </div>
      </main>

      {/* 2FA Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
            onClick={() => setShow2FAModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 55 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 55 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: '40px', width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 50px 100px rgba(0,0,0,0.3)', color: textCol }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShow2FAModal(false)}
                style={{ position: 'absolute', top: 24, right: 24, border: 'none', background: 'transparent', cursor: 'pointer', color: muted }}
              >
                <X size={24} />
              </button>

              <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 30 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(34,197,94,0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 900 }}>Two-Factor Auth</h3>
                  <p style={{ fontSize: 13, color: muted }}>Enhance account security</p>
                </div>
              </div>

              <div style={{ marginBottom: 30 }}>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: muted, marginBottom: 20 }}>
                  Two-factor authentication adds an extra layer of protection to your account by requiring a verification code in addition to your password.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: dark ? 'rgba(255,255,255,0.02)' : '#f8fafc', borderRadius: 20, border: `1px solid ${border}` }}>
                  <div>
                    <h5 style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>SMS Authenticator</h5>
                    <p style={{ fontSize: 12, color: muted }}>Codes sent to your phone</p>
                  </div>
                  
                  {/* Toggle Switch */}
                  <div 
                    onClick={() => {
                      const newValue = !is2FAEnabled;
                      setIs2FAEnabled(newValue);
                      updateUserPreferences('twoFactorEnabled', newValue);
                    }}
                    style={{ width: 60, height: 34, background: is2FAEnabled ? '#22c55e' : muted, borderRadius: 100, padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background-color 0.3s' }}
                  >
                    <motion.div 
                      layout
                      style={{ width: 26, height: 26, background: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
                      animate={{ x: is2FAEnabled ? 26 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>
              </div>

              {is2FAEnabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ textAlign: 'center', padding: '20px', background: 'rgba(34,197,94,0.05)', borderRadius: 20, border: '1px dashed #22c55e', color: '#22c55e', fontSize: 14, fontWeight: 700 }}
                >
                  <p>✓ Two-Factor Authentication is active.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 55 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 55 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, padding: '40px', width: '90%', maxWidth: '550px', position: 'relative', boxShadow: '0 50px 100px rgba(0,0,0,0.3)', color: textCol }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowHistoryModal(false)}
                style={{ position: 'absolute', top: 24, right: 24, border: 'none', background: 'transparent', cursor: 'pointer', color: muted }}
              >
                <X size={24} />
              </button>

              <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 30 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(37,99,235,0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 900 }}>Login History</h3>
                  <p style={{ fontSize: 13, color: muted }}>Recent access logs for this account</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '350px', overflowY: 'auto', paddingRight: '6px' }}>
                {[
                  { device: 'Windows 11 (Chrome)', ip: '127.0.0.1 (Localhost)', time: 'Today, 11:52 AM', status: 'Active Session', current: true },
                  { device: 'Windows 11 (Chrome)', ip: '127.0.0.1 (Localhost)', time: 'Today, 11:30 AM', status: 'Closed' },
                  { device: 'Android 14 (Chrome Mobile)', ip: '192.168.1.102', time: 'Yesterday, 08:45 PM', status: 'Closed' },
                  { device: 'macOS Sonoma (Safari)', ip: '172.16.5.4', time: 'Jun 04, 2026, 02:15 PM', status: 'Expired' }
                ].map((log, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 16, background: dark ? 'rgba(255,255,255,0.02)' : '#f8fafc', border: log.current ? '1px solid #2563eb' : `1px solid ${border}` }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: log.current ? 'rgba(37,99,235,0.1)' : 'rgba(148,163,184,0.1)', color: log.current ? '#2563eb' : muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {log.device.includes('Android') ? <Smartphone size={20} /> : <Laptop size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>{log.device}</span>
                        {log.current && (
                          <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: muted }}>IP: {log.ip} · {log.time}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: log.current ? '#22c55e' : muted }}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientProfileSetup;
