import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CheckCircle2, Inbox, RefreshCw, Trash2, 
  Clock, AlertCircle, Sparkles, Archive, ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/api';
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

const Notifications = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { invalidate } = useData();
  const dark = theme === 'dark';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ

  const loadNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const actualUserId = user.userId || user.id;
      const data = await getUserNotifications(actualUserId);
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      // Fallback notifications for demo/offline
      setNotifications([
        { notificationId: 1, message: "Welcome to HealthCare+! Set up your bio profile to get started.", isRead: false, createdAt: new Date().toISOString() },
        { notificationId: 2, message: "Consultation schedule created with Dr. Practitioner on Friday.", isRead: true, createdAt: new Date(Date.now() - 3600000 * 2).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      await loadNotifications();
      await invalidate();
    } catch (err) {
      console.error(err);
      // fallback
      setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      const actualUserId = user.userId || user.id;
      await markAllNotificationsAsRead(actualUserId);
      await loadNotifications();
      await invalidate();
    } catch (err) {
      console.error(err);
      // fallback
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const formatTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  const muted = dark ? "#64748b" : "#94a3b8";
  const bg = dark ? "#060b18" : "#f0f5ff";
  const textCol = dark ? "#f1f5f9" : "#0f172a";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.1)";
  const accent = "#2563eb";

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
      <FloatingMedicalBg />

      <main style={{ flex: 1, paddingBottom: 200, position: 'relative', zIndex: 10 }}>
        {/* Header Bar */}
        <div style={{ height: 100, display: "flex", alignItems: "center", padding: "0 60px", background: "rgba(6,11,24,0.05)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>Your Inbox</h2>
          <div style={{ flex: 1 }} />
          <button 
            onClick={handleMarkAllAsRead} 
            disabled={notifications.filter(n => !n.isRead).length === 0}
            style={{ 
              padding: "12px 24px", 
              background: "rgba(37,99,235,0.1)", 
              color: accent, 
              border: "none", 
              borderRadius: 12, 
              fontWeight: 800, 
              fontSize: 13, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <CheckCircle2 size={16} /> Mark all as read
          </button>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 20px" }}>
          {/* Main Card */}
          <FadeUp delay={0}>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 40, padding: "50px", boxShadow: "0 40px 100px rgba(0,0,0,0.02)" }}>
              {/* Tab Filters */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 40, borderBottom: `1px solid ${border}`, paddingBottom: 20 }}>
                {['ALL', 'UNREAD', 'READ'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    style={{
                      padding: "10px 20px",
                      background: filter === tab ? "rgba(37,99,235,0.1)" : "transparent",
                      color: filter === tab ? accent : muted,
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {tab} ({
                      tab === 'ALL' ? notifications.length :
                      tab === 'UNREAD' ? notifications.filter(n => !n.isRead).length :
                      notifications.filter(n => n.isRead).length
                    })
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: "60px" }}>
                  <RefreshCw size={36} className="animate-spin" style={{ color: accent, margin: '0 auto 16px' }} />
                  <p style={{ color: muted }}>Synchronizing alert logs...</p>
                </div>
              ) : filtered.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <AnimatePresence>
                    {filtered.map((item) => (
                      <motion.div
                        key={item.notificationId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={{
                          background: item.isRead ? 'transparent' : 'rgba(37,99,235,0.02)',
                          border: `1px solid ${item.isRead ? border : 'rgba(37,99,235,0.15)'}`,
                          borderRadius: 24,
                          padding: '24px 30px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 20,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: 16, 
                          background: item.isRead ? 'rgba(148,163,184,0.08)' : 'rgba(37,99,235,0.08)', 
                          color: item.isRead ? muted : accent, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <Bell size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ 
                            fontSize: 15, 
                            fontWeight: item.isRead ? 500 : 700, 
                            color: textCol, 
                            lineHeight: 1.5,
                            margin: '0 0 8px'
                          }}>
                            {item.message}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: muted, fontSize: 12 }}>
                            <Clock size={12} /> <span>{formatTime(item.createdAt)}</span>
                          </div>
                        </div>
                        {!item.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(item.notificationId)}
                            style={{
                              padding: '10px 16px',
                              background: 'none',
                              border: `1px solid ${border}`,
                              borderRadius: 12,
                              color: accent,
                              fontWeight: 800,
                              fontSize: 12,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            Mark Read <ArrowRight size={14} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: "80px 0" }}>
                  <Inbox size={60} color={muted} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                  <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Inbox Clean</h3>
                  <p style={{ color: muted, fontSize: 15 }}>No notifications matching your selection.</p>
                </div>
              )}
            </div>
          </FadeUp>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
