import { UserCheck, Building2, Stethoscope, Users, Settings, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  { title: 'Verify Doctors', desc: 'Review pending applications', icon: UserCheck, to: '/admin/verify-doctors',
    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { title: 'Manage Hospitals', desc: 'Add or update hospitals', icon: Building2, to: '/admin/hospitals',
    color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { title: 'Specializations', desc: 'Manage medical departments', icon: Stethoscope, to: '/admin/specializations',
    color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { title: 'User Management', desc: 'View all platform users', icon: Users, to: '#',
    color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { title: 'System Settings', desc: 'Configure platform', icon: Settings, to: '#',
    color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  { title: 'Database Logs', desc: 'View system activity logs', icon: Database, to: '#',
    color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
];

const AdminQuickActions = () => (
  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Quick Actions</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage platform operations</p>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {actions.map((a) => {
        const Icon = a.icon;
        return (
          <Link
            key={a.title}
            to={a.to}
            className="flex flex-col items-center text-center p-5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${a.bg} ${a.color} group-hover:scale-110 transition-transform`}>
              <Icon size={26} />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{a.title}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">{a.desc}</span>
          </Link>
        );
      })}
    </div>
  </div>
);

export default AdminQuickActions;
