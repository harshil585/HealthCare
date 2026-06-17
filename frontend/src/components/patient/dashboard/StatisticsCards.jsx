import { Calendar, CalendarCheck, CalendarX, Activity } from 'lucide-react';

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white dark:bg-[#0a0a20] rounded-[40px] border border-slate-100 dark:border-white/5 p-8 hover:shadow-3xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[220px]">
    {/* Layered Background Element */}
    <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${color.text.replace('text-', 'bg-')}`} />

    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color.bg} group-hover:scale-110 transition-transform mb-6 ring-4 ring-slate-50 dark:ring-white/5`}>
        <Icon size={24} className={color.text} />
      </div>
      <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
    </div>

    <div className="relative z-10 mt-4 pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
      <span className={`text-[10px] font-black uppercase tracking-widest ${color.text}`}>
        {trend}
      </span>
      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Activity size={12} className="text-slate-400" />
      </div>
    </div>
  </div>
);

const StatisticsCards = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    <StatCard title="Total Visits" value={stats.totalAppointments} trend={stats.trends.total}
      icon={Activity} color={{ bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' }} />
    <StatCard title="Upcoming" value={stats.upcomingAppointments} trend={stats.trends.upcoming}
      icon={Calendar} color={{ bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' }} />
    <StatCard title="Completed" value={stats.completedAppointments} trend={stats.trends.completed}
      icon={CalendarCheck} color={{ bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' }} />
    <StatCard title="Cancelled" value={stats.cancelledAppointments} trend={stats.trends.cancelled}
      icon={CalendarX} color={{ bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' }} />
  </div>
);

export default StatisticsCards;
