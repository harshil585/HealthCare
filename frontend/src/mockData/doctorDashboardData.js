export const mockDoctor = {
  name: "Dr. Test Doctor",
  email: "doctor@test.com",
  role: "Doctor",
  specialization: "Cardiologist",
  avatar: "TD"
};

export const mockDoctorStats = {
  todaysAppointments: 8,
  totalPatients: 342,
  pendingApprovals: 2,
  revenue: "$4,250",
  trends: {
    appointments: "Fully booked today",
    patients: "+12 this month",
    approvals: "Needs action",
    revenue: "+15% from last week"
  }
};

export const mockTodaysSchedule = [
  { id: 1, patientName: "John Doe", time: "10:00 AM", type: "In-Person", reason: "Routine Checkup", status: "Upcoming", avatar: "JD" },
  { id: 2, patientName: "Alice Smith", time: "11:30 AM", type: "Video Consult", reason: "Follow-up", status: "Upcoming", avatar: "AS" },
  { id: 3, patientName: "Robert King", time: "02:00 PM", type: "In-Person", reason: "Chest Pain", status: "Pending", avatar: "RK" },
];

export const mockDoctorTimeline = [
  { id: 1, title: "Prescription Updated", description: "Updated prescription for patient John Doe.", time: "1 hour ago", type: "medical" },
  { id: 2, title: "Consultation Completed", description: "Video consult with Emma Watson finished.", time: "3 hours ago", type: "consultation" },
  { id: 3, title: "Slot Managed", description: "Opened new slots for next Monday.", time: "Yesterday", type: "system" },
];

export const mockDoctorNotifications = [
  { id: 1, title: "New Appointment", message: "Robert King requested an appointment for today 2:00 PM.", time: "30 mins ago", read: false },
  { id: 2, title: "Lab Results Ready", message: "Blood test results for Alice Smith are available.", time: "2 hours ago", read: true },
];
