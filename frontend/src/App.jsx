import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageHospitals from './pages/admin/ManageHospitals';
import ManageSpecializations from './pages/admin/ManageSpecializations';
import VerifyDoctors from './pages/admin/VerifyDoctors';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfileSetup from './pages/doctor/ProfileSetup';
import ManageSlots from './pages/doctor/ManageSlots';
import AppointmentsList from './pages/doctor/AppointmentsList';
import DoctorNotifications from './pages/doctor/Notifications';
import DoctorSettings from './pages/doctor/Settings';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfileSetup from './pages/patient/PatientProfileSetup';
import SearchDoctors from './pages/patient/SearchDoctors';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import PatientNotifications from './pages/patient/Notifications';
import Hospitals from './pages/patient/Hospitals';
import Settings from './pages/patient/Settings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="app-container font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-black min-h-screen transition-colors duration-300">
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navbar /><LandingPage /></>} />
              <Route path="/login" element={<><Navbar /><Login /></>} />
              <Route path="/register" element={<><Navbar /><Register /></>} />

              {/* Protected Routes - ADMIN */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/hospitals" element={<ManageHospitals />} />
                  <Route path="/admin/specializations" element={<ManageSpecializations />} />
                  <Route path="/admin/verify-doctors" element={<VerifyDoctors />} />
                </Route>
              </Route>

              {/* Protected Routes - DOCTOR */}
              <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                  <Route path="/doctor/profile" element={<DoctorProfileSetup />} />
                  <Route path="/doctor/slots" element={<ManageSlots />} />
                  <Route path="/doctor/appointments" element={<AppointmentsList />} />
                  <Route path="/doctor/notifications" element={<DoctorNotifications />} />
                  <Route path="/doctor/settings" element={<DoctorSettings />} />
                </Route>
              </Route>

              {/* Protected Routes - PATIENT */}
              <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/patient/dashboard" element={<PatientDashboard />} />
                  <Route path="/patient/profile" element={<PatientProfileSetup />} />
                  <Route path="/patient/search" element={<SearchDoctors />} />
                  <Route path="/patient/book" element={<BookAppointment />} />
                  <Route path="/patient/book/:id" element={<BookAppointment />} />
                  <Route path="/patient/appointments" element={<MyAppointments />} />
                  <Route path="/patient/notifications" element={<PatientNotifications />} />
                  <Route path="/patient/hospitals" element={<Hospitals />} />
                  <Route path="/patient/settings" element={<Settings />} />
                </Route>
              </Route>

            </Routes>
          </div>
        </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
