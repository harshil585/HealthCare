import { Mail, Phone, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileSummaryCard = ({ patient }) => (
  <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Profile</h3>
      <Link to="/patient/profile" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">Edit</Link>
    </div>

    <div className="text-center mb-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold mb-3">
        {patient.avatar}
      </div>
      <p className="text-base font-semibold text-slate-800 dark:text-white">{patient.name}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{patient.age} yrs · {patient.gender}</p>
    </div>

    {/* Progress */}
    <div className="mb-4">
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-slate-500 dark:text-slate-400">Profile Completion</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">{patient.profileCompletion}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
        <div className="h-1.5 bg-blue-600 rounded-full transition-all" style={{ width: `${patient.profileCompletion}%` }} />
      </div>
    </div>

    {/* Contact */}
    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
      <div className="flex items-center gap-2.5">
        <Mail size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{patient.email}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <Phone size={14} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <span className="text-xs text-slate-600 dark:text-slate-300">{patient.phone}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <Droplet size={14} className="text-red-400 flex-shrink-0" />
        <span className="text-xs text-slate-600 dark:text-slate-300">Blood: <strong>{patient.bloodGroup}</strong></span>
      </div>
    </div>
  </div>
);

export default ProfileSummaryCard;
