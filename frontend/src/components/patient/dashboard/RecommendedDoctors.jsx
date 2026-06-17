import { useState } from 'react';
import { Star, MapPin, Clock, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockSpecializations } from '../../../mockData/patientDashboardData';

const RecommendedDoctors = ({ doctors, onBook }) => {
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.hospital.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specFilter === 'All' || d.specialization === specFilter;
    return matchSearch && matchSpec;
  });

  return (
    <div className="w-full">
      {/* Premium Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6 mb-20 items-center justify-center">
        <div className="relative w-full lg:max-w-xl">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor or hospital..."
            className="w-full pl-16 pr-8 py-5 rounded-[28px] bg-white dark:bg-[#0a0a20] border border-slate-100 dark:border-slate-800 text-lg text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#00bef8] transition-all shadow-sm placeholder-slate-400"
          />
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Filter size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" />
          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="w-full pl-14 pr-10 py-5 rounded-[28px] bg-white dark:bg-[#0a0a20] border border-slate-100 dark:border-slate-800 text-lg text-slate-800 dark:text-white outline-none appearance-none cursor-pointer focus:border-[#00bef8] transition-all shadow-sm font-medium"
          >
            <option value="All">All Specializations</option>
            {mockSpecializations.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Doctor Cards - High Breathing Room */}
      <div className="grid grid-cols-1 gap-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#0a0a20] rounded-[48px] border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">No Professionals Found</p>
          </div>
        ) : filtered.map(doc => (
          <div key={doc.id} className="bg-white dark:bg-[#0a0a20] border border-slate-100 dark:border-slate-800 rounded-[48px] p-12 hover:shadow-[0_40px_100px_rgba(0,190,248,0.08)] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex flex-col lg:flex-row justify-between gap-12 relative z-10">
              <div className="flex items-center gap-10">
                <div className="w-24 h-24 rounded-[32px] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-[#00bef8] text-4xl font-black shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                  {doc.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-[#00bef8] transition-colors">
                      {doc.name}
                    </h3>
                    <span className="px-4 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                      {doc.availability}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-[#00bef8] uppercase tracking-wide mb-3">{doc.specialization}</p>
                  
                  <div className="flex flex-wrap items-center gap-8 text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-2">
                      <MapPin size={18} className="text-[#00bef8]" /> {doc.hospital}
                    </span>
                    <span className="flex items-center gap-2">
                      <Star size={18} className="text-amber-500 fill-amber-500" /> <b className="text-slate-800 dark:text-white">{doc.rating}</b> Verified Reviews
                    </span>
                    <span className="flex items-center gap-2 font-bold uppercase tracking-widest text-[11px] bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-lg">
                      {doc.experience}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 justify-center items-stretch lg:items-end">
                <button
                  onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                  className="px-10 py-5 text-sm font-black text-slate-500 dark:text-slate-400 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-[#00bef8]/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest"
                >
                  {expandedId === doc.id ? 'Hide Availability' : 'View Schedule'}
                </button>
                <button 
                  onClick={() => {
                     if(onBook) onBook(doc.id, 1);
                  }}
                  className="px-12 py-5 text-sm font-black text-white bg-[#00bef8] hover:bg-[#00a8dc] rounded-2xl transition-all shadow-xl shadow-cyan-500/20 uppercase tracking-widest transform active:scale-95">
                  Secure Booking
                </button>
              </div>
            </div>

            {/* Expandable Schedule - Premium Spacing */}
            {expandedId === doc.id && doc.slots && (
              <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Clock size={16} /> Clinical Operating Slots
                </p>
                <div className="flex flex-wrap gap-4">
                  {doc.slots.map((slot, i) => (
                    <button
                      key={i}
                      disabled={!slot.available}
                      className={`px-8 py-4 rounded-xl text-sm font-black transition-all ${
                        slot.available
                          ? 'bg-white dark:bg-transparent text-[#00bef8] border-2 border-slate-100 dark:border-slate-800 hover:border-[#00bef8] hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5 cursor-pointer shadow-sm'
                          : 'bg-slate-50 dark:bg-white/5 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50 border-2 border-transparent'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedDoctors;
