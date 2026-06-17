import { Shield, Users, Building2, Server, CheckCircle, Activity } from 'lucide-react';

const AdminBanner = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />

    <div className="relative z-10 p-8 md:p-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center animate-float-medium">
          <Shield size={28} className="text-purple-300" />
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center animate-float-slow" style={{ animationDelay: '1s' }}>
          <Server size={20} className="text-white/80" />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">System Overview & Management</h2>
      <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mb-8">
        Monitor system health, verify new healthcare professionals, and manage the platform's infrastructure efficiently. Everything is running smoothly.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Users', value: '1,500+', icon: Users, color: 'text-blue-300' },
          { label: 'Hospitals', value: '12', icon: Building2, color: 'text-purple-300' },
          { label: 'Uptime', value: '99.9%', icon: Activity, color: 'text-emerald-300' },
          { label: 'Verifications', value: '2 Pending', icon: CheckCircle, color: 'text-amber-300' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className={`text-[11px] ${stat.color} font-medium uppercase tracking-wider`}>{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminBanner;
