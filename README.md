# HealthCare+ Enterprise Management System

A full-stack medical consulting and clinical management platform designed to connect patients with verified doctors, automate scheduling with reservation locks, and provide an empathetic, AI-driven diagnostic routing interface.

The repository is organized as a monorepo containing:
- /frontend: React client built with Vite and TailwindCSS.
- /healthcare-system: Java backend built with Spring Boot, Spring Security, and Hibernate JPA.

---

## Key Features

### Patient Workflows
- Specialized Care Discovery: Browse medical departments and find verified doctors based on experience, rating, and location.
- Interactive Slot Booking: Select and reserve 15-minute consultation slots. Includes a 3-minute temporary reservation lock to prevent double-booking.
- Medical History Attachment: Attach medical documents (PDF format) during the booking process.
- Virtual Chatbot: Discuss symptoms with an empathetic AI Clinical Diagnostic Engine that routes to the appropriate medical department and indicates priority level.

### Doctor Workflows
- Availability Management: Configure recurring schedules and auto-generate available booking slots.
- Consultation Logs: Review past consultation history and patient notes.
- In-App Notifications: Receive instant notifications for slot reservations, booking confirmations, and cancellations.

### Admin Workflows
- Doctor Verification: Review, approve, or reject new doctor registrations.
- Facility Control: Create, update, or remove hospitals, clinics, and medical specializations.

---

## Architecture & Integration Specs

- Database: Relational structure using MySQL.
- Security: Stateless API security with JWT (JSON Web Tokens) and Spring Security filter chains.
- AI Integration: Automated symptom evaluation and consultation summaries powered by the Google Gemini API. Includes a local heuristic fallback parser when the API is offline.
- Real-World Alerts: SMS dispatching using the Twilio API, and email alerts via Gmail SMTP.
- Cloud Storage: Image and document uploads integrated with Cloudinary.
- Payments: Order creation and transaction verification using the Razorpay API.

---

## Getting Started

### Prerequisites
- Java Development Kit (JDK) 17 or higher
- Node.js (v18 or higher) and npm
- MySQL Server (v8.0 or higher)

### Backend Setup (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd healthcare-system
   ```

2. Configure database and integration credentials in `src/main/resources/application.properties`:
   - Set `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` to match your local MySQL server.
   - (Optional) Configure Twilio, Gmail SMTP, and Gemini API keys for live integrations.

3. Install dependencies and run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend API will be available at `http://localhost:8080`. API documentation is accessible via Swagger UI at `http://localhost:8080/swagger-ui/index.html`.

### Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in a `.env` file inside the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The client application will run at `http://localhost:5173`.

---

## Deployment Configuration

This project is configured to run smoothly on cloud application hosts like Render or Railway.

### Backend (Render Web Service)
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -jar target/healthcare-system-0.0.1-SNAPSHOT.jar`
- Environment Variables required:
  - `JAVA_VERSION`: `17`
  - `DB_URL`: JDBC URL pointing to your hosted MySQL database.
  - `DB_USERNAME` & `DB_PASSWORD`: Hosted database credentials.

### Frontend (Render Static Site / Vercel)
- Build Command: `npm run build`
- Publish Directory: `dist`
- Environment Variables required:
  - `VITE_API_URL`: The public HTTPS URL of your deployed backend service.
- Routing Configuration: A `_redirects` file is included in the public directory to ensure client-side routing redirects all traffic to `index.html` (preventing 404 errors on page reload).
