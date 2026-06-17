import { CheckCircle, XCircle, Clock } from 'lucide-react';

const PendingVerificationsList = ({ doctors }) => (
  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="px-6 pt-6 pb-3 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pending Verifications</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review doctor applications</p>
      </div>
    </div>

    <div className="p-6">
      {doctors.length === 0 ? (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-10">No pending verifications.</p>
      ) : (
        <div className="space-y-4">
          {doctors.map(doc => (
            <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 text-sm font-bold flex-shrink-0">
                  {doc.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white">{doc.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{doc.specialization} · {doc.experience}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 dark:text-amber-400 font-medium">
                    <Clock size={11} /> Applied: {doc.dateApplied}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                  <CheckCircle size={14} /> Approve
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default PendingVerificationsList;
