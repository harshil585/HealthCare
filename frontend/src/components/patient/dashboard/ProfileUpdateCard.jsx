import { useState } from 'react';
import { User, Mail, Phone, Droplet, Save, X } from 'lucide-react';

const ProfileUpdateCard = ({ patient }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: patient.name, email: patient.email, phone: patient.phone,
    age: patient.age, gender: patient.gender, bloodGroup: patient.bloodGroup
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
            {patient.avatar}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{patient.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{patient.age} yrs · {patient.gender}</p>
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            editing
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {editing ? <span className="flex items-center gap-1"><X size={14} /> Cancel</span> : 'Edit Profile'}
        </button>
      </div>

      <div className="p-6">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Profile Completion</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{patient.profileCompletion}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <div className="h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${patient.profileCompletion}%` }} />
          </div>
        </div>

        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', name: 'name', icon: User },
              { label: 'Email', name: 'email', icon: Mail },
              { label: 'Phone', name: 'phone', icon: Phone },
              { label: 'Age', name: 'age', icon: User },
              { label: 'Gender', name: 'gender', icon: User },
              { label: 'Blood Group', name: 'bloodGroup', icon: Droplet },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.name}>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">{f.label}</label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2.5 border border-slate-200 dark:border-slate-700">
                    <Icon size={14} className="text-slate-400 flex-shrink-0" />
                    <input
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      className="bg-transparent text-sm text-slate-700 dark:text-slate-200 w-full outline-none"
                    />
                  </div>
                </div>
              );
            })}
            <div className="md:col-span-2 pt-2">
              <button
                onClick={() => setEditing(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Email', value: patient.email, icon: Mail },
              { label: 'Phone', value: patient.phone, icon: Phone },
              { label: 'Age', value: `${patient.age} years`, icon: User },
              { label: 'Gender', value: patient.gender, icon: User },
              { label: 'Blood Group', value: patient.bloodGroup, icon: Droplet },
            ].map(f => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Icon size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">{f.label}</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{f.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileUpdateCard;
