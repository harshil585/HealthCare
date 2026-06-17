import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DynamicBackground from './DynamicBackground';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

const DashboardLayout = () => {
  const location = useLocation();
  const isPatient = location.pathname.includes('/patient');
  const isDoctor = location.pathname.includes('/doctor');
  const isAdmin = location.pathname.includes('/admin');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { missingPatientRecord } = useData();

  if (isPatient && missingPatientRecord && location.pathname !== '/patient/profile') {
    return <Navigate to="/patient/profile" replace />;
  }

  return (
    <div className={`flex h-screen overflow-hidden font-[Inter,sans-serif] transition-colors duration-200 ${
      isPatient
        ? (isDark ? 'bg-[#060b18] text-[#f1f5f9]' : 'bg-[#f0f5ff] text-[#0f172a]')
        : isDoctor
          ? (isDark ? 'bg-[#060b18] text-[#f1f5f9]' : 'bg-[#f0fdf4] text-[#064e3b]')
          : (isDark ? 'bg-[#060b18] text-[#f1f5f9]' : 'bg-[#f9f8ff] text-[#1e1b4b]')
    }`}>
      <Sidebar />
      <div className={`flex-1 overflow-y-auto scroll-smooth scrollbar-thin transition-colors duration-200 ${
        isPatient
          ? (isDark ? 'bg-[#060b18]' : 'bg-[#f0f5ff]')
          : isDoctor
            ? (isDark ? 'bg-[#060b18]' : 'bg-[#f0fdf4]')
            : (isDark ? 'bg-[#060b18]' : 'bg-[#f9f8ff]')
      }`}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
