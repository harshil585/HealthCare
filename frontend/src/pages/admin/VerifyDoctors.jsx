import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, FileText, UserCircle, Shield, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { approveDoctor, rejectDoctor } from '../../services/api';
import FloatingMedicalBg from '../../components/patient/dashboard/FloatingMedicalBg';

const VerifyDoctors = () => {
  const { doctors, invalidate } = useData();
  const { theme } = useTheme();
  const [processing, setProcessing] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const dark = theme === 'dark';

  // Filter doctors by status
  const pendingDoctors = (doctors || []).filter(d => d.status === 'PENDING');
  const approvedDoctors = (doctors || []).filter(d => d.status === 'APPROVED');
  const rejectedDoctors = (doctors || []).filter(d => d.status === 'REJECTED');

  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const flash = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleApprove = async (doctorId) => {
    setProcessing(doctorId);
    try {
      await approveDoctor(doctorId);
      await invalidate();
      flash('Doctor approved and activated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message;
      flash(typeof msg === 'string' ? msg : 'Approval failed. Doctor may need valid documents uploaded first.', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (doctorId) => {
    if (!confirm('Reject this doctor application?')) return;
    setProcessing(doctorId);
    try {
      await rejectDoctor(doctorId);
      await invalidate();
      flash('Doctor application rejected');
    } catch (err) {
      flash('Rejection failed: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setProcessing(null);
    }
  };

  const tabs = [
    { key: 'pending', label: `Pending (${pendingDoctors.length})` },
    { key: 'approved', label: `Approved (${approvedDoctors.length})` },
    { key: 'rejected', label: `Rejected (${rejectedDoctors.length})` },
  ];

  const displayDoctors = activeTab === 'pending' ? pendingDoctors : activeTab === 'approved' ? approvedDoctors : rejectedDoctors;

  const filteredDoctors = displayDoctors.filter(doc => {
    const name = (doc.user?.name || '').toLowerCase();
    const email = (doc.user?.email || '').toLowerCase();
    const spec = (doc.specialization?.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query) || spec.includes(query);
  });

  const muted = dark ? "#64748b" : "#3b82f6";
  const bg = dark ? "#060b18" : "#f0f6ff"; // light blue tint
  const textCol = dark ? "#f1f5f9" : "#0f1e36"; // deep navy text
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(59,130,246,0.1)";
  const accent = "#3b82f6"; // blue accent for reviews

  return (
    <div style={{ background: bg, minHeight: "100vh", color: textCol, position: 'relative' }}>
      <FloatingMedicalBg />

      <main style={{ flex: 1, padding: "60px 40px", position: 'relative', zIndex: 10 }}>
        {/* Toast */}
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'fixed', top: 30, right: 30, zIndex: 100,
              padding: '16px 24px', borderRadius: 16, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: message.type === 'success' ? '#22c55e' : '#ef4444',
              border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
            }}
          >
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {message.text}
          </motion.div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: muted, marginBottom: 8 }}>Administration</p>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em' }}>Verify Doctors</h1>
        </div>

        {/* Search Bar & Tabs Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 30 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 12 }}>
            {tabs.map(tab => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '14px 28px', borderRadius: 16, border: 'none',
                  fontWeight: 800, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === tab.key ? accent : (dark ? 'rgba(255,255,255,0.03)' : '#ffffff'),
                  color: activeTab === tab.key ? '#fff' : (dark ? '#94a3b8' : '#475569'),
                  boxShadow: activeTab === tab.key ? `0 8px 20px ${accent}25` : 'none',
                  border: activeTab === tab.key ? 'none' : `1px solid ${border}`
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 360 }}>
            <input 
              placeholder="Search by name, spec or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                paddingLeft: 48,
                borderRadius: 16,
                background: surface,
                border: `1px solid ${border}`,
                color: textCol,
                fontWeight: 600,
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: muted, opacity: 0.7 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, overflow: "hidden", boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: dark ? "rgba(255,255,255,0.01)" : "rgba(59,130,246,0.02)", borderBottom: `1px solid ${border}` }}>
                <th style={{ padding: "20px 32px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: muted }}>Doctor Details</th>
                <th style={{ padding: "20px 32px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: muted }}>Specialization</th>
                <th style={{ padding: "20px 32px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: muted }}>Experience</th>
                <th style={{ padding: "20px 32px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: muted }}>Documents</th>
                <th style={{ padding: "20px 32px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: muted, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc, index) => {
                const id = doc.doctorId || doc.id;
                const isProcessing = processing === id;
                return (
                  <tr key={id} style={{ borderBottom: index < filteredDoctors.length - 1 ? `1px solid ${border}` : "none", transition: "all 0.2s" }}>
                    <td style={{ padding: "24px 32px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(245,158,11,0.1)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15 }}>
                        {(doc.user?.name || 'DR').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: 16, display: 'block' }}>{doc.user?.name || 'New Doctor'}</span>
                        <span style={{ fontSize: 12, color: dark ? "#64748b" : "#94a3b8" }}>{doc.user?.email || ''}</span>
                      </div>
                    </td>
                    <td style={{ padding: "24px 32px", color: dark ? "#94a3b8" : "#475569", fontWeight: 600 }}>{doc.specialization?.name || 'Not set'}</td>
                    <td style={{ padding: "24px 32px", color: dark ? "#94a3b8" : "#475569", fontWeight: 600 }}>{doc.experienceYears || 0} yrs</td>
                    <td style={{ padding: "24px 32px" }}>
                      {doc.documentUrl ? (
                        <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" style={{ color: accent, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
                          <FileText size={16} /> View Document <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: "#ef4444", fontSize: 14, fontWeight: 800 }}>No documents uploaded</span>
                      )}
                    </td>
                    <td style={{ padding: "24px 32px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 10 }}>
                        {activeTab === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(id)}
                              disabled={isProcessing}
                              style={{ 
                                background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '10px 18px', borderRadius: 10, border: 'none',
                                fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: isProcessing ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <Check size={14} /> {isProcessing ? '...' : 'Approve'}
                            </button>
                            <button 
                              onClick={() => handleReject(id)}
                              disabled={isProcessing}
                              style={{ 
                                background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '10px 18px', borderRadius: 10, border: 'none',
                                fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: isProcessing ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                        {activeTab === 'approved' && (
                          <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={14} /> Active
                          </span>
                        )}
                        {activeTab === 'rejected' && (
                          <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Denied
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "60px 0", color: muted }}>
                    <Shield size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>
                      {activeTab === 'pending' ? 'No pending applications!' : activeTab === 'approved' ? 'No approved doctors yet.' : 'No rejected applications.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default VerifyDoctors;
