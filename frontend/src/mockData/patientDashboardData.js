export const mockPatient = {
  id: 1, name: "John Doe", email: "john.doe@example.com",
  phone: "+1 234 567 8900", age: 32, gender: "Male",
  bloodGroup: "O+", profileCompletion: 85, avatar: "JD"
};

export const mockStats = {
  totalAppointments: 12, upcomingAppointments: 2,
  completedAppointments: 9, cancelledAppointments: 1,
  trends: { total: "+2 this month", upcoming: "Next in 2 days", completed: "+1 this month", cancelled: "No change" }
};

export const mockAppointments = [
  { id: 101, doctorId: 1, doctorName: "Dr. Sarah Smith", specialization: "Cardiologist", hospital: "City General Hospital", date: "2026-05-12", startTime: "10:00 AM", endTime: "10:30 AM", status: "BOOKED", type: "In-Person", avatar: "SS" },
  { id: 102, doctorId: 2, doctorName: "Dr. Mike Johnson", specialization: "Dermatologist", hospital: "Skin Care Clinic", date: "2026-05-15", startTime: "02:00 PM", endTime: "02:30 PM", status: "BOOKED", type: "Video Consult", avatar: "MJ" },
  { id: 103, doctorId: 3, doctorName: "Dr. Emily Chen", specialization: "General Physician", hospital: "Apollo 24/7", date: "2026-04-28", startTime: "11:00 AM", endTime: "11:30 AM", status: "COMPLETED", type: "In-Person", avatar: "EC" },
  { id: 104, doctorId: 4, doctorName: "Dr. Robert Wilson", specialization: "Orthopedic", hospital: "Bone & Joint Center", date: "2026-04-10", startTime: "04:00 PM", endTime: "04:30 PM", status: "CANCELLED", type: "In-Person", avatar: "RW" },
];

export const mockRecommendedDoctors = [
  { id: 5, name: "Dr. Alice Brown", specialization: "Neurologist", experience: "15 Years", hospital: "Neuro Care Hub", rating: 4.9, reviews: 124, availability: "Available Today", avatar: "AB",
    slots: [{ time: "09:00 AM", available: true }, { time: "10:30 AM", available: true }, { time: "02:00 PM", available: false }] },
  { id: 6, name: "Dr. James Wilson", specialization: "Pediatrician", experience: "10 Years", hospital: "Kids Health Center", rating: 4.8, reviews: 98, availability: "Tomorrow", avatar: "JW",
    slots: [{ time: "11:00 AM", available: true }, { time: "03:00 PM", available: true }] },
  { id: 7, name: "Dr. Olivia Davis", specialization: "Gynecologist", experience: "12 Years", hospital: "Women's Wellness", rating: 4.7, reviews: 156, availability: "Available Today", avatar: "OD",
    slots: [{ time: "09:30 AM", available: true }, { time: "01:00 PM", available: true }, { time: "04:00 PM", available: true }] },
  { id: 8, name: "Dr. Sarah Smith", specialization: "Cardiologist", experience: "18 Years", hospital: "City General Hospital", rating: 4.9, reviews: 210, availability: "Available Today", avatar: "SS",
    slots: [{ time: "10:00 AM", available: false }, { time: "11:30 AM", available: true }] },
];

export const mockHospitals = [
  { id: 1, name: "City General Hospital", address: "123 Main St", city: "New York", contact: "+1 800-123-4567", departments: 24, beds: 500 },
  { id: 2, name: "Apollo 24/7", address: "456 Health Blvd", city: "Boston", contact: "+1 800-987-6543", departments: 18, beds: 350 },
  { id: 3, name: "Neuro Care Hub", address: "789 Brain Ave", city: "Chicago", contact: "+1 800-555-1234", departments: 12, beds: 200 },
];

export const mockSpecializations = [
  { name: "Cardiology", icon: "❤️" },
  { name: "Cancer", icon: "🎗️" },
  { name: "Orthopedics", icon: "🦴" },
  { name: "Gastroenterology", icon: "🫁" },
  { name: "Pulmonology", icon: "🫁" },
  { name: "Urology", icon: "🩺" },
  { name: "Nephrology", icon: "🫘" },
  { name: "Neurology", icon: "🧠" },
  { name: "Spine Surgery", icon: "🦴" },
  { name: "Gynecology", icon: "👩‍⚕️" },
  { name: "Pediatrics", icon: "👶" },
  { name: "Dermatology", icon: "🧴" },
];

export const mockTreatments = [
  { condition: "Heart Diseases", treatment: "Angioplasty / Bypass Surgery / Valve Replacement", description: "Advanced cardiac care with expert cardiologists and cardiac surgeons." },
  { condition: "Neurological Disorders", treatment: "Brain & Spine Surgery / Neuro-Endoscopy", description: "Cutting-edge neurosurgical procedures for complex brain conditions." },
  { condition: "Gastro & Liver Diseases", treatment: "Endoscopy / Laparoscopic GI Surgery", description: "Comprehensive gastro and liver care with minimally invasive techniques." },
  { condition: "Orthopedic Problems", treatment: "Joint Replacement / Arthroscopy / Spine Surgery", description: "Orthopedic surgeons providing mobility restoration and advanced bone care." },
  { condition: "Gynecology & Maternity", treatment: "Normal Delivery / C-Section / Laparoscopic Surgery", description: "Safe childbirth and complete women's health services." },
  { condition: "Cancer Treatment", treatment: "Chemotherapy / Radiation / Robotic Surgery", description: "Multidisciplinary cancer specialists offering personalized treatment plans." },
];

export const mockTimeline = [
  { id: 1, title: "Appointment Booked", description: "Booked an appointment with Dr. Sarah Smith for May 12.", time: "2 hours ago", type: "booking" },
  { id: 2, title: "Profile Updated", description: "Updated contact number and blood group.", time: "1 day ago", type: "profile" },
  { id: 3, title: "Consultation Completed", description: "Completed visit with Dr. Emily Chen.", time: "Apr 28, 2026", type: "consultation" },
];

export const mockNotifications = [
  { id: 1, title: "Appointment Reminder", message: "You have an appointment with Dr. Sarah Smith tomorrow at 10:00 AM.", time: "1 hour ago", read: false, type: "reminder" },
  { id: 2, title: "Booking Confirmed", message: "Your appointment with Dr. Mike Johnson has been confirmed.", time: "Yesterday", read: true, type: "confirmation" },
];
