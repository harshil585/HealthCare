import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { mockAdmin, mockAdminNotifications } from '../../../mockData/adminDashboardData';

const AdminHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const unreadCount = mockAdminNotifications.filter(n => !n.read).length;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const firstName = mockAdmin.name.split(' ')[0];

  return (
    <header className="relative w-screen left-1/2 right-1/2 -ml-[50vw] +ml-[50vw] bg-[#0a0a30] text-white pt-16 pb-24 px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight uppercase">
              System Dashboard
            </h1>
            <p className="text-xl text-purple-300/80 font-medium tracking-wide italic">
              HealthCare+ Administrative Console · Global Network Operations
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-xl shadow-lg"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-[#9333ea] text-white flex items-center justify-center text-lg font-black shadow-lg shadow-purple-500/20 uppercase">
                {mockAdmin.avatar}
              </div>
              <div>
                <p className="text-lg font-bold leading-none">Welcome, {firstName}</p>
                <p className="text-xs font-bold text-purple-400 mt-1 uppercase tracking-widest">System Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Global Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/5 p-3 rounded-[32px] backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="bg-white rounded-3xl p-4 flex flex-col justify-center md:col-span-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 ml-1">Search All Records</span>
            <input type="text" placeholder="e.g. Doctor License, Patient ID, or Hospital Name" className="bg-transparent text-slate-800 font-bold focus:outline-none text-base placeholder-slate-300" />
          </div>
          <button className="bg-[#9333ea] hover:bg-[#7e22ce] text-white font-black text-lg py-5 rounded-[24px] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-purple-500/30">
            Global Search
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
