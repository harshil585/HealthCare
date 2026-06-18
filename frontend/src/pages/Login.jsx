import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, googleLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
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
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'center',
          });
        }
      } catch (err) {
        console.error('Google Sign-In initialization failed:', err);
      }
    };

    // Small delay to ensure GIS script is loaded
    const timer = setTimeout(initGoogleSignIn, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle Google OAuth response
  const handleGoogleResponse = async (response) => {
    if (!response.credential) {
      setError('Google Sign-In failed. Please try again.');
      return;
    }

    setGoogleLoading(true);
    setError('');

    try {
      const result = await googleLogin(response.credential, 'PATIENT');
      const userData = result.user || result;

      if (userData.userId && !userData.id) {
        userData.id = userData.userId;
      }

      const userRole = userData.role || 'PATIENT';
      userData.role = userRole;

      login(userData, result.token || 'mock-jwt-token');

      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (userRole === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Call backend API
      const response = await loginUser(credentials);
      
      // Backend returns the User entity directly with userId field
      const userData = response.user || response;
      
      // Map the backend userId to a consistent field
      if (userData.userId && !userData.id) {
        userData.id = userData.userId;
      }
      
      // If backend doesn't return a role during testing, fallback to PATIENT
      const userRole = userData.role || 'PATIENT';
      userData.role = userRole;

      // Log the user in via Context
      login(userData, response.token || 'mock-jwt-token');
      
      // Redirect based on role
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (userRole === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      // Fallback for mock testing if backend is not fully hooked up
      if (credentials.email === 'admin@test.com') {
        login({ userId: 1, id: 1, name: 'Admin', role: 'ADMIN', email: credentials.email }, 'mock-token');
        navigate('/admin/dashboard');
      } else if (credentials.email === 'doctor@test.com') {
        login({ userId: 2, id: 2, name: 'Test Doctor', role: 'DOCTOR', email: credentials.email }, 'mock-token');
        navigate('/doctor/dashboard');
      } else if (credentials.email === 'patient@test.com') {
        login({ userId: 3, id: 3, name: 'Test Patient', role: 'PATIENT', email: credentials.email }, 'mock-token');
        navigate('/patient/dashboard');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to your HealthCare+ account</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              id="login-email"
              className="input-control" 
              placeholder="Enter your email" 
              value={credentials.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              id="login-password"
              className="input-control" 
              placeholder="Enter your password" 
              value={credentials.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" id="login-submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Google OAuth Divider & Button */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <div className="google-btn-wrapper" ref={googleBtnRef}>
              {/* Google Identity Services renders the button here */}
            </div>
            {googleLoading && (
              <div className="google-loading">
                <div className="spinner"></div>
                <span>Signing in with Google...</span>
              </div>
            )}
          </>
        )}

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
