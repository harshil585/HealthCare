import { CalendarPlus, UserCircle, CheckCircle } from 'lucide-react';

const ActivityTimeline = ({ activities }) => {
  const iconMap = {
    booking: { icon: CalendarPlus, color: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
    profile: { icon: UserCircle, color: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
    consultation: { icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((a) => {
          const config = iconMap[a.type] || iconMap.booking;
          return (
            <div key={a.id} className="flex items-start gap-3">
              <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{a.title}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{a.description}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-wide font-medium">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
