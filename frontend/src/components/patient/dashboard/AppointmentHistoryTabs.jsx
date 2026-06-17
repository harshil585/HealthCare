import { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';

const AppointmentHistoryTabs = ({ appointments, onCancel }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const filtered = appointments.filter(a => {
    if (activeTab === 'upcoming') return a.status === 'BOOKED';
    if (activeTab === 'completed') return a.status === 'COMPLETED';
    if (activeTab === 'cancelled') return a.status === 'CANCELLED';
    return true;
  });

  const handleCancel = async (id) => {
    if (onCancel) await onCancel(id);
  };

  const badge = (status) => {
    const map = {
      BOOKED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      COMPLETED: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      CANCELLED: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    };
    const label = { BOOKED: 'Upcoming', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
    return <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>{label[status]}</span>;
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 pt-6 pb-3 border-b border-slate-100 dark:border-slate-700/50">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Appointment History</h3>
        <div className="flex gap-1">
          {['upcoming', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-h-[400px] overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-10">No {activeTab} appointments.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map(a => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {a.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-white">{a.doctorName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{a.specialization} · {a.hospital}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {a.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {a.startTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {badge(a.status)}
                  {a.status === 'BOOKED' && (
                    <button
                      onClick={() => handleCancel(a.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      title="Cancel Appointment"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistoryTabs;
