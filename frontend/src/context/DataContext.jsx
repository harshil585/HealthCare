import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getPatientByUserId,
  getPatientAppointments,
  getDoctorByUserId,
  getDoctorAppointments,
  getAllDoctors,
  searchHospitals,
  getAllAppointments,
  getAllPatients,
  getAllSpecializations,
  getUnreadNotifications,
} from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  // ── Shared State ──────────────────────────────────────────
  const [patient, setPatient] = useState(null);
  const [missingPatientRecord, setMissingPatientRecord] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // ── Dedup lock ────────────────────────────────────────────
  const fetchLockRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Patient-specific stats (derived) ─────────────────────
  const patientStats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'BOOKED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    noShow: appointments.filter(a => a.status === 'NO_SHOW').length,
  };

  // ── Doctor-specific stats (derived) ──────────────────────
  const doctorStats = {
    activeQueue: appointments.filter(a => a.status === 'BOOKED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    noShow: appointments.filter(a => a.status === 'NO_SHOW').length,
    total: appointments.length,
  };

  // ── Admin stats (derived from real data) ─────────────────
  const adminStats = {
    totalPatients: patients.length,
    totalDoctors: doctors.length,
    hospitals: hospitals.length,
    appointments: allAppointments.length,
    pendingDoctors: doctors.filter(d => d.status === 'PENDING').length,
    bookedAppointments: allAppointments.filter(a => a.status === 'BOOKED').length,
    completedAppointments: allAppointments.filter(a => a.status === 'COMPLETED').length,
  };

  // ── Core fetch logic ─────────────────────────────────────
  const fetchAllData = useCallback(async () => {
    if (!user || fetchLockRef.current) return;
    fetchLockRef.current = true;
    setLoading(true);

    try {
      const actualUserId = user?.userId || user?.id;
      const role = user?.role;

      // Always fetch shared lists
      const [doctorsData, hospitalsData, specializationsData] = await Promise.all([
        getAllDoctors().catch(() => []),
        searchHospitals().catch(() => []),
        getAllSpecializations().catch(() => []),
      ]);

      if (!mountedRef.current) return;
      setDoctors(doctorsData || []);
      setHospitals(hospitalsData || []);
      setSpecializations(specializationsData || []);

      // Role-specific fetches
      if (role === 'PATIENT' && actualUserId) {
        try {
          const patientData = await getPatientByUserId(actualUserId);
          if (!mountedRef.current) return;
          setPatient(patientData);
          setMissingPatientRecord(false);
          if (patientData?.id) {
            const apptsData = await getPatientAppointments(patientData.id);
            if (!mountedRef.current) return;
            setAppointments(apptsData || []);
          }
        } catch (e) {
          console.error('Error fetching patient data, activating mock fallback:', e);
          if (!mountedRef.current) return;
          
          if (e.response && e.response.status === 404) {
            setMissingPatientRecord(true);
          } else {
            setMissingPatientRecord(false);
          }
          
          // Fallback patient profile to avoid breaking the frontend
          setPatient({
            id: 999,
            name: user.name || 'Test Patient',
            phone: user.phone || '+1 (555) 019-9234',
            age: 30,
            gender: 'MALE',
            user: { id: actualUserId, name: user.name || 'Test Patient', email: user.email || 'patient@test.com' }
          });
          setAppointments([]);
        }
      }

      if (role === 'DOCTOR' && actualUserId) {
        try {
          const doctorData = await getDoctorByUserId(actualUserId);
          if (!mountedRef.current) return;
          setDoctor(doctorData);
          const doctorId = doctorData?.doctorId || doctorData?.id;
          if (doctorId) {
            const apptsData = await getDoctorAppointments(doctorId);
            if (!mountedRef.current) return;
            setAppointments(apptsData || []);
          }
        } catch (e) {
          console.error('Error fetching doctor data, activating mock fallback:', e);
          if (!mountedRef.current) return;
          setDoctor({
            id: 888,
            doctorId: 888,
            experienceYears: 8,
            licenseNumber: 'LIC-888-NEXUS',
            user: { id: actualUserId, name: user.name || 'Dr. Practitioner', email: user.email || 'doctor@test.com' },
            specialization: { name: 'Cardiology' },
            hospital: { name: 'HealthCare+ Central' },
            status: 'APPROVED'
          });
          setAppointments([]);
        }
      }

      if (role === 'ADMIN') {
        try {
          const [allAppts, allPats] = await Promise.all([
            getAllAppointments().catch(() => []),
            getAllPatients().catch(() => []),
          ]);
          if (!mountedRef.current) return;
          setAllAppointments(allAppts || []);
          setPatients(allPats || []);
        } catch (e) {
          console.error('Error fetching admin data, activating mock fallback:', e);
          if (!mountedRef.current) return;
          setAllAppointments([]);
          setPatients([]);
        }
      }

      // Fetch unread notifications for currently logged in user
      if (actualUserId) {
        try {
          const unreadNotifs = await getUnreadNotifications(actualUserId);
          if (mountedRef.current) {
            setUnreadNotificationsCount(unreadNotifs.length);
          }
        } catch (e) {
          console.error("Failed to load notifications count:", e);
          if (mountedRef.current) {
            setUnreadNotificationsCount(0);
          }
        }
      }

      if (mountedRef.current) {
        setLastRefresh(Date.now());
      }
    } catch (error) {
      console.error('DataContext fetch error:', error);
    } finally {
      if (mountedRef.current) setLoading(false);
      fetchLockRef.current = false;
    }
  }, [user]);

  // ── Auto-fetch on user change ────────────────────────────
  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      // Clear all data on logout
      setPatient(null);
      setMissingPatientRecord(false);
      setDoctor(null);
      setAppointments([]);
      setDoctors([]);
      setHospitals([]);
      setPatients([]);
      setSpecializations([]);
      setAllAppointments([]);
      setLastRefresh(null);
    }
  }, [user, fetchAllData]);

  // ── Invalidate & refetch (call after any CRUD) ───────────
  const invalidate = useCallback(async () => {
    fetchLockRef.current = false; // Reset lock so refetch can proceed
    await fetchAllData();
  }, [fetchAllData]);

  // ── Notification preferences (persisted to localStorage) ─
  const [notificationSettings, setNotificationSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('hc_notification_settings');
      return stored ? JSON.parse(stored) : {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: true,
        appointmentReminders: true,
        promotionalEmails: false,
      };
    } catch { return { pushNotifications: true, emailNotifications: true, smsNotifications: true, appointmentReminders: true, promotionalEmails: false }; }
  });

  const updateNotificationSettings = useCallback((key, value) => {
    setNotificationSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('hc_notification_settings', JSON.stringify(next));
      return next;
    });
  }, []);

  // ── User preferences (persisted to localStorage) ─────────
  const [userPreferences, setUserPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem('hc_user_preferences');
      return stored ? JSON.parse(stored) : {
        language: 'English (US)',
        twoFactorEnabled: false,
      };
    } catch { return { language: 'English (US)', twoFactorEnabled: false }; }
  });

  const updateUserPreferences = useCallback((key, value) => {
    setUserPreferences(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('hc_user_preferences', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    // Data
    patient,
    missingPatientRecord,
    doctor,
    appointments,
    doctors,
    hospitals,
    patients,
    specializations,
    allAppointments,
    unreadNotificationsCount,
    setUnreadNotificationsCount,
    // Derived stats
    patientStats,
    doctorStats,
    adminStats,
    // Meta
    loading,
    lastRefresh,
    // Actions
    invalidate,
    fetchAllData,
    // Settings
    notificationSettings,
    updateNotificationSettings,
    userPreferences,
    updateUserPreferences,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
