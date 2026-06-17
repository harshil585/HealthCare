import { Clock, Video, MapPin, CheckCircle } from 'lucide-react';

const TodaysAppointmentsCard = ({ schedule }) => (
  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    <div className="px-6 pt-6 pb-3 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Today's Schedule</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upcoming patient consultations</p>
      </div>
      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg">
        {schedule.length} Appointments
      </span>
    </div>

    <div className="p-6">
      {schedule.length === 0 ? (
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-10">No appointments scheduled for today.</p>
      ) : (
        <div className="space-y-4">
          {schedule.map(app => (
            <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {app.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white">{app.patientName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{app.reason}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400"><Clock size={11} /> {app.time}</span>
                    <span className="flex items-center gap-1">
                      {app.type === 'Video Consult' ? <Video size={11} className="text-purple-500" /> : <MapPin size={11} className="text-emerald-500" />} 
                      {app.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {app.status === 'Pending' ? (
                  <button className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                    Start Consult
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={14} /> Upcoming
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default TodaysAppointmentsCard;
