import { mockSpecializations } from '../../../mockData/patientDashboardData';

const SpecializationsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {mockSpecializations.slice(0, 6).map((spec) => (
      <button
        key={spec.name}
        className="flex items-center gap-8 p-10 rounded-[40px] bg-white dark:bg-[#0a0a20] border border-slate-100 dark:border-slate-800 hover:border-[#00bef8]/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all group text-left relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
          {spec.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-1 group-hover:text-[#00bef8] transition-colors">
            {spec.name}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Specialized {spec.name.toLowerCase()} care and treatment workflows.
          </p>
        </div>
      </button>
    ))}
  </div>
);

export default SpecializationsGrid;
