import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const FullCalendarWidget = ({ appointments = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  // Theme-consistent colors
  const surface = dark ? '#0d1526' : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(37,99,235,0.1)';
  const textCol = dark ? '#f1f5f9' : '#0f172a';
  const muted = dark ? '#64748b' : '#94a3b8';
  const accent = '#2563eb';
  const bgMain = dark ? '#060b18' : '#f0f5ff';
  const cellBg = dark ? '#0a1020' : '#fafbff';
  const cellBorder = dark ? 'rgba(255,255,255,0.04)' : 'rgba(37,99,235,0.06)';

  // Month navigation helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Map external live appointments into our array safely filtered by year/month
  const mappedEvents = [];
  appointments.forEach((appt) => {
    const dateStr = appt.slot?.slotDate || appt.date;
    if (dateStr && typeof dateStr === 'string') {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const apptYear = parseInt(parts[0], 10);
        const apptMonth = parseInt(parts[1], 10) - 1; // JS month is 0-indexed
        const apptDay = parseInt(parts[2], 10);
        
        if (apptYear === year && apptMonth === month && !isNaN(apptDay)) {
          const docName = appt.doctor?.user?.name || appt.doctorName || 'Doctor';
          const specName = appt.doctor?.specialization?.name || appt.specialization || 'Consultation';
          mappedEvents.push({
            id: appt.id,
            day: apptDay,
            title: `Dr. ${docName} - ${specName}`,
            time: appt.slot?.startTime || appt.startTime || "TBD",
            type: appt.status === 'COMPLETED' ? 'completed' : appt.status === 'CANCELLED' ? 'cancelled' : 'booked'
          });
        }
      }
    }
  });

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const renderCells = () => {
    const cells = [];
    
    // Blank padding placeholders for offset start days
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div key={`empty-${i}`} style={{ height: 80, background: cellBg, borderBottom: `1px solid ${cellBorder}`, borderRight: `1px solid ${cellBorder}`, opacity: 0.3 }} />
      );
    }

    // Active calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = mappedEvents.filter(e => e.day === day);
      const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

      cells.push(
        <div
          key={day}
          onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
          style={{
            height: 80,
            padding: 4,
            borderBottom: `1px solid ${cellBorder}`,
            borderRight: `1px solid ${cellBorder}`,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            cursor: dayEvents.length > 0 ? 'pointer' : 'default',
            background: isToday ? (dark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.04)') : cellBg,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { if (dayEvents.length > 0) e.currentTarget.style.background = dark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = isToday ? (dark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.04)') : cellBg; }}
        >
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: 20,
            alignSelf: 'flex-start',
            ...(isToday ? { background: accent, color: '#fff' } : { color: textCol })
          }}>
            {day}
          </span>

          {/* Event Chip mapping */}
          <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflow: 'hidden' }}>
            {dayEvents.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  ...(ev.type === 'booked'
                    ? { background: accent, color: '#fff' }
                    : ev.type === 'completed'
                      ? { background: dark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)', color: '#22c55e', textDecoration: 'line-through' }
                      : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', textDecoration: 'line-through' }
                  )
                }}
                title={`${ev.time} - ${ev.title}`}
              >
                {ev.time?.substring?.(0, 5) || ev.time} {ev.title.split(' - ')[0]}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div style={{ background: surface, borderRadius: 32, border: `1px solid ${border}`, padding: 24, overflow: 'hidden' }}>
      {/* Header View Controller */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: 8, borderRadius: 10, background: `${accent}10`, color: accent }}>
            <CalendarIcon size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 900, color: textCol, margin: 0 }}>Health Calendar</h3>
            <p style={{ fontSize: 11, color: muted, margin: 0 }}>Monthly appointment schedule</p>
          </div>
        </div>

        {/* Date navigators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: textCol, minWidth: 120, textAlign: 'right' }}>
            {monthNames[month]} {year}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${border}`, borderRadius: 10, overflow: 'hidden', background: bgMain }}>
            <button onClick={prevMonth} style={{ padding: 6, background: 'none', border: 'none', color: muted, cursor: 'pointer', display: 'flex' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} style={{ padding: '4px 10px', fontSize: 11, fontWeight: 800, color: accent, background: 'none', border: 'none', borderLeft: `1px solid ${border}`, borderRight: `1px solid ${border}`, cursor: 'pointer' }}>
              Today
            </button>
            <button onClick={nextMonth} style={{ padding: 6, background: 'none', border: 'none', color: muted, cursor: 'pointer', display: 'flex' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: `1px solid ${cellBorder}`, borderLeft: `1px solid ${cellBorder}`, borderRadius: '12px 12px 0 0', overflow: 'hidden', background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(37,99,235,0.02)' }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} style={{ padding: '8px 0', textAlign: 'center', borderBottom: `1px solid ${cellBorder}`, borderRight: `1px solid ${cellBorder}`, fontSize: 10, fontWeight: 900, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {dayName}
          </div>
        ))}
      </div>

      {/* Grid blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: `1px solid ${cellBorder}`, borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
        {renderCells()}
      </div>

      {/* Tooltip Popup Viewer */}
      {selectedEvent && (
        <div style={{
          marginTop: 16,
          padding: 14,
          background: dark ? 'rgba(37,99,235,0.05)' : 'rgba(37,99,235,0.03)',
          border: `1px solid ${border}`,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
            <div style={{ padding: 8, borderRadius: 10, background: surface, border: `1px solid ${border}`, color: accent, flexShrink: 0 }}>
              <User size={14} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: textCol, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                {selectedEvent.title}
              </p>
              <p style={{ fontSize: 10, color: muted, display: 'flex', alignItems: 'center', gap: 4, margin: '2px 0 0' }}>
                <Clock size={10} /> {monthNames[month]} {selectedEvent.day}, {year} at {selectedEvent.time?.substring?.(0, 5) || selectedEvent.time}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedEvent(null)}
            style={{
              padding: '6px 14px',
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 800,
              color: muted,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default FullCalendarWidget;
