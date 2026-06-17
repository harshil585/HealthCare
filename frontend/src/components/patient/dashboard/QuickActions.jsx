import { Stethoscope, CalendarPlus, Clock, UserCircle, Building2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  { title: 'Book Appointment', desc: 'Schedule a visit with a doctor', icon: CalendarPlus, to: '/patient/search',
    color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { title: 'Find Doctors', desc: 'Search by specialization', icon: Stethoscope, to: '/patient/search',
    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { title: 'My Appointments', desc: 'View upcoming & past visits', icon: Clock, to: '/patient/appointments',
    color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  { title: 'Search Hospitals', desc: 'Find hospitals near you', icon: Building2, to: '/patient/hospitals',
    color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { title: 'Update Profile', desc: 'Manage your information', icon: UserCircle, to: '/patient/profile',
    color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { title: 'Browse Specializations', desc: 'Explore all departments', icon: Search, to: '/patient/search',
    color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
];

const QuickActions = () => (
  <div className="py-16">
    <div className="text-center mb-16 space-y-3">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-widest">Why Choose HealthCare+</h2>
      <p className="text-slate-500 dark:text-slate-400 font-medium">Online Appointment, Phone-in Appointment, Walk-in Appointment with Token</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {actions.slice(0, 3).map((a) => {
        const Icon = a.icon;
        return (
          <Link
            key={a.title}
            to={a.to}
            className="flex flex-col items-center text-center p-12 rounded-[40px] bg-white dark:bg-[#0a0a20] border border-slate-100 dark:border-slate-800 hover:border-[#00bef8]/50 transition-all group shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_rgba(0,190,248,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00bef8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center mb-10 bg-slate-50 dark:bg-white/5 text-[#00bef8] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
              <Icon size={56} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-xl font-black text-[#00bef8] uppercase tracking-tight mb-4 group-hover:tracking-widest transition-all duration-300">
              {a.title}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
              {a.desc}
            </p>

            <div className="mt-8 p-3 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-[#00bef8] group-hover:bg-[#00bef8]/10 transition-all">
              <Icon size={20} />
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);

export default QuickActions;
