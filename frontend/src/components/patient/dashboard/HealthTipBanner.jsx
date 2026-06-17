import { Heart, Shield, Stethoscope, Activity, Pill, Brain } from 'lucide-react';

const HealthTipBanner = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 text-white">

    {/* Decorative shapes */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
    <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/[0.03] rounded-full" />

    <div className="relative z-10 p-8 md:p-10">

      {/* Top row: Animated icons */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center animate-float-medium">
          <Heart size={28} />
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center animate-float-slow" style={{ animationDelay: '1s' }}>
          <Shield size={20} className="text-white/80" />
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center animate-float-medium" style={{ animationDelay: '2s' }}>
          <Stethoscope size={20} className="text-white/80" />
        </div>
      </div>

      {/* Main heading */}
      <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
        Your Health, Our Priority
      </h2>
      <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-2xl mb-8">
        Regular check-ups help detect health issues early. Schedule your next appointment 
        and stay on top of your wellness journey. Our network of 500+ expert doctors and 
        50+ hospitals are here to provide you the best care.
      </p>

      {/* Quick stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope size={16} className="text-blue-200" />
            <span className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Doctors</span>
          </div>
          <p className="text-2xl font-bold">500+</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-blue-200" />
            <span className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Specializations</span>
          </div>
          <p className="text-2xl font-bold">40+</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Pill size={16} className="text-blue-200" />
            <span className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Treatments</span>
          </div>
          <p className="text-2xl font-bold">200+</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-blue-200" />
            <span className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">Hospitals</span>
          </div>
          <p className="text-2xl font-bold">50+</p>
        </div>
      </div>

      {/* Health tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Stay Hydrated</p>
            <p className="text-xs text-blue-200 mt-0.5">Drink at least 8 glasses of water daily</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Annual Check-up</p>
            <p className="text-xs text-blue-200 mt-0.5">Schedule your yearly health screening</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Mental Health</p>
            <p className="text-xs text-blue-200 mt-0.5">Take breaks and practice mindfulness</p>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default HealthTipBanner;
