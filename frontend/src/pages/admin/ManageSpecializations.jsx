import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Stethoscope, X, Save, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { addSpecialization, updateSpecialization, deleteSpecialization } from '../../services/api';
import FloatingMedicalBg from '../../components/patient/dashboard/FloatingMedicalBg';

const ManageSpecializations = () => {
  const { specializations, invalidate } = useData();
  const { theme } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const dark = theme === 'dark';

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditing(null);
    setShowForm(false);
  };

  const flash = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { flash('Specialization name is required', 'error'); return; }
    setProcessing(true);
    try {
      if (editing) {
        await updateSpecialization(editing, formData);
        flash('Specialization updated successfully');
      } else {
        await addSpecialization(formData);
        flash('Specialization added successfully');
      }
      await invalidate();
      resetForm();
    } catch (err) {
      flash('Operation failed: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this specialization? This cannot be undone.')) return;
    try {
      await deleteSpecialization(id);
      await invalidate();
      flash('Specialization deleted');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data || err.message || '';
      const msg = typeof serverMsg === 'string' && (serverMsg.includes('constraint') || serverMsg.includes('foreign') || serverMsg.includes('integrity'))
        ? 'Cannot delete: doctors are still assigned to this specialization. Remove or reassign them first.'
        : 'Delete failed: ' + (typeof serverMsg === 'string' ? serverMsg : 'Server error');
      flash(msg, 'error');
    }
  };

  const startEdit = (spec) => {
    const id = spec.specializationId || spec.id;
    setEditing(id);
    setFormData({ name: spec.name || '', description: spec.description || '' });
    setShowForm(true);
  };

  const filteredSpecializations = (specializations || []).filter(spec => {
    const name = (spec.name || '').toLowerCase();
    const desc = (spec.description || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || desc.includes(query);
  });

  const muted = dark ? "#64748b" : "#7c3aed";
  const bg = dark ? "#060b18" : "#f9f8ff";
  const textCol = dark ? "#f1f5f9" : "#1e1b4b";
  const surface = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(139,92,246,0.1)";
  const accent = "#8b5cf6";

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: muted, marginBottom: 8 }}>Administration</p>
            <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em' }}>Manage Specializations</h1>
          </div>
          <button 
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            style={{ 
              background: accent, color: '#fff', padding: '14px 28px', borderRadius: 16, border: 'none',
              fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              boxShadow: `0 10px 25px ${accent}25`
            }}
          >
            {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add Specialization</>}
          </button>
        </div>

        {/* Form Container */}
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            style={{ background: surface, border: `1px solid ${border}`, borderRadius: 28, padding: 32, marginBottom: 40, boxShadow: '0 20px 45px rgba(0,0,0,0.02)' }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>{editing ? 'Edit Specialization' : 'Add New Department'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 12 }}>Specialization Name *</label>
                <input 
                  placeholder="e.g. Cardiology" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  style={{ width: "100%", padding: "16px 20px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 14, color: textCol, fontSize: 15, fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 12 }}>Description</label>
                <input 
                  placeholder="Brief description of clinical scope..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  style={{ width: "100%", padding: "16px 20px", background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 14, color: textCol, fontSize: 15, fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={processing} 
              style={{ 
                background: accent, color: '#fff', padding: '14px 28px', borderRadius: 14, border: 'none',
                fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.7 : 1
              }}
            >
              <Save size={18} /> {processing ? 'Saving...' : (editing ? 'Update Specialization' : 'Create Specialization')}
            </button>
          </motion.form>
        )}

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 360, marginBottom: 24 }}>
          <input 
            placeholder="Search specializations..."
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
            <Search size={18} />
          </span>
        </div>

        {/* Data Table */}
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 32, overflow: "hidden", boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: dark ? "rgba(255,255,255,0.01)" : "rgba(139,92,246,0.02)", borderBottom: `1px solid ${border}` }}>
                <th style={{ padding: "20px 32px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: muted }}>Specialization</th>
                <th style={{ padding: "20px 32px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: muted }}>Description</th>
                <th style={{ padding: "20px 32px", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", color: muted, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecializations.map((spec, index) => {
                const id = spec.specializationId || spec.id;
                return (
                  <tr key={id} style={{ borderBottom: index < filteredSpecializations.length - 1 ? `1px solid ${border}` : "none", transition: "all 0.2s" }} className="hover-row">
                    <td style={{ padding: "24px 32px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}10`, color: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Stethoscope size={20} />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 16 }}>{spec.name}</span>
                    </td>
                    <td style={{ padding: "24px 32px", color: dark ? "#94a3b8" : "#475569", fontWeight: 600 }}>{spec.description || '—'}</td>
                    <td style={{ padding: "24px 32px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 10 }}>
                        <button 
                          onClick={() => startEdit(spec)} 
                          style={{ padding: 10, color: accent, background: `${accent}10`, border: "none", borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(id)} 
                          style={{ padding: 10, color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!filteredSpecializations || filteredSpecializations.length === 0) && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "60px 0", color: muted }}>
                    <Stethoscope size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>No specializations configured. Add one above.</p>
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

export default ManageSpecializations;
