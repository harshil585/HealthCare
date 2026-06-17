import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const UpcomingAppointmentCard = ({ appointment }) => {
  if (!appointment) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-8 bg-slate-50/50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center">
          <Calendar size={48} className="text-slate-300 dark:text-slate-600" />
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">No Upcoming Updates</h3>
          <p className="text-lg text-slate-400 dark:text-slate-500 max-w-sm mx-auto">Your medical schedule is currently clear. Book a consultation to see updates here.</p>
        </div>
        <Link to="/patient/search" className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
          Book Now <Clock size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a20] rounded-[40px] overflow-hidden">
      {/* Decorative Top Accent */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 w-full" />

      <div className="p-12 flex-1 flex flex-col justify-between">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="space-y-8 flex-1">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                Confirmed Appointment
              </span>
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20">
                Virtual Visit
              </span>
            </div>

            <div className="flex items-start gap-8">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-500/30 ring-8 ring-blue-500/5">
                {appointment.avatar}
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{appointment.doctorName}</p>
                <p className="text-xl text-blue-600 dark:text-blue-400 font-bold mb-4">{appointment.specialization}</p>
                <p className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-medium italic text-lg">
                  <MapPin size={20} /> {appointment.hospital}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto bg-slate-50 dark:bg-white/5 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 space-y-6 min-w-[280px]">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Scheduled Date</p>
              <div className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white">
                <Calendar className="text-blue-600" size={24} />
                {appointment.date}
              </div>
            </div>
            <div className="h-px bg-slate-200 dark:bg-white/10 w-full" />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Start Time</p>
              <div className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white">
                <Clock className="text-blue-600" size={24} />
                {appointment.startTime}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-6">
          <button className="flex-1 py-6 rounded-[24px] text-lg font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10">
            Reschedule or Cancel Visit
          </button>
          <button
            onClick={() => {
              if (appointment.onJoinVideo) appointment.onJoinVideo(appointment.id, appointment.doctorName);
            }}
            className="flex-1 py-6 rounded-[24px] text-lg font-black text-white bg-[#00bef8] hover:bg-[#00a8dc] transition-all shadow-2xl shadow-cyan-500/30 flex items-center justify-center gap-4 group"
          >
            <div className="w-3 h-3 rounded-full bg-white animate-ping" />
            Join Virtual Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointmentCard;
