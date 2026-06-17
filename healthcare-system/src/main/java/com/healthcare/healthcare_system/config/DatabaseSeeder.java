package com.healthcare.healthcare_system.config;

import com.healthcare.healthcare_system.entity.*;
import com.healthcare.healthcare_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private InAppNotificationRepository inAppNotificationRepository;

    @Autowired
    private DoctorAvailabilityRepository doctorAvailabilityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    private int getEnvInt(String key, int defaultValue) {
        String val = System.getenv(key);
        if (val != null) {
            try {
                return Integer.parseInt(val);
            } catch (NumberFormatException e) {
                System.out.println("Warning: Invalid value for env var " + key + ": " + val + ". Using default: " + defaultValue);
            }
        }
        return defaultValue;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Schema migration: ensure TEXT columns are wide enough for base64 image data
        // Uses PostgreSQL-compatible ALTER COLUMN ... TYPE syntax
        try {
            System.out.println("=== SCHEMA UPGRADE: Ensuring profile_picture columns are TEXT ===");
            entityManager.createNativeQuery("ALTER TABLE patients ALTER COLUMN profile_picture TYPE TEXT").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE doctors ALTER COLUMN profile_picture TYPE TEXT").executeUpdate();
            System.out.println("=== SCHEMA UPGRADE SUCCESSFUL ===");
        } catch (Exception e) {
            System.out.println("=== SCHEMA UPGRADE INFO: " + e.getMessage() + " ===");
        }

        String seedDbEnv = System.getenv("SEED_DB");
        if (seedDbEnv != null && seedDbEnv.equalsIgnoreCase("false")) {
            System.out.println("=== SEED_DB IS FALSE, SKIPPING SEEDING ===");
            return;
        }

        String forceSeedEnv = System.getenv("FORCE_SEED");
        boolean forceSeed = forceSeedEnv != null && forceSeedEnv.equalsIgnoreCase("true");

        if (!forceSeed && userRepository.count() > 0) {
            System.out.println("=== DATABASE ALREADY SEEDED. SKIPPING COMPREHENSIVE SEEDING TO PRESERVE DATA AND ENSURE FAST STARTUP ===");
            return;
        }

        System.out.println("=== STARTING COMPREHENSIVE MEDICAL ECOSYSTEM SEEDER ===");

        // Reading configuration counts from environment variables
        int targetSpecializationsCount = getEnvInt("SEED_SPECIALIZATIONS", 45);
        int targetHospitalsCount = getEnvInt("SEED_HOSPITALS", 30);
        int targetDoctorsCount = getEnvInt("SEED_DOCTORS", 80);
        int targetPatientsCount = getEnvInt("SEED_PATIENTS", 200);
        int targetAppointmentsCount = getEnvInt("SEED_APPOINTMENTS", 750);

        System.out.println("Configured counts: Specializations=" + targetSpecializationsCount + 
                           ", Hospitals=" + targetHospitalsCount + 
                           ", Doctors=" + targetDoctorsCount + 
                           ", Patients=" + targetPatientsCount + 
                           ", Appointments=" + targetAppointmentsCount);

        // 1. Clear existing database tables in dependency order
        // Uses JPA batch delete which works on both MySQL and PostgreSQL
        System.out.println("Clearing old data...");

        reviewRepository.deleteAllInBatch();
        reviewRepository.flush();

        inAppNotificationRepository.deleteAllInBatch();
        inAppNotificationRepository.flush();

        appointmentRepository.deleteAllInBatch();
        appointmentRepository.flush();

        slotRepository.deleteAllInBatch();
        slotRepository.flush();

        doctorAvailabilityRepository.deleteAllInBatch();
        doctorAvailabilityRepository.flush();

        patientRepository.deleteAllInBatch();
        patientRepository.flush();

        doctorRepository.deleteAllInBatch();
        doctorRepository.flush();

        hospitalRepository.deleteAllInBatch();
        hospitalRepository.flush();

        specializationRepository.deleteAllInBatch();
        specializationRepository.flush();

        userRepository.deleteAllInBatch();
        userRepository.flush();

        System.out.println("Database tables cleared successfully.");

        // 2. Seed Admin Users
        User sysAdmin = new User();
        sysAdmin.setName("Chief Administrator");
        sysAdmin.setEmail("admin@healthcare.com");
        sysAdmin.setPassword(passwordEncoder.encode("admin123"));
        sysAdmin.setPhone("555-999-9999");
        sysAdmin.setRole("ADMIN");
        userRepository.save(sysAdmin);

        User testAdmin = new User();
        testAdmin.setName("System Manager");
        testAdmin.setEmail("admin@test.com");
        testAdmin.setPassword(passwordEncoder.encode("password123"));
        testAdmin.setPhone("555-888-8888");
        testAdmin.setRole("ADMIN");
        userRepository.save(testAdmin);

        // 3. Seed Specializations
        String[][] specData = {
            {"General Physician", "Primary care, wellness checks, and general medical advice."},
            {"Cardiologist", "Specialist in heart health and cardiovascular system disorders."},
            {"Pediatrician", "Medical care for infants, children, and adolescents."},
            {"Neurologist", "Diagnosis and treatment of nervous system and brain disorders."},
            {"Dermatologist", "Specialist in skin, hair, nail conditions, and cosmetics."},
            {"Orthopedic Surgeon", "Skeletal, bone, joint, and muscle surgery/care."},
            {"Gynecologist", "Women's reproductive system health and prenatal care."},
            {"Psychiatrist", "Diagnosis, treatment, and prevention of mental health disorders."},
            {"Ophthalmologist", "Eye health, vision checks, and corrective eye surgeries."},
            {"ENT Specialist", "Otolaryngology: Ear, nose, throat, and neck disorders."},
            {"Urologist", "Urinary tract infections and male reproductive system care."},
            {"Nephrologist", "Kidney health, chronic kidney disease, and dialysis."},
            {"Pulmonologist", "Respiratory system, lungs, and breathing disorders."},
            {"Gastroenterologist", "Digestive tract, stomach, liver, and bowel disorders."},
            {"Endocrinologist", "Hormones, thyroid conditions, and diabetes management."},
            {"Rheumatologist", "Joint, muscle, and autoimmune inflammatory disorders."},
            {"Oncologist", "Cancer diagnosis, chemotherapy, and tumor treatment."},
            {"Hematologist", "Blood disorders, anemia, hemophilia, and leukemia."},
            {"Infectious Disease Specialist", "Diagnosis of complex bacterial, viral, and fungal infections."},
            {"Allergy Specialist", "Asthma, seasonal allergies, and immune system testing."},
            {"Sports Medicine Specialist", "Treatment of athletic injuries and muscle recovery."},
            {"Plastic Surgeon", "Reconstructive surgeries and aesthetic enhancement."},
            {"Vascular Surgeon", "Circulatory system and blood vessel surgeries."},
            {"Neurosurgeon", "Brain, spinal cord, and peripheral nerve surgeries."},
            {"Emergency Medicine Specialist", "Acute trauma, critical care, and emergency room medicine."},
            {"Family Medicine Specialist", "Comprehensive continuous healthcare for families and individuals."},
            {"Sleep Medicine Specialist", "Sleep apnea, insomnia, and narcolepsy diagnostic checks."},
            {"Pain Management Specialist", "Chronic pain relief therapies and spinal injections."},
            {"Geriatric Specialist", "Specialized medical care and aging assistance for seniors."},
            {"Adolescent Medicine Specialist", "Physical and behavioral development care for teenagers."},
            {"Reproductive Endocrinologist", "Fertility treatments, IVF, and hormonal balance."},
            {"Critical Care Specialist", "Intensive care unit (ICU) life support and monitoring."},
            {"Internal Medicine Specialist", "Prevention and complex treatment of adult internal diseases."},
            {"Neonatologist", "Medical care for premature or critically ill newborn infants."},
            {"Anesthesiologist", "Surgical anesthesia and postoperative pain relief."},
            {"Pathologist", "Laboratory analysis of tissues and bodily fluids for diagnosis."},
            {"Radiologist", "Imaging diagnostics including X-Ray, MRI, CT, and Ultrasound."},
            {"Rehabilitation Specialist", "Physical therapy and occupational rehabilitation medicine."},
            {"Medical Geneticist", "Diagnosis and counseling for hereditary and genetic conditions."},
            {"Preventive Medicine Specialist", "Public health strategies and lifestyle checkups."},
            {"Immunologist", "Diagnosis and treatment of immune system disorders and immunodeficiencies."},
            {"Reproductive Specialist", "Specialist in fertility, reproductive endocrinology, and assisted conception."},
            {"Toxicologist", "Medical evaluation and treatment of poisoning and chemical exposure."},
            {"Occupational Medicine Specialist", "Diagnosis and prevention of work-related illnesses and injuries."},
            {"Palliative Care Specialist", "Specialized care focused on providing relief from symptoms of serious illness."}
        };

        List<Specialization> specializations = new ArrayList<>();
        int specsToSeed = Math.min(targetSpecializationsCount, specData.length);
        for (int i = 0; i < specsToSeed; i++) {
            Specialization spec = new Specialization();
            spec.setName(specData[i][0]);
            spec.setDescription(specData[i][1]);
            specializations.add(specializationRepository.save(spec));
        }
        System.out.println("Seeded " + specializations.size() + " Specializations.");

        // 4. Seed Hospitals
        String[] hospitalNames = {
            "City Care Hospital", "Sunrise Multispeciality Hospital", "MedLife Healthcare Center",
            "Hope Medical Institute", "Harmony Health Hospital", "St. Jude Research Hospital",
            "Mayo Clinic Center", "Johns Hopkins Medical", "Cleveland Clinic Center",
            "Massachusetts General Hospital", "Mount Sinai Hospital", "Stanford Health Care",
            "UCSF Medical Center", "Northwestern Memorial Hospital", "Barnes-Jewish Hospital",
            "BYU Health Center", "Cedars-Sinai Medical Center", "Duke University Hospital",
            "Emory University Hospital", "Houston Methodist Hospital", "NYU Langone Health",
            "Penn Presbyterian Medical Center", "Vanderbilt University Medical Center", "Yale New Haven Hospital",
            "Keck Hospital of USC", "Tufts Medical Center", "Temple University Hospital",
            "Loyola University Medical Center", "Banner Health Center", "Mercy Health Hospital",
            "St. Luke's Health System", "Sacred Heart Medical Center", "Valley View Hospital",
            "Mercer County Hospital", "Methodist Hospital of Sacramento", "Good Samaritan Hospital",
            "Trinitas Regional Medical Center", "Overlook Medical Center", "El Camino Hospital",
            "Sutter Health Center"
        };

        String[] cities = {"New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"};
        String[] states = {"NY", "CA", "IL", "TX", "AZ", "PA", "TX", "CA", "TX", "CA"};

        String[] hospitalImages = {
            "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=600",
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600",
            "https://images.unsplash.com/photo-1586773860418-d3b3de97e663?q=80&w=600",
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600",
            "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=600",
            "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=600",
            "https://images.unsplash.com/photo-1502740479091-635887520276?q=80&w=600",
            "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600"
        };

        List<Hospital> hospitals = new ArrayList<>();
        int hospitalsToSeed = Math.min(targetHospitalsCount, hospitalNames.length);
        for (int i = 0; i < hospitalsToSeed; i++) {
            Hospital h = new Hospital();
            h.setName(hospitalNames[i]);
            h.setAddress((100 + i * 25) + " Medical Parkway");
            h.setCity(cities[i % cities.length]);
            h.setState(states[i % states.length]);
            h.setCountry("USA");
            h.setContactNumber("555-" + String.format("%03d", i) + "-4000");
            h.setDescription("A premier healthcare facility offering advanced clinical care and state-of-the-art diagnostic services.");
            h.setImageUrl(hospitalImages[i % hospitalImages.length]);
            h.setLatitude(40.7128 + (i * 0.01));
            h.setLongitude(-74.0060 - (i * 0.01));
            hospitals.add(hospitalRepository.save(h));
        }
        System.out.println("Seeded " + hospitals.size() + " Hospitals.");

        // 5. Seed Doctors
        String[] firstNamesMale = {
            "Alexander", "Liam", "Benjamin", "William", "Lucas", "James", "Daniel", "Matthew", "Oliver", "David",
            "Joseph", "Samuel", "Charles", "Robert", "Michael", "John", "Christopher", "Andrew", "Thomas", "Anthony",
            "Paul", "Stephen", "Kenneth", "Kevin", "Brian", "Ronald", "Edward", "Donald", "George", "Jason"
        };
        String[] firstNamesFemale = {
            "Olivia", "Emma", "Sophia", "Charlotte", "Amelia", "Isabella", "Mia", "Evelyn", "Abigail", "Harper",
            "Elena", "Clara", "Grace", "Sarah", "Emily", "Rachel", "Megan", "Laura", "Cynthia", "Betty",
            "Dorothy", "Margaret", "Helen", "Amy", "Shirley", "Angela", "Jessica", "Amanda", "Jennifer", "Lisa"
        };
        String[] lastNames = {
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
            "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White",
            "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen"
        };

        String[] qualifications = {"MD", "DO", "MBBS, MD", "MD, PhD", "MBBS, MS", "DNB", "MD, FACC"};
        String[] languages = {"English", "English, Spanish", "English, French", "English, Mandarin", "English, Hindi", "English, Arabic", "English, German"};

        String[] maleDoctorImages = {
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300",
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300",
            "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=300",
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300",
            "https://images.unsplash.com/photo-1536064479547-7ee40b74b807?q=80&w=300",
            "https://images.unsplash.com/photo-1605684954278-9f17d27738b4?q=80&w=300",
            "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=300",
            "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=300",
            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=300",
            "https://images.unsplash.com/photo-1582750433449-64c656df174a?q=80&w=300",
            "https://images.unsplash.com/photo-1622960206462-7530a2226268?q=80&w=300"
        };
        String[] femaleDoctorImages = {
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300",
            "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=300",
            "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=300",
            "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=300",
            "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=300",
            "https://images.unsplash.com/photo-1623854767648-e7bb8c572eeb?q=80&w=300",
            "https://images.unsplash.com/photo-1590611380053-eef40d4bde2e?q=80&w=300",
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300",
            "https://images.unsplash.com/photo-1618018352910-72bdafdc725c?q=80&w=300",
            "https://images.unsplash.com/photo-1643297654416-05795d62e39c?q=80&w=300"
        };

        List<Doctor> doctors = new ArrayList<>();
        Random rand = new Random();

        // Let's seed the static doctor@test.com as a highly qualified doctor (Alexander Sterling)
        {
            User docUser = new User();
            docUser.setName("Dr. Alexander Sterling");
            docUser.setEmail("doctor@test.com");
            docUser.setPassword(passwordEncoder.encode("password123"));
            docUser.setPhone("555-777-1111");
            docUser.setRole("DOCTOR");
            docUser = userRepository.save(docUser);

            Doctor d = new Doctor();
            d.setUser(docUser);
            d.setSpecialization(specializations.get(1)); // Cardiologist
            d.setHospital(hospitals.get(0));
            d.setExperienceYears(18);
            d.setLicenseNumber("LIC-ASTERING-101");
            d.setDocumentUrl("https://healthcareplus.s3.amazonaws.com/documents/lic_astering_101.pdf");
            d.setStatus(Doctor.Status.APPROVED);
            d.setGender("MALE");
            d.setQualification("MD, PhD, FACC");
            d.setLanguages("English, German");
            d.setConsultationFee(180);
            d.setBiography("Dr. Alexander Sterling is a renowned cardiologist specializing in preventive medicine and minimally invasive cardiovascular interventions. He values clear patient communication.");
            d.setProfilePicture(maleDoctorImages[0]);
            doctors.add(doctorRepository.save(d));
        }

        // Seed remaining doctors up to target count
        for (int i = 1; i < targetDoctorsCount; i++) {
            boolean isMale = rand.nextBoolean();
            String fName = isMale ? firstNamesMale[rand.nextInt(firstNamesMale.length)] : firstNamesFemale[rand.nextInt(firstNamesFemale.length)];
            String lName = lastNames[rand.nextInt(lastNames.length)];
            String fullName = "Dr. " + fName + " " + lName;
            String email = fName.toLowerCase() + "." + lName.toLowerCase() + i + "@healthcare.com";

            User docUser = new User();
            docUser.setName(fullName);
            docUser.setEmail(email);
            docUser.setPassword(passwordEncoder.encode("password123"));
            docUser.setPhone("555-" + String.format("%03d", i) + "-1111");
            docUser.setRole("DOCTOR");
            docUser = userRepository.save(docUser);

            Doctor d = new Doctor();
            d.setUser(docUser);
            d.setSpecialization(specializations.get(i % specializations.size()));
            d.setHospital(hospitals.get(i % hospitals.size()));
            d.setExperienceYears(3 + rand.nextInt(25));
            d.setLicenseNumber("LIC-" + lName.toUpperCase() + "-" + (200 + i));
            d.setDocumentUrl("https://healthcareplus.s3.amazonaws.com/documents/seeded_lic_" + i + ".pdf");
            d.setStatus(Doctor.Status.APPROVED);
            d.setGender(isMale ? "MALE" : "FEMALE");
            d.setQualification(qualifications[rand.nextInt(qualifications.length)]);
            d.setLanguages(languages[rand.nextInt(languages.length)]);
            d.setConsultationFee(60 + rand.nextInt(160));

            String specName = d.getSpecialization().getName();
            d.setBiography(generateDoctorBio(fName + " " + lName, specName, d.getExperienceYears()));
            d.setProfilePicture(isMale ? maleDoctorImages[i % maleDoctorImages.length] : femaleDoctorImages[i % femaleDoctorImages.length]);
            doctors.add(doctorRepository.save(d));
        }
        System.out.println("Seeded " + doctors.size() + " Doctors.");

        // 6. Seed Patients
        List<Patient> patients = new ArrayList<>();
        // Seed the static patient@test.com first (Sarah Jenkins)
        {
            User patUser = new User();
            patUser.setName("Sarah Jenkins");
            patUser.setEmail("patient@test.com");
            patUser.setPassword(passwordEncoder.encode("password123"));
            patUser.setPhone("555-200-0000");
            patUser.setRole("PATIENT");
            patUser = userRepository.save(patUser);

            Patient p = new Patient();
            p.setUser(patUser);
            p.setName("Sarah Jenkins");
            p.setAge(32);
            p.setGender(Patient.Gender.FEMALE);
            p.setPhone("555-200-0000");
            p.setProfilePicture("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200");
            patients.add(patientRepository.save(p));
        }

        // Seed remaining patients up to target count
        for (int i = 1; i < targetPatientsCount; i++) {
            boolean isMale = rand.nextBoolean();
            String fName = isMale ? firstNamesMale[rand.nextInt(firstNamesMale.length)] : firstNamesFemale[rand.nextInt(firstNamesFemale.length)];
            String lName = lastNames[rand.nextInt(lastNames.length)];
            String fullName = fName + " " + lName;
            String email = fName.toLowerCase() + "." + lName.toLowerCase() + i + "@test.com";

            User patUser = new User();
            patUser.setName(fullName);
            patUser.setEmail(email);
            patUser.setPassword(passwordEncoder.encode("password123"));
            patUser.setPhone("555-" + String.format("%03d", i) + "-2222");
            patUser.setRole("PATIENT");
            patUser = userRepository.save(patUser);

            Patient p = new Patient();
            p.setUser(patUser);
            p.setName(fullName);
            p.setAge(18 + rand.nextInt(63));
            p.setGender(isMale ? Patient.Gender.MALE : Patient.Gender.FEMALE);
            p.setPhone(patUser.getPhone());
            p.setProfilePicture(isMale ?
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" :
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
            );
            patients.add(patientRepository.save(p));
        }
        System.out.println("Seeded " + patients.size() + " Patients.");

        // 7. Seed Doctor Availability Templates
        System.out.println("Seeding Doctor Availabilities...");
        List<String> weekdays = Arrays.asList("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY");
        List<String> tueToSat = Arrays.asList("TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY");
        List<String> weekends = Arrays.asList("SATURDAY", "SUNDAY");

        for (int i = 0; i < doctors.size(); i++) {
            Doctor doc = doctors.get(i);
            int scheduleType = i % 10;
            if (scheduleType < 6) { // 60% MONDAY-FRIDAY (9 AM - 1 PM, 4 PM - 8 PM)
                for (String day : weekdays) {
                    DoctorAvailability avail1 = new DoctorAvailability();
                    avail1.setDoctor(doc);
                    avail1.setDayOfWeek(day);
                    avail1.setStartTime(LocalTime.of(9, 0));
                    avail1.setEndTime(LocalTime.of(13, 0));
                    avail1.setSlotDurationMinutes(30);
                    avail1.setIsActive(true);
                    doctorAvailabilityRepository.save(avail1);

                    DoctorAvailability avail2 = new DoctorAvailability();
                    avail2.setDoctor(doc);
                    avail2.setDayOfWeek(day);
                    avail2.setStartTime(LocalTime.of(16, 0));
                    avail2.setEndTime(LocalTime.of(20, 0));
                    avail2.setSlotDurationMinutes(30);
                    avail2.setIsActive(true);
                    doctorAvailabilityRepository.save(avail2);
                }
            } else if (scheduleType < 9) { // 30% TUESDAY-SATURDAY (10 AM - 2 PM, 3 PM - 6 PM)
                for (String day : tueToSat) {
                    DoctorAvailability avail1 = new DoctorAvailability();
                    avail1.setDoctor(doc);
                    avail1.setDayOfWeek(day);
                    avail1.setStartTime(LocalTime.of(10, 0));
                    avail1.setEndTime(LocalTime.of(14, 0));
                    avail1.setSlotDurationMinutes(30);
                    avail1.setIsActive(true);
                    doctorAvailabilityRepository.save(avail1);

                    DoctorAvailability avail2 = new DoctorAvailability();
                    avail2.setDoctor(doc);
                    avail2.setDayOfWeek(day);
                    avail2.setStartTime(LocalTime.of(15, 0));
                    avail2.setEndTime(LocalTime.of(18, 0));
                    avail2.setSlotDurationMinutes(30);
                    avail2.setIsActive(true);
                    doctorAvailabilityRepository.save(avail2);
                }
            } else { // 10% SATURDAY-SUNDAY (9 AM - 1 PM)
                for (String day : weekends) {
                    DoctorAvailability avail = new DoctorAvailability();
                    avail.setDoctor(doc);
                    avail.setDayOfWeek(day);
                    avail.setStartTime(LocalTime.of(9, 0));
                    avail.setEndTime(LocalTime.of(13, 0));
                    avail.setSlotDurationMinutes(30);
                    avail.setIsActive(true);
                    doctorAvailabilityRepository.save(avail);
                }
            }
        }
        System.out.println("Doctor availability schedules saved.");

        // 8. Generate Availability Slots (Past 30 days and Future 30 days)
        System.out.println("Generating availability slots using Slot sliding logic...");
        List<Slot> allSlots = new ArrayList<>();
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now().plusDays(30);

        List<DoctorAvailability> templates = doctorAvailabilityRepository.findAll();
        for (DoctorAvailability temp : templates) {
            Doctor doctor = temp.getDoctor();
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                String dayOfWeekStr = currentDate.getDayOfWeek().toString();
                if (temp.getDayOfWeek().equalsIgnoreCase(dayOfWeekStr)) {
                    LocalTime currentStart = temp.getStartTime();
                    LocalTime endLimit = temp.getEndTime();
                    int step = temp.getSlotDurationMinutes();

                    while (currentStart.plusMinutes(step).isBefore(endLimit) || currentStart.plusMinutes(step).equals(endLimit)) {
                        Slot slot = new Slot();
                        slot.setDoctor(doctor);
                        slot.setSlotDate(currentDate);
                        slot.setStartTime(currentStart);
                        slot.setEndTime(currentStart.plusMinutes(step));
                        slot.setIsBooked(false);
                        allSlots.add(slot);
                        currentStart = currentStart.plusMinutes(step);
                    }
                }
                currentDate = currentDate.plusDays(1);
            }
        }

        // Fast batch save slots in batches of 1000
        System.out.println("Saving " + allSlots.size() + " total generated slots...");
        for (int i = 0; i < allSlots.size(); i += 1000) {
            List<Slot> batch = allSlots.subList(i, Math.min(i + 1000, allSlots.size()));
            slotRepository.saveAll(batch);
            slotRepository.flush();
        }
        System.out.println("Database availability slots populated.");

        // 9. Seed Appointments (40% Completed in past, 35% Upcoming in future, 20% Confirmed in future, 5% Cancelled)
        System.out.println("Assigning " + targetAppointmentsCount + " appointments...");
        
        // Let's reload all saved slots from DB to have IDs
        List<Slot> savedSlots = slotRepository.findAll();
        
        // Separate past slots and future slots
        List<Slot> pastSlots = new ArrayList<>();
        List<Slot> futureSlots = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (Slot s : savedSlots) {
            if (s.getSlotDate().isBefore(today)) {
                pastSlots.add(s);
            } else {
                futureSlots.add(s);
            }
        }

        Collections.shuffle(pastSlots);
        Collections.shuffle(futureSlots);

        String[] symptomsList = {
            "Persistent headache and mild fever.",
            "Chest tightness and short breath on climbing stairs.",
            "Annual health assessment and lipid screening.",
            "Skin rash on left arm with intense itching.",
            "Lower back pain shooting down left leg.",
            "Dry cough, sore throat, and nasal congestion.",
            "Fatigue, unusual thirst, and frequent urination.",
            "Digestive discomfort after meals and nausea.",
            "Anxiety, difficulty sleeping, and mood swings.",
            "Vision blurriness and eye strain while reading."
        };

        String[] summariesList = {
            "Patient presented with seasonal allergy symptoms. Prescribed antihistamines and advised rest.",
            "Completed cardiovascular check. Advised low-sodium diet and scheduled follow-up bloodwork.",
            "Routine physical examination completed. All vital signs normal.",
            "Diagnosed contact dermatitis. Prescribed topical hydrocortisone cream.",
            "Recommended physical therapy exercises for lumbar strain and prescribed mild pain relievers.",
            "Identified mild viral bronchitis. Advised hydration and cough expectorants.",
            "Requested HbA1c screening test to investigate diabetic symptoms.",
            "Prescribed antacids for acid reflux and recommended dietary adjustments.",
            "Advised behavioral adjustments for stress management and sleep hygiene.",
            "Prescribed corrective lens changes and advised limiting screen time."
        };

        int completedCount = (int) (targetAppointmentsCount * 0.40);
        int upcomingCount = (int) (targetAppointmentsCount * 0.35);
        int confirmedCount = (int) (targetAppointmentsCount * 0.20);
        int cancelledCount = targetAppointmentsCount - completedCount - upcomingCount - confirmedCount;

        int pastIndex = 0;
        int futureIndex = 0;
        List<Appointment> completedAppointments = new ArrayList<>();

        // completed appointments (use past slots)
        for (int i = 0; i < completedCount && pastIndex < pastSlots.size(); i++) {
            Slot slot = pastSlots.get(pastIndex++);
            slot.setIsBooked(true);
            slotRepository.save(slot);

            Appointment appt = new Appointment();
            appt.setPatient(patients.get(rand.nextInt(patients.size())));
            appt.setDoctor(slot.getDoctor());
            appt.setSlot(slot);
            appt.setStatus(Appointment.Status.COMPLETED);
            appt.setSymptoms(symptomsList[rand.nextInt(symptomsList.length)]);
            appt.setSummary(summariesList[rand.nextInt(summariesList.length)]);
            appt.setMedicalHistoryPdf("https://healthcareplus.s3.amazonaws.com/history/history_" + i + ".pdf");
            appt.setCreatedAt(LocalDateTime.of(slot.getSlotDate().minusDays(3), slot.getStartTime()));
            completedAppointments.add(appointmentRepository.save(appt));
        }

        // upcoming appointments (use future slots)
        for (int i = 0; i < upcomingCount && futureIndex < futureSlots.size(); i++) {
            Slot slot = futureSlots.get(futureIndex++);
            slot.setIsBooked(true);
            slotRepository.save(slot);

            Appointment appt = new Appointment();
            appt.setPatient(patients.get(rand.nextInt(patients.size())));
            appt.setDoctor(slot.getDoctor());
            appt.setSlot(slot);
            appt.setStatus(Appointment.Status.BOOKED); // upcoming is BOOKED in database
            appt.setSymptoms(symptomsList[rand.nextInt(symptomsList.length)]);
            appt.setMeetingUrl("https://meet.healthcareplus.com/room-" + UUID.randomUUID().toString().substring(0, 8));
            appt.setCreatedAt(LocalDateTime.of(today.minusDays(2), LocalTime.of(10, 0)));
            appointmentRepository.save(appt);
        }

        // confirmed appointments (use future slots)
        for (int i = 0; i < confirmedCount && futureIndex < futureSlots.size(); i++) {
            Slot slot = futureSlots.get(futureIndex++);
            slot.setIsBooked(true);
            slotRepository.save(slot);

            Appointment appt = new Appointment();
            appt.setPatient(patients.get(rand.nextInt(patients.size())));
            appt.setDoctor(slot.getDoctor());
            appt.setSlot(slot);
            appt.setStatus(Appointment.Status.BOOKED); // confirmed is BOOKED in database
            appt.setSymptoms(symptomsList[rand.nextInt(symptomsList.length)]);
            appt.setMeetingUrl("https://meet.healthcareplus.com/room-" + UUID.randomUUID().toString().substring(0, 8));
            appt.setCreatedAt(LocalDateTime.of(today.minusDays(1), LocalTime.of(14, 0)));
            appointmentRepository.save(appt);
        }

        // cancelled appointments (use mixed slots)
        for (int i = 0; i < cancelledCount; i++) {
            Slot slot = null;
            if (rand.nextBoolean() && pastIndex < pastSlots.size()) {
                slot = pastSlots.get(pastIndex++);
            } else if (futureIndex < futureSlots.size()) {
                slot = futureSlots.get(futureIndex++);
            }

            if (slot == null) break;

            slot.setIsBooked(true);
            slotRepository.save(slot);

            Appointment appt = new Appointment();
            appt.setPatient(patients.get(rand.nextInt(patients.size())));
            appt.setDoctor(slot.getDoctor());
            appt.setSlot(slot);
            appt.setStatus(Appointment.Status.CANCELLED);
            appt.setSymptoms(symptomsList[rand.nextInt(symptomsList.length)]);
            appt.setCreatedAt(LocalDateTime.of(slot.getSlotDate().minusDays(4), slot.getStartTime()));
            appointmentRepository.save(appt);
        }

        System.out.println("Seeded appointments: Total Completed=" + completedAppointments.size() + 
                           ", Booked/Confirmed=" + (upcomingCount + confirmedCount) + 
                           ", Cancelled=" + cancelledCount);

        // 10. Seed Doctor Reviews
        System.out.println("Generating doctor reviews...");
        String[][] reviewComments = {
            {"5", "Exceptional consultation! Explained my diagnosis and treatment options in details."},
            {"5", "Wonderful doctor. Highly professional, empathetic, and listened to all my concerns."},
            {"4", "Very knowledgeable doctor, although the clinic wait time was slightly long."},
            {"5", "Outstanding experience. The diagnosis was precise and the prescriptions really helped."},
            {"4", "Extremely friendly and practical doctor. The checkup felt comprehensive and clean."},
            {"5", "Incredible care! Best specialist consultation I've ever had."},
            {"5", "Very reassuring and detailed explanations, highly recommended!"},
            {"4", "Great consulting sessions, explained everything clearly."},
            {"5", "A wonderful experience! Felt extremely cared for during the whole session."},
            {"4", "Very helpful medical advice and friendly staff."}
        };

        // Seed reviews for completed appointments
        Collections.shuffle(completedAppointments);
        int reviewCountToSeed = Math.min(completedAppointments.size(), targetDoctorsCount * 4); // ~4 reviews per doctor on average
        for (int i = 0; i < reviewCountToSeed; i++) {
            Appointment appt = completedAppointments.get(i);
            String[] rComm = reviewComments[rand.nextInt(reviewComments.length)];
            int rating = Integer.parseInt(rComm[0]);

            Review review = new Review();
            review.setDoctor(appt.getDoctor());
            review.setPatient(appt.getPatient());
            review.setRating(rating);
            review.setReviewText(rComm[1]);
            reviewRepository.save(review);
        }

        // 11. Recalculate and update ratings/reviewCount on doctor entity
        for (Doctor doc : doctors) {
            List<Review> docReviews = reviewRepository.findByDoctor_DoctorId(doc.getDoctorId());
            if (!docReviews.isEmpty()) {
                double total = 0.0;
                for (Review r : docReviews) {
                    total += r.getRating();
                }
                doc.setAverageRating(Math.round((total / docReviews.size()) * 10.0) / 10.0);
                doc.setReviewCount(docReviews.size());
            } else {
                // Assign a nice realistic default rating
                doc.setAverageRating(4.0 + (rand.nextInt(11) / 10.0));
                doc.setReviewCount(1 + rand.nextInt(8));
            }
            doctorRepository.save(doc);
        }
        System.out.println("Doctor ratings recalculated and persisted.");
        System.out.println("=== COMPREHENSIVE MEDICAL ECOSYSTEM SEEDER COMPLETED ===");
    }

    private String generateDoctorBio(String name, String specialization, int experience) {
        String[] openings = {
            "Dr. " + name + " is a board-certified " + specialization.toLowerCase() + " with " + experience + " years of experience.",
            "With over " + experience + " years of dedicated clinical practice, Dr. " + name + " specializes in " + specialization.toLowerCase() + ".",
            "Dr. " + name + " is a highly respected " + specialization.toLowerCase() + ", dedicated to providing comprehensive and compassionate patient care.",
            "Specializing in " + specialization.toLowerCase() + ", Dr. " + name + " brings " + experience + " years of expertise to our medical center."
        };
        String[] bodies = {
            " She focuses on evidence-based treatment plans and patient education.",
            " He is committed to providing customized treatment options that suit the patient's individual lifestyle.",
            " Throughout their career, they have led several wellness initiatives and focused on preventative health.",
            " Their clinical interest includes advanced diagnostics and state-of-the-art therapeutic procedures."
        };
        String[] endings = {
            " Outside of the clinic, they enjoy lecturing at medical conferences and mentoring students.",
            " They believe that healthy living starts with understanding and partnership between doctor and patient.",
            " Dedicated to clinical excellence, they consistently participate in medical research and trials.",
            " Patient satisfaction and long-term health improvements are the primary goals of their medical practice."
        };
        Random rand = new Random();
        return openings[rand.nextInt(openings.length)] + bodies[rand.nextInt(bodies.length)] + endings[rand.nextInt(endings.length)];
    }
}
