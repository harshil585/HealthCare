import { Bell, Moon, Sun, Search as SearchIcon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const DashboardHeader = ({ patient }) => {
  const { theme, toggleTheme } = useTheme();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const firstName = patient?.name ? patient.name.split(' ')[0] : 'Guest';
  const avatar = patient?.name ? patient.name.substring(0, 2).toUpperCase() : 'GU';

  return (
    <header className="relative -mt-10 lg:-mt-14 bg-[#0a0a30] text-white pt-24 pb-48 px-10 lg:px-14 rounded-b-[64px] shadow-2xl">
      {/* Absolute Utility Actions (Top Right) */}
      <div className="absolute top-8 right-8 lg:top-12 lg:right-12 flex items-center gap-4 z-30">
        <button
          onClick={toggleTheme}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-xl shadow-lg"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-[#00bef8] text-white flex items-center justify-center text-lg font-black shadow-lg shadow-cyan-500/20">
            {avatar}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-lg font-bold leading-none">Welcome, {firstName}</p>
            <p className="text-xs font-bold text-cyan-400 mt-1 uppercase tracking-widest">Active Patient Profile</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-24">
          <div className="space-y-4">
            <h1 className="text-7xl lg:text-8xl font-black tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Health, <br /><span className="text-cyan-400">Our Priority.</span>
            </h1>
          </div>
        </div>

        {/* Streamlined Premium Search Bar */}
        <div className="relative group max-w-4xl mt-12">
          <div className="absolute inset-0 bg-cyan-400/30 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative flex items-center bg-white/95 backdrop-blur-md p-3 rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
            <div className="pl-8 pr-4 text-slate-400">
              <SearchIcon size={28} />
            </div>
            <input
              type="text"
              placeholder="Search by Doctor Name, Specialization, or Symptom..."
              className="flex-1 bg-transparent py-5 text-xl text-slate-800 font-medium focus:outline-none placeholder-slate-400"
            />
            <button className="bg-[#00bef8] hover:bg-[#00a8dc] text-white font-black text-xl px-16 py-5 rounded-[32px] transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-cyan-500/40 mr-1">
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
