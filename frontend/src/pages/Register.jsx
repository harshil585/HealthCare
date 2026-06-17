import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerPatient, registerDoctor, googleLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    contactNumber: '',
    role: 'PATIENT',
    specializationName: '',
    hospitalName: '',
    experienceYears: '',
    licenseNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleBtnRef = useRef(null);

  // Initialize Google Sign-In button
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || typeof window.google === 'undefined') return;

    const initGoogleSignIn = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'center',
          });
        }
      } catch (err) {
        console.error('Google Sign-In initialization failed:', err);
      }
    };

    const timer = setTimeout(initGoogleSignIn, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle Google OAuth response
  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      setError('Google Sign-Up failed. Please try again.');
      return;
    }

    setGoogleLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await googleLogin(response.credential, formData.role);
      const userData = result.user || result;

      if (userData.userId && !userData.id) {
        userData.id = userData.userId;
      }

      const userRole = userData.role || 'PATIENT';
      userData.role = userRole;

      // Auto-login after Google registration
      login(userData, result.token || 'mock-jwt-token');

      setSuccess('Account created with Google! Redirecting...');
      setTimeout(() => {
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (userRole === 'DOCTOR') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }, 1000);
    } catch (err) {
      console.error('Google registration error:', err);
      setError(err.response?.data?.message || 'Google Sign-Up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (formData.role === 'DOCTOR') {
        await registerDoctor({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password, 
          phone: formData.contactNumber,
          specializationName: formData.specializationName,
          hospitalName: formData.hospitalName,
          experienceYears: parseInt(formData.experienceYears, 10),
          licenseNumber: formData.licenseNumber
        });
      } else {
        await registerPatient({ name: formData.name, email: formData.email, password: formData.password, phone: formData.contactNumber, age: 30, gender: 'OTHER' });
      }
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel register-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join HealthCare+ as a Patient or Doctor today</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Google OAuth Quick Sign-Up */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div className="google-btn-wrapper" ref={googleBtnRef}>
              {/* Google Identity Services renders the button here */}
            </div>
            {googleLoading && (
              <div className="google-loading">
                <div className="spinner"></div>
                <span>Creating account with Google...</span>
              </div>
            )}
            <div className="auth-divider">
              <span>or register with email</span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label>Register As</label>
            <select name="role" id="register-role" className="input-control" value={formData.role} onChange={handleChange}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>

          <div className="form-group-row">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" id="register-name" className="input-control" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Contact Number</label>
              <input type="text" name="contactNumber" id="register-phone" className="input-control" placeholder="+1234567890" value={formData.contactNumber} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group-row">
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" id="register-email" className="input-control" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" id="register-password" className="input-control" placeholder="Minimum 6 characters" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          {formData.role === 'DOCTOR' && (
            <>
              <div className="form-group-row">
                <div className="input-group">
                  <label>Specialization</label>
                  <input type="text" name="specializationName" id="register-spec" className="input-control" placeholder="e.g. Cardiologist" value={formData.specializationName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Hospital Name</label>
                  <input type="text" name="hospitalName" id="register-hospital" className="input-control" placeholder="e.g. City General Hospital" value={formData.hospitalName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group-row">
                <div className="input-group">
                  <label>Years of Experience</label>
                  <input type="number" name="experienceYears" id="register-exp" className="input-control" placeholder="e.g. 5" value={formData.experienceYears} onChange={handleChange} required min="0" />
                </div>
                <div className="input-group">
                  <label>License Number</label>
                  <input type="text" name="licenseNumber" id="register-license" className="input-control" placeholder="e.g. MED-12345" value={formData.licenseNumber} onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          {formData.role === 'PATIENT' && (
            <div className="form-group-row">
              <div className="input-group">
                <label>Address</label>
                <input type="text" name="address" id="register-address" className="input-control" placeholder="123 Health St" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>City</label>
                <input type="text" name="city" id="register-city" className="input-control" placeholder="New York" value={formData.city} onChange={handleChange} required />
              </div>
            </div>
          )}

          <button type="submit" id="register-submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
