export const mockAdmin = {
  name: "System Admin",
  email: "admin@test.com",
  role: "Admin",
  avatar: "SA"
};

export const mockAdminStats = {
  totalPatients: 1245,
  totalDoctors: 124,
  hospitals: 12,
  appointments: 8432,
  trends: {
    patients: "+15 this month",
    doctors: "+3 pending",
    hospitals: "All active",
    appointments: "+120 this week"
  }
};

export const mockPendingDoctors = [
  { id: 1, name: "Dr. William Johnson", specialization: "Cardiologist", experience: "10 Years", status: "Pending Review", dateApplied: "2026-05-09", avatar: "WJ" },
  { id: 2, name: "Dr. Amanda White", specialization: "Dermatologist", experience: "5 Years", status: "Pending Review", dateApplied: "2026-05-10", avatar: "AW" },
];

export const mockSystemActivity = [
  { id: 1, title: "New Hospital Onboarded", description: "City General Hospital was added to the platform.", time: "2 hours ago", type: "system" },
  { id: 2, title: "Doctor Verified", description: "Dr. Sarah Smith's license was verified.", time: "5 hours ago", type: "verification" },
  { id: 3, title: "System Maintenance", description: "Scheduled database backup completed successfully.", time: "1 day ago", type: "maintenance" },
];

export const mockAdminNotifications = [
  { id: 1, title: "New Doctor Application", message: "Dr. William Johnson applied to join.", time: "10 mins ago", read: false },
  { id: 2, title: "Server Alert", message: "High traffic detected on booking service.", time: "1 hour ago", read: false },
];
