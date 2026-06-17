import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Bell, Shield, Moon, Sun, Globe, Mail, 
  Phone, ChevronRight, LogOut, Check, Activity, HeartPulse, CheckCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
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
    <div className="w-12 h-1 bg-[#10b981] mx-auto rounded-full" />
  </div>
);

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { doctor, notificationSettings, updateNotificationSettings, userPreferences, updateUserPreferences } = useData();
  const dark = theme === 'dark';

  const [saveStatus, setSaveStatus] = useState('');

  const showSaveSuccess = (msg) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const sections = [
    { 
      title: 'Clinical Account Settings', 
      items: [
        { icon: User, label: 'Full Profile Name', value: doctor?.user?.name || user?.name || 'Dr. Practitioner' },
        { icon: Mail, label: 'Work Email Address', value: doctor?.user?.email || user?.email || 'doctor@nexus.com' },
        { icon: Phone, label: 'Hospital Phone Contact', value: doctor?.user?.phone || 'Not set' },
      ]
    },
    { 
      title: 'Clinical Preferences', 
      items: [
        { 
          icon: Bell, label: 'Real-time Telehealth Alerts', type: 'toggle', 
          value: notificationSettings.pushNotifications, 
          setter: () => {
            updateNotificationSettings('pushNotifications', !notificationSettings.pushNotifications);
            showSaveSuccess('Telehealth alert preference saved');
          }
        },
        { icon: Globe, label: 'Consultation Language', value: userPreferences.language },
        { 
          icon: dark ? Moon : Sun, label: 'App Theme', type: 'toggle', 
          value: dark, 
          setter: () => {
            toggleTheme();
            showSaveSuccess('Theme preference saved');
          }
        },
      ]
    },
    { 
      title: 'Practice Security', 
      items: [
        { icon: Shield, label: 'Change Account Password', action: true },
        { 
          icon: Shield, label: 'Electronic Prescribing 2FA', type: 'toggle',
          value: userPreferences.twoFactorEnabled,
          setter: () => {
            updateUserPreferences('twoFactorEnabled', !userPreferences.twoFactorEnabled);
            showSaveSuccess(userPreferences.twoFactorEnabled ? '2FA disabled' : '2FA enabled');
          }
        },
      ]
    }
  ];

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
            <p style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 13 }}>Clinical Control Hub</p>
          </div>
        </div>

        {/* Save Status Toast */}
        {saveStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', top: 120, right: 40, zIndex: 100,
              padding: '16px 24px', background: 'rgba(16,185,129,0.15)', 
              color: accent, borderRadius: 16, fontWeight: 700, 
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1px solid ${border}`,
              backdropFilter: 'blur(20px)',
            }}
          >
            <CheckCircle size={18} /> {saveStatus}
          </motion.div>
        )}

        {/* Sequential Content Flow */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 20px" }}>
          
          {/* 1. Hero Settings Section */}
          <FadeUp delay={0}>
            <div style={{ marginBottom: 400, background: `linear-gradient(135deg, #064e3b 0%, ${accent} 50%, #059669 100%)`, borderRadius: 48, padding: "100px 80px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
              <p style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 900, fontSize: 13, marginBottom: 20, opacity: 0.8 }}>System Management</p>
              <h1 style={{ fontSize: 84, fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: "-0.04em" }}>
                Practice <br/> <span style={{ color: "#a7f3d0" }}>Settings.</span>
              </h1>
              <p style={{ fontSize: 20, opacity: 0.7, marginBottom: 48, maxWidth: 700, margin: "0 auto 48px", lineHeight: 1.6 }}>
                Adjust clinical settings, configure preferences for online booking, and manage telehealth notification settings for your practice.
              </p>
            </div>
          </FadeUp>

          {/* 2. Settings Sections */}
          {sections.map((section, idx) => (
            <FadeUp key={section.title} delay={0.2 + idx * 0.1}>
              <div style={{ marginBottom: 400 }}>
                <SectionTitle text={section.title} muted={muted} />
                <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 40, overflow: 'hidden' }}>
                  {section.items.map((item, i) => (
                    <div 
                      key={item.label} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '40px', 
                        borderBottom: i !== section.items.length - 1 ? `1px solid ${border}` : 'none' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ width: 60, height: 60, background: "rgba(16,185,129,0.05)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>
                          <item.icon size={24} />
                        </div>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 5 }}>{item.label}</p>
                          {item.type !== 'toggle' && (
                            <p style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em' }}>{item.value || (item.status && item.status)}</p>
                          )}
                          {item.type === 'toggle' && (
                            <p style={{ fontSize: 16, fontWeight: 700, color: item.value ? '#22c55e' : muted }}>
                              {item.value ? 'Enabled' : 'Disabled'}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {item.type === 'toggle' ? (
                        <button 
                          onClick={item.setter}
                          style={{ 
                            width: 60, 
                            height: 34, 
                            borderRadius: 20, 
                            padding: 4, 
                            background: item.value ? accent : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"), 
                            border: `1px solid ${item.value ? accent : border}`, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", transform: item.value ? 'translateX(26px)' : 'translateX(0)', transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} />
                        </button>
                      ) : (
                        <ChevronRight color={muted} size={24} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}

          <FadeUp delay={0.6}>
            <div style={{ marginBottom: 400, textAlign: 'center' }}>
              <button 
                onClick={logout}
                style={{ width: "100%", maxWidth: 400, padding: "20px", background: "rgba(239,68,68,0.05)", color: "#ef4444", borderRadius: 20, fontWeight: 800, border: "1px solid rgba(239,68,68,0.1)", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, margin: '0 auto' }}
              >
                <LogOut size={20} /> Sign Out of Clinical Account
              </button>
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

export default Settings;
