import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'mock-jwt-token' && token !== 'mock-token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerPatient = async (patientData) => {
  const response = await api.post('/auth/patient/register', patientData);
  return response.data;
};

export const registerDoctor = async (doctorData) => {
  const response = await api.post('/auth/doctor/register', doctorData);
  return response.data;
};

export const googleLogin = async (idToken, role = 'PATIENT') => {
  const response = await api.post('/auth/google', { idToken, role });
  return response.data;
};

export const searchHospitals = async () => {
    // In future this would take query params, currently returns all
    const response = await api.get('/hospital');
    return response.data;
}

export const getPatientByUserId = async (userId) => {
    const response = await api.get(`/patient/user/${userId}`);
    return response.data;
};

export const getDoctorByUserId = async (userId) => {
    const response = await api.get(`/doctor/user/${userId}`);
    return response.data;
};

export const getPatientAppointments = async (patientId) => {
    const response = await api.get(`/appointment/patient/${patientId}`);
    return response.data;
};

export const getDoctorAppointments = async (doctorId) => {
    const response = await api.get(`/appointment/doctor/${doctorId}`);
    return response.data;
};

export const getAllDoctors = async () => {
    const response = await api.get('/doctor');
    return response.data;
};

export const cancelAppointment = async (appointmentId) => {
    const response = await api.delete(`/appointment/${appointmentId}`);
    return response.data;
};

export const completeAppointment = async (appointmentId) => {
    const response = await api.put(`/appointment/${appointmentId}/complete`);
    return response.data;
};

export const bookAppointment = async (patientId, doctorId, slotId, symptoms = '', medicalHistoryPdf = '') => {
    const response = await api.post(`/appointment/book?patientId=${patientId}&doctorId=${doctorId}&slotId=${slotId}&symptoms=${encodeURIComponent(symptoms)}&medicalHistoryPdf=${encodeURIComponent(medicalHistoryPdf)}`);
    return response.data;
};

export const updatePatientProfile = async (patientId, patientData) => {
    const response = await api.put(`/patient/${patientId}`, patientData);
    return response.data;
};

export const updateDoctorProfile = async (doctorId, doctorData) => {
    const response = await api.put(`/doctor/${doctorId}`, doctorData);
    return response.data;
};

// 🔥 IN-APP REVIEWS
export const addReview = async (patientId, doctorId, rating, reviewText = '') => {
    const response = await api.post(`/review/add?patientId=${patientId}&doctorId=${doctorId}&rating=${rating}&reviewText=${encodeURIComponent(reviewText)}`);
    return response.data;
};

export const getDoctorReviews = async (doctorId) => {
    const response = await api.get(`/review/doctor/${doctorId}`);
    return response.data;
};

export const getPatientReviews = async (patientId) => {
    const response = await api.get(`/review/patient/${patientId}`);
    return response.data;
};

// 🔥 IN-APP NOTIFICATIONS
export const getUserNotifications = async (userId) => {
    const response = await api.get(`/notification/user/${userId}`);
    return response.data;
};

export const getUnreadNotifications = async (userId) => {
    const response = await api.get(`/notification/user/${userId}/unread`);
    return response.data;
};

export const markNotificationAsRead = async (id) => {
    const response = await api.put(`/notification/${id}/read`);
    return response.data;
};

export const markAllNotificationsAsRead = async (userId) => {
    const response = await api.put(`/notification/user/${userId}/read-all`);
    return response.data;
};

// 🔥 ENTERPRISE INTEGRATIONS API HELPERS

export const analyzeSymptomsAI = async (symptoms) => {
    try {
        const response = await api.post('/integration/ai/analyze', { symptoms });
        return response.data;
    } catch (error) {
        console.error("AI Analysis failed, utilizing offline fallback rules", error);
        // Fallback mapping if backend server is unreachable
        return {
            symptomsAnalyzed: symptoms,
            recommendedSpecialization: "General Physician",
            advice: "Please consult a registered physician for detailed evaluation.",
            urgencyLevel: "NORMAL",
            aiProvider: "Client Fallback Engine"
        };
    }
};

export const updateAppointmentMeetingUrl = async (appointmentId, meetingUrl) => {
    const response = await api.put(`/appointment/${appointmentId}/meeting?meetingUrl=${encodeURIComponent(meetingUrl)}`);
    return response.data;
};

export const updateAppointmentSummary = async (appointmentId, summary) => {
    const response = await api.put(`/appointment/${appointmentId}/summary`, summary, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
    return response.data;
};

// 🔥 PHASE 2 ENTERPRISE API WRAPPERS

export const createRazorpayOrder = async (amount, currency = 'INR') => {
    const response = await api.post('/integration/payment/create', { amount, currency });
    return response.data;
};

export const verifyRazorpayPayment = async (orderId, paymentId, signature) => {
    const response = await api.post('/integration/payment/verify', { orderId, paymentId, signature });
    return response.data;
};

export const dispatchNotification = async (phone, email, message) => {
    const response = await api.post('/integration/notify', { phone, email, message });
    return response.data;
};

export const fetchCloudinaryConfig = async () => {
    const response = await api.get('/integration/cloudinary/config');
    return response.data;
};

// 🔥 RECURRING AVAILABILITY & SLOT SLIDING ENGINE
export const getDoctorSlots = async (doctorId) => {
    const response = await api.get(`/slot/doctor/${doctorId}`);
    return response.data;
};

export const getAvailableSlots = async (doctorId) => {
    const response = await api.get(`/slot/available/${doctorId}`);
    return response.data;
};

export const deleteSlot = async (slotId) => {
    await api.delete(`/slot/${slotId}`);
};

export const getDoctorAvailabilities = async (doctorId) => {
    const response = await api.get(`/slot/availability/doctor/${doctorId}`);
    return response.data;
};

export const saveDoctorAvailability = async (doctorId, availabilityData) => {
    const response = await api.post(`/slot/availability/doctor/${doctorId}`, availabilityData);
    return response.data;
};

export const generateDoctorSlots = async (doctorId, daysLimit = 14) => {
    const response = await api.post(`/slot/availability/doctor/${doctorId}/generate?daysLimit=${daysLimit}`);
    return response.data;
};

// 🔥 ADMIN ENDPOINTS
export const getAllAppointments = async () => {
    const response = await api.get('/appointment');
    return response.data;
};

export const getAllPatients = async () => {
    const response = await api.get('/patient');
    return response.data;
};

export const getAllSpecializations = async () => {
    const response = await api.get('/specialization');
    return response.data;
};

export const addHospital = async (hospitalData) => {
    const response = await api.post('/hospital', hospitalData);
    return response.data;
};

export const updateHospital = async (id, hospitalData) => {
    const response = await api.put(`/hospital/${id}`, hospitalData);
    return response.data;
};

export const deleteHospital = async (id) => {
    await api.delete(`/hospital/${id}`);
};

export const addSpecialization = async (specData) => {
    const response = await api.post('/specialization', specData);
    return response.data;
};

export const updateSpecialization = async (id, specData) => {
    const response = await api.put(`/specialization/${id}`, specData);
    return response.data;
};

export const deleteSpecialization = async (id) => {
    await api.delete(`/specialization/${id}`);
};

export const approveDoctor = async (doctorId) => {
    const response = await api.put(`/doctor/${doctorId}/approve`);
    return response.data;
};

export const rejectDoctor = async (doctorId) => {
    const response = await api.put(`/doctor/${doctorId}/reject`);
    return response.data;
};

export const getDoctorsBySpecialization = async (specializationId) => {
    const response = await api.get(`/doctor/specialization/${specializationId}`);
    return response.data;
};

export const getDoctorById = async (doctorId) => {
    const response = await api.get(`/doctor/${doctorId}`);
    return response.data;
};

export const rescheduleAppointment = async (appointmentId, newSlotId) => {
    const response = await api.put(`/appointment/${appointmentId}/reschedule?newSlotId=${newSlotId}`);
    return response.data;
};

export const getAvailableSlotsByDate = async (doctorId, date) => {
    const response = await api.get(`/slot/available/${doctorId}/date?date=${date}`);
    return response.data;
};

export const reserveSlot = async (slotId) => {
    const response = await api.post(`/slot/${slotId}/reserve`);
    return response.data;
};

export const releaseSlot = async (slotId) => {
    const response = await api.post(`/slot/${slotId}/release`);
    return response.data;
};

export default api;
