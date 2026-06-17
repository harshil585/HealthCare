import { Stethoscope, CalendarCheck, Clock, Users, Activity } from 'lucide-react';

const DoctorBanner = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />

    <div className="relative z-10 p-8 md:p-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center animate-float-medium">
          <Stethoscope size={28} className="text-emerald-100" />
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center animate-float-slow" style={{ animationDelay: '1s' }}>
          <Activity size={20} className="text-white/80" />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">Manage Your Practice Efficiently</h2>
      <p className="text-emerald-100 text-sm md:text-base leading-relaxed max-w-2xl mb-8">
        Keep track of your daily schedule, manage patient consultations, and review your practice analytics all in one place.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Today', value: '8 Appointments', icon: CalendarCheck, color: 'text-emerald-200' },
          { label: 'Total Patients', value: '342', icon: Users, color: 'text-teal-200' },
          { label: 'Pending', value: '2 Approvals', icon: Clock, color: 'text-amber-200' },
          { label: 'Rating', value: '4.9/5.0', icon: Activity, color: 'text-emerald-200' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className={`text-[11px] ${stat.color} font-medium uppercase tracking-wider`}>{stat.label}</span>
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DoctorBanner;
