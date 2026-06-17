import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard, Building2, Stethoscope, CalendarCheck,
  UserCircle, LogOut, Clock, Settings, HeartPulse, Bell
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { adminStats, doctorStats, patientStats, doctor, unreadNotificationsCount } = useData();
  const location = useLocation();
  if (!user) return null;

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hospitals', path: '/admin/hospitals', icon: Building2 },
    { name: 'Specializations', path: '/admin/specializations', icon: Stethoscope },
    { name: 'Verify Doctors', path: '/admin/verify-doctors', icon: UserCircle },
  ];
  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/doctor/profile', icon: UserCircle },
    ...(doctor?.status === 'APPROVED' ? [
      { name: 'Manage Slots', path: '/doctor/slots', icon: Clock },
      { name: 'Appointments', path: '/doctor/appointments', icon: CalendarCheck },
      { name: 'Alerts', path: '/doctor/notifications', icon: Bell },
      { name: 'Settings', path: '/doctor/settings', icon: Settings },
    ] : [])
  ];
  const patientLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Find Expert', path: '/patient/search', icon: Stethoscope },
    { name: 'Schedule Visit', path: '/patient/book', icon: CalendarCheck },
    { name: 'My Activity', path: '/patient/appointments', icon: Clock },
    { name: 'Hospitals', path: '/patient/hospitals', icon: Building2 },
    { name: 'Alerts', path: '/patient/notifications', icon: Bell },
    { name: 'My Profile', path: '/patient/profile', icon: UserCircle },
    { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  let links = [];
  if (user.role === 'ADMIN') links = adminLinks;
  else if (user.role === 'DOCTOR') links = doctorLinks;
  else if (user.role === 'PATIENT') links = patientLinks;

  return (
    <aside className="group w-[72px] hover:w-60 transition-all duration-300 ease-in-out h-screen flex-shrink-0 flex flex-col
      bg-white dark:bg-[#0a0a20] border-r border-slate-100 dark:border-white/5 z-50">

      {/* Logo Area */}
      <div className="h-[80px] flex items-center border-b border-slate-50 dark:border-white/5 overflow-hidden">
        <div className="w-[72px] flex items-center justify-center flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#00bef8]/10 flex items-center justify-center shadow-lg shadow-[#00bef8]/5">
            <HeartPulse className="text-[#00bef8]" size={26} />
          </div>
        </div>
        <span className="ml-1 text-2xl font-black text-slate-800 dark:text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
          Health<span className="text-[#00bef8]">Care+</span>
        </span>
      </div>
      {/* Nav */}
      <nav className="flex-1 py-4 space-y-2 overflow-x-hidden overflow-y-auto px-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          let badge = null;
          if (link.name === 'Verify Doctors' && adminStats?.pendingDoctors > 0) {
            badge = adminStats.pendingDoctors;
          } else if (link.name === 'Appointments' && doctorStats?.activeQueue > 0) {
            badge = doctorStats.activeQueue;
          } else if (link.name === 'My Activity' && patientStats?.upcoming > 0) {
            badge = patientStats.upcoming;
          } else if (link.name === 'Alerts' && unreadNotificationsCount > 0) {
            badge = unreadNotificationsCount;
          }

          return (
            <Link
              key={link.path}
              to={link.path}
              title={link.name}
              className={`flex items-center h-[52px] rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#00bef8] text-white shadow-lg shadow-[#00bef8]/20 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {/* Icon fills the collapsed sidebar */}
              <div className="w-[56px] flex items-center justify-center flex-shrink-0 relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {badge && (
                  <span className="absolute top-1 right-2 w-4.5 h-4.5 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border border-white dark:border-[#0a0a20]">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-sm font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-1 flex items-center justify-between pr-4">
                <span>{link.name}</span>
                {badge && (
                  <span className="bg-rose-500/10 text-rose-500 text-xs font-black px-2.5 py-0.5 rounded-full ml-2">
                    {badge}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-100 dark:border-slate-700/50">
        <button
          onClick={logout}
          className="flex items-center h-[52px] w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <div className="w-[72px] flex items-center justify-center flex-shrink-0">
            <LogOut size={26} />
          </div>
          <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
